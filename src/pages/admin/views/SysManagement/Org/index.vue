<template>
  <div class="layout_left-right">
    <Row :gutter="24">
      <i-col span="6">
        <Card 
          ref="card-tree"
          :bordered="false"
          class="card-fix"
          dis-hover>
          <p slot="title">组织结构</p>
          <Tree 
            v-if="!treeErrorMsg"
            :data="treeList"
            :empty-text="emptyText"
            @on-select-change="onOrgSelectChange" 
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
        <org-content 
          ref="content"
          :data="content"
          :hide-del="hideDel"
          @on-emit="onEmited"/>
      </i-col>
    </Row>
  </div>
</template>
<script>
import OrgContent from './content'
import { indexMixins } from '_admin/mixins/like-sys-dict'

import { 
  fetchOrgTreeList,
  updateOrgItem
} from '_admin/api/sys'

export default {
  components: {
    OrgContent
  },
  mixins: [indexMixins],
  data () {
    return {
      hideDel: true,

      content: {
        title     : '组织结构',
        btnLoading: false,

        childNodeBtnShow: true,
        selectedId      : '',
        selectedPid     : '',

        hasChild: false,
        form    : {
          name           : '',
          orgCode        : '',
          creditCode     : '',
          sort           : '',
          chargePerson   : '',
          chargePersonTel: '',
          desc           : ''
        }
      }   
    }
  },
  computed: {
    rootIdList () {
      return this.treeList.map(item => item.id)
    }
  },
  created () {
    this.fetchTreeList()
    this.updateItem = async (pid, id) => {
      const _model = id ? this.content.form : this.$refs.content.modalForm
      const { 
        name, 
        desc: description, 
        orgCode: value,
        creditCode: code, 
        sort, 
        name: title,
        chargePerson: contactPerson,
        chargePersonTel: contactNumber
      } = _model
      const _parentFullOrgId = this.curSelectedNode.parentFullOrgId
      const parentFullOrgId = id ? _parentFullOrgId : `${_parentFullOrgId}/${pid}`
      return await updateOrgItem({ 
        id, pid, name, title, sort, value, 
        description, code, contactPerson, contactNumber, parentFullOrgId
      })
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
      fetchOrgTreeList().then(res => {
        const { code, data, msg } = res
        if (code === 0) {
          if (!data || !data.length) {
            this.emptyText = '暂无数据'
            return 
          }
          this.treeList = this.treeList = expand ? this.handleExpand(data) : data

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
        desc: description, 
        orgCode: value,
        creditCode: code, 
        sort, 
        name: title,
        chargePerson: contactPerson,
        chargePersonTel: contactNumber
      } = data
      Object.assign(this.originalCurNode, {
        name, title, sort, value, description, code, contactPerson, contactNumber
      })
    },
    onOrgSelectChange (upperNode, curNode) {
      this.hideDel = this.rootIdList.indexOf(curNode.id) > -1
      const content = this.content
      if (!upperNode.length) {
        content.selectedId = ''
        this.$refs.content.resetFields()
        return 
      }
      this.originalCurNode = curNode
      const { 
        pid, id, title, sort, value, description, 
        code, contactPerson, contactNumber, children, fullOrgId: parentFullOrgId
      } = curNode
      const hasChild = children.length > 0
      this.curSelectedNode = Object.freeze({ pid, id, title, hasChild, parentFullOrgId })
      
      Object.assign(content.form, {
        desc           : description, 
        orgCode        : value,
        creditCode     : code, 
        sort, 
        name           : title,
        chargePerson   : contactPerson,
        chargePersonTel: contactNumber
      })
      Object.assign(content, {
        childNodeBtnShow: true,
        selectedId      : id,
        selectedPid     : pid,
        parentFullOrgId,
        hasChild
      })
    }
    
  }
}
</script>