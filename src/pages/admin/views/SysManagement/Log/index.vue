<template>
  <div>
    <query-block
      v-once
      :query="query"
      :on-click-query="onClickQuery" />
    <div style="height: 16px"></div>
    <table-block 
      :page="page" 
      :table="table" 
      page-avaliable
      @on-emit="onTableBlockEmited">
      <form-modal 
        :modal="modal"
        :width="720">
        <modal-form 
          ref="modalForm"
          :form="modalForm" />
      </form-modal>
    </table-block>
  </div>
</template>
<script>
import TableBlock from '_admin/components/table-block.vue'
import FormModal from '_admin/components/form-modal.vue'
import ModalForm from './modal-form.vue'
import QueryBlock from './query-block.vue'

import tableBlock from '_admin/mixins/table-block'

import { fetchLogList } from '_admin/api/sys'

export default {
  components: {
    TableBlock,
    QueryBlock,
    FormModal,
    ModalForm
  },
  mixins: [tableBlock],
  data () {
    return {
      // query
      query: {
        name   : '',
        content: ''
      },
      // ModalForm
      modalForm: {
        name   : '',
        ip     : '',
        content: '',
        date   : ''
      },

      // FormModal
      modal: {
        show      : false,
        hideFooter: true,
        btnLoading: false,
        title     : ''
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
            width: 80
          },
          {
            title: '用户姓名',
            key  : 'operationUser'
          },
          {
            title: 'IP地址',
            key  : 'ipAddress'
          },
          {
            title: '操作内容',
            key  : 'operationDesc'
          },
          {
            title: '操作时间',
            key  : 'createTime'
          },
          {
            title : '操作',
            width : 80,
            render: (h, { row }) => {
              const actions = [
                { icon: 'edit', title: '详情', type: 'edit' }
              ]
              return actions.map(({ icon, type, title }) => {
                return (
                  <i 
                    onClick={() => this.onClickRowAction({ type, row })}
                    title={title} 
                    class={`icon_table-sprite icon_${icon}`}></i>
                )
              })
            }
          }
        ],
        loading : false,
        data    : [],
        curIndex: -1
      }
    }
  },
  created () {
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
      const { name, content } = this.query
      const { currentPage: current, pageSize: size } = this.page
      fetchLogList({ current, size, name, content }).then(res => {
        this.table.loading = false
        const { code, data } = res
        if (code === 0) {
          const { total, records } = data
          this.table.data = records
          this.page.pageTotal = total
        }
      })
    },
    // TableBlock
    handlePageActions ({ type, data }) {
      if (type === 'on-change-page') {
        this.page.currentPage = data.pageNum
        this.fetchTableList()
      } else if (type === 'on-page-size-change') {
        this.page.pageSize = data.pageSize
        if (this.page.currentPage === 1) {
          this.fetchTableList()
        }
      }
    },
    onTableBlockEmited ({ type, data }) {
      this.handlePageActions({ type, data })
    },
    onClickRowAction (params) {
      const type = params.type
      if (type === 'edit') {
        const { table, modal, modalForm } = this
        this.handleEditAction(params.row, { table, modal, modalForm })
      }
    }
    
  }
}
</script>