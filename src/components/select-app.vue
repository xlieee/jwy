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
      {{option.fullName}}
    </Option>
  </Select>
</template>
<script>
import { fetchCloudAppList } from '@/api'
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
            fullName: cur.fullName, 
            id      : cur.id  
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
        fetchCloudAppList(query).then(res => {
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