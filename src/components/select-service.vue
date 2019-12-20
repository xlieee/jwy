<template>
  <Select
    v-bind="$attrs"
    v-on="$listeners"
    ref="select"
    filterable
    remote
    loading-text="获取数据中..."
    :remote-method="handleRemoteMethod"
    :loading="loading"
    placeholder="请输入搜索选择">
    <Option 
      v-for="option in optionList" 
      ref="option"
      :value="option.id" 
      :label="option.fullName"
      :key="option.id">
      <!-- <span 
        class="service-name"
        :style="`width: ${option.from? '400px': '500px'}`" 
        :title="option.fullName">{{option.fullName}}</span>
      <span v-if="option.from" class="service-span" :title="option.from">{{option.from}}</span> -->
      <span 
        class="service-name" 
        :title="option.fullName">{{option.fullName}}</span>
    </Option>
  </Select>
</template>
<script>
import { fetchDaasServiceByName } from '@/api'
export default {
  props: {
    defaultOptionList: {
      type: Array
    }
  },
  data () {
    function debounce (fn, wait) {
      let timer = null
      return query => {
        if (timer) clearTimeout(timer)  
        timer = setTimeout(fn.bind(this, query), wait)
      }
      
    }
    this.handleRemoteMethod = debounce(this.handleRemoteMethod, 500)
    
    return {
      loading   : false,
      optionList: []
    }
  },
  watch: {
    defaultOptionList: {
      immediate: true,
      handler (newVal) {
        if (Array.isArray(newVal) && newVal.length) {
          this.addOptionList(JSON.parse(JSON.stringify(newVal)))
          this.$nextTick(() => {
            const { select, option } = this.$refs
            const selectValue = select.value
            option.find(item => selectValue === item.value).select()
            this.$nextTick(() => select.$el.querySelector('input[type="text"]').blur())
          })
        }
      }
    }
  },
  methods: {
    addOptionList (list) {
      const optionList = this.optionList
      const filterList = list.reduce((ret, cur) => {
        if (!optionList.find(item => cur.id === item.id)) {
          ret.push({
            fullName    : cur.fullName, 
            id          : cur.id,
            subclassName: cur.subclassName 
          })
        }
        return ret
      }, [])
      this.optionList = optionList.concat(filterList)
    },
    handleRemoteMethod (query) {
      query = query ? query.trim() : ''
      if (query.length >= 2) {
        const queryedList = this.queryedList
        const optionList = this.optionList
        const isExistInQueryedList = queryedList && queryedList.find(item => query === item)
        const isExistInList = optionList.find(item => query === item.fullName)
        if (isExistInQueryedList || isExistInList) return
        
        this.loading = true
        fetchDaasServiceByName(query).then(res => {
          this.loading = false
          const { data } = res
          this.queryedList = queryedList || []
          this.queryedList.push(query)

          this.addOptionList(data)
        })
      }
    }
  }
}
</script>
<style lang="scss">
.service {
  &-name {
    display: inline-block;
    width: 500px;
    @extend %ellipsis;
  }
  &-span {
    float: right;
    width: 120px;
    text-align: right;
    @extend %ellipsis;
  }
}
</style>