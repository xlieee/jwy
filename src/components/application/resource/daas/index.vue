<template>
  <div>
    <query-block 
      ref="query"
      :from-admin="fromAdmin"
      :collapsed="collapsed"
      :left-offset='leftOffset'
      :on-click-query="onClickQuery" />
    <div style="height: 16px"></div>
    <Card 
      :bordered="false" 
      dis-hover 
      class="card-table-fix">
      <Table 
        :columns="table.columns" 
        :data="table.data"
        :loading="table.loading"
        size="large"
        tooltip-theme="light" />
      <div class="page-wrapper">
        <Page 
          :total="page.pageTotal"
          :current="page.currentPage"
          show-total
          show-elevator
          show-sizer
          @on-change="onChangePage"
          @on-page-size-change="onPageSizeChange"
          placement="top" />
      </div>
      <Modal
        ref="modal"
        v-model="modal.show"
        @on-visible-change="onVisibleChange"
        :mask-closable="!modal.btnLoading"
        :styles="styles"
        :class-name="className"
        class="modal-fullscreen-fix modal-fullscreen-fix-header"
        fullscreen
        :mask="false"
        scrollable>
        <div slot="header">
          <div class="title">{{modal.title || '详情'}}</div>
          <modal-header-steps ref="modalSteps" :left-offset="leftOffset"/>
          <div style="height:24px"></div>
          <modal-header-tabs ref="modalTabs" :click="onClickTab"/>
        </div>
        <keep-alive>
          <component 
            :is="curCompoenent"
            @callback="handleCallback"
            ref="curCompoenent" 
            style="padding:0 20px 30px"/>
        </keep-alive>
        <Spin size="large" fix v-if="modal.loading"></Spin>

        <modal-footer 
          slot="footer" 
          ref="modalFooter"
          @on-click-confirm="onClickConfirm"
          @on-click-btn="onClickGroupBtn"
          @on-close-modal="modal.show = false" />
      </Modal>
    </Card>
  </div>
</template>
<script>
import QueryBlock from './query-block'
import ModalHeaderSteps from './modal-header-steps'
import ModalHeaderTabs from './modal-header-tabs'
import ModalFooter from './modal-footer/index.vue'

import ResourceInfo from './content-resource-info'
import ApprovalInfo from '@/components/approval-info'
import BizDeal from './content-biz-deal'
import FeedbackInfo from '@/components/feedback-info'

import {
  fetchPageList,
  fetchDetailById,
  fetchBizList,
  fetchWebPageList
} from '@/api/application'
import { 
  asyncDelRowById,
  fetchFeedbackList,
  fetchApprovalList,
  asyncAddFeedback,
  updateProcess,
  fetchProcessStepList,
  asyncApplySubmit
} from '@/api'

import observable from './observable'

