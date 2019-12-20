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
          :cur-index="table.curIndex"
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
  updateCarouselData,
  fetchCarouselData,
  updateOnlineCarousel,
  updateCarouselSort,
  fetchCarouselById
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
        title            : '',
        content          : '',
        briefIntroduction: '',
        createTime       : '',
        state            : 0,
        link             : 0,
        url              : '',
        image            : '',
        id               : '',
        imageUrl         : ''
      },

      // FormModal
      modal: {
        show      : false,
        btnLoading: false,
        title     : ''
      },

      // TableBlock
      page: {
        pageTotal: 1,
        size     : 10,
        current  : 1,
        name     : '',
        state    : ''
      },
      table: {
        columns: [
          {
            title: '序号',
            type : 'index',
            width: 80
          },
          {
            title   : '轮播新闻标题',
            key     : 'title',
            ellipsis: true
          },
          {
            title   : '链接',
            key     : 'url',
            ellipsis: true,
            render  : (h, { row }) => {
              if (row.link === 1) {
                return (<span>{row.url}</span>)
              } else {
                return (<span></span>)
              }
            }
          },
          {
            title: '创建时间',
            key  : 'createTime',
            width: 150
          },
          {
            title: '阅读量',
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
                return (<span>待上线</span>)
              }
            }
          },
          {
            title : '操作',
            width : 180,
            render: (h, { row }) => {
              const flag = row.state === 0 ? 'outline' : 'online'
              const flag1 = row._index === 0 ? 'up' : (row._index === this.table.data.length - 1 ? 'down' : '')
              const actions = [
                { icon: 'detail', type: 'edit', title: '编辑' },
                { icon: 'moveup', type: 'up', title: '上移' },
                { icon: 'movedown', type: 'down', title: '下移' },
                { icon: 'offline', type: 'outline', title: '下线' },
                { icon: 'online', type: 'online', title: '上线' },
                { icon: 'del', type: 'del', title: '删除' }
              ].filter(action => flag !== action.type && flag1 !== action.type)
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
      this.modalForm.id = ''
      this.modal.show = true
    },
    fetchTableList () {
      this.table.loading = true
      fetchCarouselData(this.page).then(res => {
        this.table.loading = false
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
      } else if (type === 'outline' || type === 'online') {
        //上线/下线
        updateOnlineCarousel(row).then(res => {
          if (res.code === 0) {
            this.$Message.success('操作成功!')
            this.fetchTableList()
          } else {
            this.$Message.error(res.msg)
          }
        })
      } else if (type === 'up' || type === 'down') {
        //上移/下移
        let data = {
          id    : row.id,
          nextId: type === 'up' ? this.table.data[row._index - 1].id : this.table.data[row._index + 1].id
        }
        updateCarouselSort(data).then(res => {
          if (res.code === 0) {
            this.$Message.success('操作成功!')
            this.fetchTableList()
          } else {
            this.$Message.error(res.msg)
          }
        })
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
      //轮播新闻详情
      fetchCarouselById(row.id).then(res => {
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
          const isSuccess = await asyncDelRowById(`/cms/carousel/delete/${id}`)
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
          if (vaild) {
            updateCarouselData(modalForm).then(res => {
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