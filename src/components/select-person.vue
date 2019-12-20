<template>
  <Select
    v-bind="$attrs"
    v-on="$listeners"
    ref="select"
    :multiple="multiple"
    filterable
    remote
    loading-text="获取数据中..."
    :remote-method="handleRemoteMethod"
    @on-open-change="onOpenChange"
    :loading="loading"
    :placeholder="placeholder">
    <Option 
      v-for="option in optionList" 
      ref="option"
      :value="option.id" 
      :label="option.realName"
      :key="option.id">
      {{option.realName}}
      <span class="option-span" :title="option.orgNames">{{option.orgNames}}</span>
    </Option>
  </Select>
</template>
<script>
import { fetchUserByName } from '@/api'
export default {
  props: {
    multiple: {
      type: Boolean
    },
    placeholder: {
      type   : String,
      default: '请输入至少2个中文进行搜索或过滤'
    },
    defaultOptionList: {
      type: Array
    }
  },
  data () {
    function debounce (filterFn, fn, wait) {
      let timer = null
      return query => {
        let _query = filterFn(query)
        if (timer) clearTimeout(timer)  
        timer = setTimeout(fn.bind(this, _query), wait)
      }
      
    }
    this.handleRemoteMethod = debounce(this.filterQuery, this.handleRemoteMethod, 500)
    
    this.onOpenChange = this.multiple ? value => {
      if (!value) {
        this.$refs.select.query = ''
      }
    } : () => {}
    
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
          this.addOptionList(JSON.parse(JSON.stringify(newVal)), true)
          if (!this.multiple) {
            this.$nextTick(() => {
              const { select, option } = this.$refs
              const selectValue = select.value
              option.find(item => selectValue === item.value).select()
              this.$nextTick(() => select.$el.querySelector('input[type="text"]').blur())
            })
          }
        }
      }
    }
  },
  methods: {
    handleOption (item, orgNamesHandled) {
      const orgNames = orgNamesHandled ? item.orgNames : item.orgList.map(org => org.name).join(',')
      return {
        realName: item.realName, 
        id      : item.id, 
        orgNames 
      }
    },
    addOptionList (list, orgNamesHandled) {
      const optionList = this.optionList
      const filterList = list.reduce((ret, cur) => {
        if (!optionList.find(item => cur.id === item.id)) {
          ret.push(this.handleOption(cur, orgNamesHandled))
        }
        return ret
      }, [])
      this.optionList = optionList.concat(filterList)
    },
    filterQuery (query) {
      const _query = query.replace(/[^\u4e00-\u9fa5]+/g, '')

      if (this.multiple) {
        const ref = this.$refs.select
        ref.setQuery(_query || null)
        this.$nextTick(() => {
          ref.setQuery(_query || null)
        })
      }

      return _query
    },
    handleRemoteMethod (query) {
      if (query.length >= 2) {
        const queryedList = this.queryedList
        const optionList = this.optionList
        const isExistInQueryedList = queryedList && queryedList.find(item => query === item)
        const isExistInList = optionList.find(item => query === item.realName)
        if (isExistInQueryedList || isExistInList) return
        
        this.loading = true
        fetchUserByName(query).then(res => {
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