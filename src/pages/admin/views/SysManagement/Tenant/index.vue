<template>
  <div>
    <query-block
      v-once
      :query="query"
      :on-click-query="onClickQuery"
      :on-click-add="onClickAdd" />
    <div style="height: 16px"></div>
    <table-block 
      :page="page" 
      :table="table" 
      page-avaliable
      @on-emit="onTableBlockEmited">
      <form-modal 
        :modal="modal"
        :width="600"
        @on-emit="onFormModalEmited">
        <modal-form 
          ref="modalForm"
          :all-org-list="allOrgList"
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

import { asyncDelRowById, fetchAllOrgList } from '_admin/api/common'
import { 
  fetchTenantList,
  updateTenant 
} from '_admin/api/sys'

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
      // QueryBlock
      query: {
        name   : '',
        orgName: ''
      },

      // ModalForm
      modalForm: {
        name        : '',
        jurisdiction: []
      },

      // FormModal
      modal: {
        show      : false,
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
            title: '租户名称',
            key  : 'name'
          },
          {
            title : '管辖组织机构',
            key   : 'jurisdiction',
            render: (h, { row: { orgList } }) => [orgList ? orgList.map(item => item.name).join('，') : '']
          },
          {
            title : '操作',
            width : 120,
            render: (h, { row }) => {
              const actions = [
                { icon: 'edit', title: '编辑', type: 'edit' },
                { icon: 'del', title: '删除', type: 'del' }
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
        loading : false,
        data    : [],
        curIndex: -1,
        curId   : ''
      },
      allOrgList: []
    }
  },
  created () {
    fetchAllOrgList().then(res => {
      const { code, data } = res
      if (code === 0) {
        this.allOrgList.push(...JSON.parse(JSON.stringify(data)))
        this.fetchTableList()
      }
    })
  },
  methods: {
    // QueryBlock
    onClickQuery () {
      this.page.currentPage = 1
      this.fetchTableList()
    },
    onClickAdd () {
      this.table.curIndex = -1
      this.table.curId = undefined
      this.modal.title = '新增租户'
      this.modal.show = true
    },
    fetchTableList () {
      this.table.loading = true
      const { name, orgName } = this.query
      const { currentPage: current, pageSize: size } = this.page
      fetchTenantList({ current, size, name, orgName }).then(res => {
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
    onClickRowAction ({ type, row }) {
      const id = row.tenantId
      if (type === 'edit') {

        const { table, modal, modalForm } = this 
        this.table.curId = id
        const { _index, name } = row
        const _row = { _index, name }
        _row.jurisdiction = row.orgList.map(item => item.id)
        this.handleEditAction(_row, { table, modal, modalForm })

      } else if (type === 'del') {
        this.handleDelActionAsync(id)

      }
    },
    updateItem () {
      const { name, jurisdiction: orgIds } = this.modalForm
      return updateTenant({
        id: this.table.curId, name, orgIds
      })
    },
    handleDelActionAsync (id) {
      this.$xlModal.show({
        loading: true,
        msg    : '是否确认删除此租户?',
        ok     : async next => {
          const { code, msg } = await asyncDelRowById(`/sys/tenant/delete/${id}`)
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
    
    // FormModal
    
    onFormModalEmited ({ type, value }) {
      if (type === 'on-visible-change') {
        this.onVisibleChange(value, 'modalForm')
      } else if (type === 'on-click-btn') {
        const { modal, modalForm, table, $refs } = this
        this.onClickModalBtn(value, { modal, modalForm, table, $refs })
      }
      
    }
    
  }
}
</script>