export default {
  components: {
    QueryBlock,
    ModalHeaderSteps,
    ModalHeaderTabs,
    ModalFooter,
    ResourceInfo,
    ApprovalInfo,
    BizDeal,
    FeedbackInfo
  },
  inject: {
    dynamicVar: {
      default: () => ({ type: 'daas', resourceType: 3 })
    }
  },

  props: {
    leftOffset: {
      type: Number
    },
    fromAdmin: Boolean,
    collapsed: Boolean,
    className: String,
    from     : String
  },
  data () {
    return {
      curCompoenent: '',

      share: {
        canEdit        : false,
        canBiz         : false,
        currentStepName: ''
      },
      
      // FormModal
      modal: {
        show      : false,
        loading   : false, // 返回结果前禁止提交
        btnLoading: false,
        title     : '',
        curIndex  : -1,
        curId     : '',
        orderNum  : ''
      },
      // TableBlock
      page: {
        pageTotal  : 0,
        pageSize   : 10,
        currentPage: 1
      },
      table: {
        columns: [
          {
            title: '序号',
            type : 'index',
            width: 70
          },
          {
            title   : '申请单号',
            key     : 'orderNum',
            ellipsis: true,
            tooltip : true
          },
          {
            title: '申请人',
            width: 100,
            key  : 'applyUser'
          },
          {
            title   : '申请单位',
            key     : 'orgName',
            ellipsis: true,
            tooltip : true
          },
          {
            title   : '资源名称',
            key     : 'sourceName',
            ellipsis: true,
            tooltip : true
          },
          {
            title : '状态',
            width : 110,
            key   : 'state',
            render: (h, { row:{ color, state } }) => <Badge class="badge-fix-table" color={color} text={state} />
          },
          {
            title: '当前环节',
            width: 140,
            key  : 'node'
          },
          {
            title: '当前处理人',
            width: 110,
            key  : 'operatorUser'
          },
          {
            title: '申请时间',
            width: 160,
            key  : 'createTime'
          },
          {
            title    : '操作',
            width    : 100,
            className: 'table-column-fix',
            render   : (h, { row }) => {
              const actions = [
                { icon: 'detail', type: 'detail', title: '详情' },
                { icon: 'del', type: 'del', title: '删除' }
              ]
              return actions.map(({ icon, type, title }) => {
                return (
                  <Tooltip 
                    content={title} 
                    theme="light" 
                    placement="top"
                    class="tooltip-fix">
                    <i 
                      onClick={() => this.onClickRowAction({ type, row })}
                      class={`icon-sprites-g1 icon-${icon}`}></i>
                  </Tooltip>
                  
                )
              })
            }
          }
        ],
        data   : [],
        loading: false
      }
    }
  },
  computed: {
    // .ivu-modal
    styles () {
      const leftOffset = this.leftOffset
      return {
        marginLeft: `${leftOffset}px`,
        width     : `calc(100% - ${leftOffset}px) !important`
      }
    }
  },
  provide () {
    return {
      share: this.share
    }
  },
  mounted () {
    this.fetchTableList()
    this.$watch('dynamicVar.resourceType', () => {
      Object.assign(this.$refs.query.query, {
        orderNum: '',
        state   : this.fromAdmin ? -1 : 0,
        time    : ['', ''],
        name    : ''
      })
      this.fetchTableList()
    }) 
  },
  methods: {
    onClickQuery () {
      this.page.currentPage = 1
      this.fetchTableList()
    },
    fetchTableList () {
      this.table.loading = true
      const { name, orderNum, time:[startDate, endDate], state } = this.$refs.query.query
      const { currentPage: current, pageSize: size } = this.page
      
      const fetchFn = this.fromAdmin ? fetchPageList : fetchWebPageList
      fetchFn({
        current, size, name, startDate, endDate, orderNum,

        [this.fromAdmin ? 'state' : 'status']: state === -1 ? '' : state,

        type: this.dynamicVar.resourceType
      }).then(res => {
        this.table.loading = false
        const { code, data, msg } = res
        if (code === 0) {
          const { total, records } = data
          this.table.data = records
          this.page.pageTotal = total
        } else {  
          this.$Message.error(msg)
        }
      })
    },

    onVisibleChange (value) {
      if (!value) {
        this.$refs.modal.$el.querySelector('.ivu-modal-body').scrollTop = 0
      }
    },
    onClickRowAction ({ type, row:{ id, orderNum, viewName } }) {
      if (type === 'detail') {
        if (this.modal.curId === id) {
          this.modal.show = true
          return
        }
        this.handleFooterBtn()
        this.modal.curId = id
        this.modal.orderNum = orderNum
        this.modal.show = true
        this.handleDetailAction(id)
        observable.setState('viewName', viewName)

      } else if (type === 'del') {
        this.handleDelActionAsync(id)
      }
    },
    handleFooterBtn (permissions = []) {
      const { btnList } = this.$refs.modalFooter
      const canEdit = permissions.includes('EDIT')
      this.share.canEdit = canEdit
      if (!permissions.length) {
        btnList.forEach(btn => {
          btn.show = false
        })
        return 
      }
      if (permissions.includes('SUBMIT')) {
        btnList[0].show = true
        btnList[1].show = true
      } else {
        if (canEdit) {
          btnList[1].show = true
        }
      }
      if (permissions.includes('APPROVAL')) {
        btnList[2].show = true
        btnList[3].show = true
        btnList[4].show = true
      } else {
        if (permissions.includes('PATICIPANT')) {
          btnList[2].show = true
        }
      }
    },
    handleDetailAction (id, isUpdate = false) {
      const { modal } = this
      modal.loading = true
      fetchDetailById(id).then(res => {
        modal.loading = false
        const { code, data, msg } = res
        if (code === 0) {
          observable.setState('resource', data)
          this.handleFooterBtn(data.permissions || [])
          if (!isUpdate) {
            this.$refs.modalTabs.value = 'resource-info'
            this.curCompoenent = 'resource-info'
          }
        } else {
          this.$Message.error(msg)
        }
      })
      this.fetchProcessStepList()
      
    },
    fetchProcessStepList (orderNum) {
      const { modalSteps, modalTabs } = this.$refs
      modalSteps.loading = true
      fetchProcessStepList(orderNum || this.modal.orderNum).then(res => {
        const { code, data } = res
        if (code === 0) {
          modalSteps.loading = false
          const { wfmList, lastedTask, status } = data
          modalSteps.list =  [
            modalSteps.list[0],
            modalSteps.list[1],
            ...wfmList.map(item => ({ title: item.name }))
          ]
          let current = 0
          if (status === 0) {
            current = wfmList.findIndex(item => lastedTask.workflowModelId === item.id) + 2
          } else if (status === 1) {
            current = modalSteps.list.length
            this.share.canBiz = false
          } else {
            current = 1
          }
          const len = modalSteps.list.length
          const isProcessBiz = len - 1 === current
          if (isProcessBiz) {
            this.share.canBiz = true
            this.fetchBizList()
          }
          modalTabs.list[2].disabled = !isProcessBiz
          modalSteps.current =  current
          this.share.currentStepName = modalSteps.list[current].title
        }
      })
    },
    fetchBizList (id) {
      fetchBizList(id || this.modal.curId).then(res => {
        const { code, data } = res
        if (code === 0) {
          observable.setState('biz', data)
        }
      })
    },
    fetchApprovalList (callback) {
      const orderNum = this.modal.orderNum
      fetchApprovalList(orderNum).then(res => {
        const { code, data } = res
        if (code === 0 && Array.isArray(data) && data.length) {
          this.$refs.curCompoenent.list =  data
          callback && callback(orderNum)
        }
      })
    },
    fetchFeedbackList (id) {
      fetchFeedbackList(id || this.modal.curId).then(res => {
        const { code, data } = res
        if (code === 0 && Array.isArray(data) && data.length) {
          const curCompoenent = this.$refs.curCompoenent
          curCompoenent.list =  data
          curCompoenent.replyAble = observable.state.resource.permissions.includes('FEEDBACK')
        }
      })
    },
    handleDelActionAsync (id) {
      this.$xlModal.show({
        loading: true,
        msg    : '是否确认删除此表单?',
        ok     : async next => {
          const { code, msg } = await asyncDelRowById(`/bpm/applyOrder/delete/${id}`)
          next()
          if (code === 0) {
            this.$Message.success(msg)
            this.fetchTableList()
          } else {
            this.$Message.error(msg)
          }
        }
      })
    },
    // page
    onChangePage (pageNum) {
      this.page.currentPage = pageNum
      this.fetchTableList()
    },
    onPageSizeChange (pageSize) {
      this.page.pageSize = pageSize
      if (this.page.currentPage === 1) {
        this.fetchTableList()
      }
    },

    onClickTab (name) {
      if (name === this.curCompoenent) return 
      this.curCompoenent = name
      const curCompoenent = this.$refs.curCompoenent
      const curCompoenentName = curCompoenent.name
      if (name === 'feedback-info') {
        if (curCompoenentName !== name) {
          this.fetchFeedbackList()
        } 
      } else if (name === 'approval-info') {
        if (curCompoenentName !== name) {
          this.fetchApprovalList()
        } 
      }
    },
    handleCallback ({ type, data }) {
      const id = this.modal.curId
      if (type === 'feedback-info') {
        asyncAddFeedback({
          orderId: id,
          content: data
        }).then(res => {
          const { code, msg } = res
          if (code === 0) {
            this.fetchFeedbackList(id)
            const { curCompoenent } = this.$refs
            curCompoenent.reply = ''
            curCompoenent.spinShow = false
            this.$Message.success(msg)
          } else {
            this.$Message.error(msg)
          }
        })
      }
    },

    onClickGroupBtn ({ type }) {
      const { resource } = observable.state
      const { $refs:{ modalFooter:{ btnList } }, modal } = this
      const btn = btnList.find(btn => type === btn.type)
      modal.loading = true
      btn.loading = true
      let _data = {}
      let asyncFn = null
      if (type === 'save') {
        const { biz } = observable.state
        if (this.curCompoenent === 'resource-info') {
          const { 
            id, orgId, applyUser, applyPhone,
            appId, applyIntroduction, departmentApprovalUser, fileList
          } = resource
          _data = {
            id, orgId, applyUser, applyPhone,
            appId, applyIntroduction, departmentApprovalUser,
            fileId: fileList.map(item => item.id).join(',')
          }
        } else {
          const {
            id, dealIntroduction, implementFileList
          } = biz
          _data = {
            id, dealIntroduction,
            implementFile: implementFileList.map(item => item.id).join(',')
          }
        }
        asyncFn = asyncApplySubmit
      
      } else if (type === 'submit') {
        _data = {
          id  : resource.id,
          type: 4
        }
        asyncFn = updateProcess
      }
      asyncFn(_data).then(res => {

        modal.loading = false
        btn.loading = false

        const { code, msg } = res
        if (code === 0) {
          if (type === 'submit') {
            this.fetchDetailById(resource.id)
            this.fetchProcessStepList()
          }
          this.$Message.success(msg)
        } else {
          this.$Message.error(msg)
        }
      })
      
    },
    onClickConfirm ({ type, data, text }) {
      const { modalFooter } = this.$refs
      const modal = modalFooter.modal
      const { id, taskId } = observable.state.resource
      const commonData = {
        id, taskId, 
        type   : ['approval', 'add', 'forward'].indexOf(type) + 1,
        comment: data.comment
      }
      const extraData = {}

      if (type === 'approval') {
        extraData.result = data.result
        const permissions = observable.state.resource.permissions
        if (permissions.includes('PATICIPANT') && !permissions.includes('APPROVAL')) {
          commonData.type = 5
        }
      } else if (type === 'forward' || type === 'add') {
        extraData.person = data.person
      }
      
      modalFooter.confirmLoading = true
      updateProcess({ ...commonData, ...extraData }).then(res => {
        const { code, msg } = res
        if (code === 0) {
          this.$Message.success({
            content: `${text}成功！`,
            onClose: () => {
              modalFooter.resetFields()
              modalFooter.confirmLoading = false
              modal.show = false
            }
          })
          if (type === 'approval') {
            this.handleDetailAction(this.modal.curId, true)
            this.fetchApprovalList(this.fetchProcessStepList)
          }
        } else {
          modalFooter.confirmLoading = false
          this.$Message.error(msg)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.modal-fullscreen-fix-header {
  .ivu-modal-header {
    padding-bottom: 0;
  }
  .ivu-modal-body {
    top: 150px;
    padding: 0;
  }
  .title {
    padding: 2px 0 28px;
    font-size: 16px;
    font-weight: 600;
  }
}

</style>