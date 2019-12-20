<template>
  <div class="layout_left-right">
    <Row :gutter="24">
      <i-col span="6">
        <Card 
          ref="card-tree"
          :bordered="false" 
          class="card-fix"
          dis-hover>
          <p slot="title" class="card-title">数据字典</p>
          <Tree 
            v-if="!treeErrorMsg"
            :data="treeList"
            :empty-text="emptyText"
            @on-select-change="onDictSelectChange" 
            class="common-tree-fix"/>
          <div 
            v-else
            class="ivu-tree-empty">{{treeErrorMsg}}
            <Icon 
              @click="fetchTreeList"
              type="md-refresh-circle" 
              size="24" 
              title="重新获取"
              style="float:right;cursor:pointer" />
          </div>
        </Card>
      </i-col>
      <i-col span="18">
        <dict-content 
          ref="content"
          :data="content"
          @on-emit="onEmited"/>
      </i-col>
    </Row>
  </div>
</template>
<script>
import DictContent from './content'
import { indexMixins } from '_admin/mixins/like-sys-dict'

import { 
  fetchDictTreeList, 
  updateDictItem 
} from '_admin/api/sys'

export default {
  components: { DictContent },
  mixins    : [indexMixins],
  data () {
    return {
      content: {
        title     : '数据字典',
        btnLoading: false,

        childNodeBtnShow: true,
        selectedId      : '',
        selectedPid     : '',
        selectedPvalue  : '',
        
        hasChild       : false,
        rootNodeBtnShow: false,
        form           : {
          name: '',
          code: '',
          sort: '',
          desc: ''
        }
      }
    }
  },
  created () {
    this.fetchTreeList()

    this.updateItem = async (pid, id) => {
      const _model = id ? this.content.form : this.$refs.content.modalForm
      const { name, desc: remark, sort, code: value } = _model
      const isRootNode = this.$refs.content.clickNodeType === 'root-node'
      const pvalue = id ? this.content.selectedPvalue : isRootNode ? null : this.curSelectedNode.value
      return await updateDictItem({ id, pid, name, remark, sort, value, pvalue })
    }
  },
  methods: {
    handleExpand (data) {
      const expandIds = {}
      this.treeList.forEach(function self (item) {
        const { id, children, expand } = item
        if (children.length) {
          children.forEach(self)
        }
        if (expand === true) {
          expandIds[id] = true
        }
      })
      data.forEach(function self (item) {
        const { id, children } = item
        if (children.length) {
          children.forEach(self)
        }
        if (expandIds[id] === true) {
          item.expand = true
        }
      })
      return data
    },
    fetchTreeList (expand) {
      this.treeErrorMsg = ''
      fetchDictTreeList().then(res => {
        const { code, data, msg } = res
        if (code === 0) {
          if (!data || !data.length) {
            this.emptyText = '暂无数据'
            return 
          }
          this.content.rootNodeBtnShow = true

          this.treeList = expand ? this.handleExpand(data) : data

          this.treeErrorMsg = ''
        } else {
          this.treeErrorMsg = msg
        }
      }).catch(() => {
        this.treeErrorMsg = '数据获取失败'
      })
    },
    onSave (data) {
      const { 
        name, 
        desc: remark, 
        code: value, 
        sort, 
        name: title 
      } = data
      Object.assign(this.originalCurNode, {
        name, title, sort, value, remark
      })
    },
    onDictSelectChange (upperNode, curNode) {
      const content = this.content
      if (!upperNode.length) {
        content.selectedId = ''
        this.$refs.content.resetFields()
        return 
      }
      this.originalCurNode = curNode
      const { pid, id, title, value, sort, remark, children, pvalue } = curNode
      const hasChild = children.length > 0
      this.curSelectedNode = Object.freeze({ pid, id, title, hasChild, value })
      Object.assign(content.form, {
        name: title,
        code: value,
        sort,
        desc: remark
      })
      Object.assign(content, {
        childNodeBtnShow: true,
        selectedId      : id,
        selectedPid     : pid,
        selectedPvalue  : pvalue,
        hasChild
      })
    }
  }
}
</script>