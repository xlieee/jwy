<template>
  <div>
    <query-block
      v-once
      :query="page"
      :on-click-query="onClickQuery"
      :on-click-add="onClickAdd" />
    <div style="height: 16px"></div>
    <Card 
      :bordered="false" 
      dis-hover 
      class="card-table-fix">
      <Table 
        :columns="table.columns" 
        :data="table.data"
        :loading="table.loading"
        size="large" />
      <div class="page-wrapper">
        <Page 
          :total="page.pageTotal"
          :current="page.current"
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
        :title="modal.title || '详情'"
        class="modal-fix"
        transfer
        :width="840">
        <modal-form 
          ref="modalForm"
          :form="modalForm" 
          :curIndex='table.curIndex'
          :modalShow="modal.show"/>
        <div slot="footer">
          <Button @click="onClickModalBtn('cancel')">取消</Button>
          <Button 
            @click="onClickModalBtn('confirm')"
            :loading="modal.btnLoading"
            type="primary">确定</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>
<script>
import ModalForm from './modal-form.vue'
import QueryBlock from './query-block.vue'

import { 
  updateDocumentData,
  fetchDocumentData,
  updateOnlineDocument,
  updateTopNews,
  fetchDocumentById
} from '_admin/api/website'
import { asyncDelRowById } from '_admin/api/common'
export default {
  components: {
    QueryBlock,
    ModalForm
  },
  data () {
    return {
      // ModalForm
      modalForm: {
        title         : '',
        introduction  : '',
        createTime    : '',
        state         : '',
        classification: '',
        fileIds       : '',
        files         : [],
        id            : ''
      },

      // FormModal
      modal: {
        show      : false,
        btnLoading: false,
        title     : ''
      },

      // TableBlock
      page: {
        pageTotal     : 1,
        size          : 10,
        current       : 1,
        name          : '',
        state         : '',
        classification: ''
      },
      table: {
        columns: [
          {
            title: '序号',
            type : 'index',
            width: 80
          },
          {
            title   : '文档名称',
            key     : 'title',
            ellipsis: true
          },
          {
            title   : '文档分类',
            key     : 'classificationName',
            width   : 200,
            ellipsis: true
          },
          {
            title: '更新时间',
            key  : 'modifiedTime',
            width: 150
          },
          {
            title: '下载量',
            key  : 'readingNum',
            width: 110
          },
          {
            title: '操作人',
            key  : 'modifiedUserName',
            width: 120
          },
          {
            title : '状态',
            key   : 'state',
            width : 80,
            render: (h, { row }) => {
              if (row.state === 1) {
                return (<span>已上线</span>)
              } else {
                return (<span>未上线</span>)
              }
            }
          },
          {
            title : '操作',
            width : 150,
            render: (h, { row }) => {
              const flag = row.state === 0 ? 'offline' : 'online'
              const actions = [
                { icon: 'edit', type: 'edit', title: '编辑' },
                { icon: 'offtop', type: 'download', title: '下载' },
                { icon: 'offline', type: 'offline', title: '下线' },
                { icon: 'online', type: 'online', title: '上线' },
                { icon: 'del', type: 'del', title: '删除' }
              ].filter(action => flag !== action.type)
              
              return actions.map(({ type, title, icon }) => {
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
        data    : [],
        curIndex: -1
      }
    }
  },
  mounted () {
    this.fetchTableList()
  },
  methods: {
    
    // QueryBlock
    onClickQuery () {
      this.page.current = 1
      this.fetchTableList()
    },
    onClickAdd () {
      this.table.curIndex = -1
      this.modal.title = '新增'
      this.modal.show = true
      this.modalForm.id = ''
    },
    fetchTableList () {
      this.table.loading = true
      fetchDocumentData(this.page).then(res => {
        this.table.loading = false
        console.log(res, 'res')
        if (res.code === 0) {
          this.table.data = res.data.records
          this.page.pageTotal = res.data.total
        } else {
          this.table.data = []
          this.page.pageTotal = 0
        }
      })
    },

    // page
    onChangePage (pageNum) {
      this.page.current = pageNum
      this.fetchTableList()
    },
    onPageSizeChange (pageSize) {
      this.page.size = pageSize
      if (this.page.current === 1) {
        this.fetchTableList()
      }
    },

    // row-action
    onClickRowAction ({ type, row }) {
      if (type === 'edit') {
        //编辑
        this.handleEditAction(row)
      } else if (type === 'del') {
        this.handleDelActionAsync(row.id)
      } else if (type === 'offline' || type === 'online') {
        //上线/下线
        updateOnlineDocument(row).then(res => {
          if (res.code === 0) {
            this.$Message.success('操作成功!')
            this.fetchTableList()
          } else {
            this.$Message.error('操作失败!')
          }
        })
      } else if (type === 'top') {
        console.log(row, 'row')
        //置顶
        updateTopNews(row.id).then(res => {
          if (res.code === 0) {
            this.$Message.success('操作成功!')
            this.fetchTableList()
          } else {
            this.$Message.error('操作失败!')
          }
          console.log(res, 'res')
        })
      } else if (type === 'download') {
        console.log(this.$baseUrl)
        window.location.href = this.$baseUrl + '/fileStore/download/' + row.fileIds + '?BusinessId=' + row.id
        this.fetchTableList()
      }
    },
    handleEditAction (row) {
      const { _index } = row
      const { table, modal, modalForm } = this
      table.curIndex = _index 
      Object.assign(modal, {
        show : true,
        title: '详情'
      })
      //新闻详情
      fetchDocumentById(row.id).then(res => {
        Object.keys(modalForm).forEach(item => {
          modalForm[item] = res.data[item]
        })
      })
    },
    handleDelActionAsync (id) {
      this.$xlModal.show({
        loading: true,
        msg    : '是否确认删除此条数据?',
        ok     : async next => {
          const isSuccess = await asyncDelRowById(`/cms/document/delete/${id}`)
          next()
          isSuccess ? this.$Message.success('删除成功!') : this.$Message.error('删除失败!')
          this.fetchTableList()
        }
      })
    },
    
    // FormModal
    onVisibleChange (value) {
      if (!value) {
        this.$refs.modalForm.resetFields()
      }
    },
    onClickModalBtn (btnType) {
      const { modal } = this
      if (btnType === 'cancel') {
        modal.show = false
      } else if (btnType === 'confirm') {
        const { modalForm, /* table, */ $refs } = this
        modal.btnLoading = true

        $refs.modalForm.validate(vaild => {
          modal.btnLoading = false
          console.log(vaild)
          if (vaild) {
            updateDocumentData(modalForm).then(res => {
              console.log(res, 'edit')
              if (res.code === 0) {
                this.$Message.success('操作成功!')
                this.fetchTableList()
                modal.show = false
              } else {
                this.$Message.error('操作失败!')
              }
            })
          }
        })
      }
    }
  }
}
</script>