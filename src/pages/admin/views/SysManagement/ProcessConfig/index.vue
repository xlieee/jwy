<template>
  <div>
    <query-block 
      ref="query"
      :process-list="processList"
      :on-click-query="onClickQuery"
      :on-click-add="onClickAdd"/>
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
    </Card>
    <Modal
      v-model="modal.show"
      @on-visible-change="onVisibleChange"
      :title="modal.title"
      :mask-closable="!modal.btnLoading"
      :styles="styles"
      class-name="ivu-modal-wrap-admin-top"
      class="modal-fullscreen-fix"
      fullscreen
      :mask="false"
      scrollable>
      <modal-form
        ref="modalForm"
        :process-list="processList" />
      <Spin size="large" fix v-if="modal.loading"></Spin>

      <div slot="footer">
        <Button 
          @click="onClickModalBtn('cancel')"
          class="btn140 btn-cancel">取消</Button>
        <Button 
          @click="onClickModalBtn('confirm')"
          :loading="modal.btnLoading"
          :disabled="modal.loading"
          class="btn140 btn-ok">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import QueryBlock from './query-block'
import ModalForm from './modal-form'
import { asyncDelRowById } from '@/api'
import { 
  fetchWorkflowList,
  fetchWorkflowById,
  updateWorkflow 
} from '_admin/api/sys'

export default {
  components: {
    QueryBlock,
    ModalForm
  },
  data () {
    return {
      processList: [
        '非默认流程',
        '上云应用申请默认流程',
        'SAAS申请默认流程',
        'DAAS申请默认流程',
        'PAAS申请默认流程',
        'IAAS申请默认流程',
        '服务发布默认流程',
        '应用注册默认流程'
      ],

      // FormModal
      modal: {
        show      : false,
        loading   : false, // 返回结果前禁止提交
        btnLoading: false,
        title     : '',
        curIndex  : -1,
        curId     : ''
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
            title   : '流程名称',
            key     : 'name',
            ellipsis: true,
            tooltip : true
          },
          {
            title   : '流程说明',
            key     : 'description',
            ellipsis: true,
            tooltip : true
          },
          {
            title : '流程类型',
            width : 170,
            key   : 'type',
            render: (h, { row:{ type } }) => [this.processList[type]]
          },
          {
            title: '创建时间',
            width: 170,
            key  : 'createTime'
          },
          {
            title    : '操作',
            width    : 120,
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
    styles () {
      const leftOffset = this.$store.getters.leftOffset
      return {
        marginLeft: `${leftOffset}px`,
        width     : `calc(100% - ${leftOffset}px) !important`
      }
    }
  },
  mounted () {
    this.fetchTableList()
  },
  methods: {
    // QueryBlock
    onClickQuery () {
      this.page.currentPage = 1
      this.fetchTableList()
    },
    fetchTableList () {
      this.table.loading = true
      const { name, type } = this.$refs.query.query
      const { currentPage: current, pageSize: size } = this.page
      fetchWorkflowList({ 
        current, size, name, type: type === -1 ? undefined : type
      }).then(res => {
        this.table.loading = false
        const { code, data } = res
        if (code === 0) {
          const { total, records } = data
          this.table.data = records
          this.page.pageTotal = total
        }
      })
    },
    onClickAdd () {
      const { modal } = this
      modal.curIndex = -1
      modal.curId = ''
      modal.show = true
    },
    onClickRowAction ({ type, row }) {
      const { id, index, title } = row
      if (type === 'detail') {
        this.handleDetailAction(id, index, title)
      } else if (type === 'del') {
        this.handleDelActionAsync(id)
      }
    },
    optionListAdd (list, optionList) {
      console.log(optionList)
      const collection = []
      list.forEach(item => {
        const { id } = item 
        const find = optionList.find(v => id === v.id)
        if (!find) {
          collection.push(item)
        }
      })
      optionList.push(...collection)
    },
    handleDetailAction (id, index, title) {
      const { modal } = this
      Object.assign(modal, {
        curIndex: index,
        curId   : id,
        title   : title,
        show    : true,
        loading : true
      })
      fetchWorkflowById(id).then(res => {
        modal.loading = false
        const { code, data, msg } = res
        if (code === 0) {
          const { modalForm:{ form, optionList } } = this.$refs
          Object.keys(form).forEach(key => {
            let _data
            if (key === 'modelVoList') {
              _data = data[key] ? data[key].map(item => {
                const {
                  name,
                  handlePersonVo:handlePerson,
                  informPersonVo:informPerson,
                  participatePersonVo: participatePerson
                } = item

                ;[handlePerson, informPerson, participatePerson].forEach(v => {
                  v && v.length && this.optionListAdd (v, optionList)
                })

                return { name, handlePerson, informPerson, participatePerson }
              }) : []
            } else {
              _data = data[key]
            }
            form[key] = _data
          })

        } else {
          this.$Message.error(msg)
        }
      })
    },
    handleDelActionAsync (id) {
      this.$xlModal.show({
        loading: true,
        msg    : '是否确认删除此流程?',
        ok     : async next => {
          const { code, msg } = await asyncDelRowById(`/bpm/workflow/delete/${id}`)
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
    onVisibleChange (value) {
      if (!value) {
        const { modalForm } = this.$refs
        modalForm.form.modelVoList = []
        modalForm.resetFields()
      }
    },
    onClickModalBtn (type) {
      const { modal } = this
      if (type === 'cancel') {
        modal.show = false
      } else {
        const { modalForm } = this.$refs
        modalForm.validate(vaild => {
          if (vaild) {
            if (!modalForm.form.modelVoList.length) return this.$Message.info('配置信息不能为空!')
            modal.btnLoading = true
            const copyForm = JSON.parse(JSON.stringify(modalForm.form))
            const type = copyForm.type
            copyForm.modelVoList = copyForm.modelVoList.map(item => {
              const { name, handlePerson, informPerson, participatePerson } = item
              return {
                name,
                type,
                handlePerson     : handlePerson.map(v => v.id).join(','),
                informPerson     : informPerson.map(v => v.id).join(','),
                participatePerson: participatePerson.map(v => v.id).join(',')
              }
            })
            const { curIndex, curId } = modal
            if (curIndex !== -1) {
              copyForm.id = curId
            }
            updateWorkflow(copyForm).then(res => {
              modal.btnLoading = false
              modal.show = false
              const { code, msg } = res
              if (code === 0) {
                this.$Message.success(msg)
                modal.show = false
                this.fetchTableList()
              } else {
                this.$Message.error(msg)
              }
            })

          }
        })
      }
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
    }
  }
}
</script>