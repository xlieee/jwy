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
        :width="720"
        @on-emit="onFormModalEmited">
        <modal-form 
          ref="modalForm"
          :form="modalForm" />
      </form-modal>
    </table-block>
    <form-modal 
      :modal="modalPermission"
      :width="480"
      @on-emit="onPermissionModalEmited">
      <Tree 
        ref="permissionTree"
        :data="permissionTreeList" 
        show-checkbox
        check-directly
        class="tree-arrow-fix"></Tree>
    </form-modal>
  </div>
</template>
<script>
import TableBlock from '_admin/components/table-block.vue'
import FormModal from '_admin/components/form-modal.vue'
import ModalForm from './modal-form.vue'
import QueryBlock from './query-block.vue'

import tableBlock from '_admin/mixins/table-block'

import { asyncDelRowById } from '_admin/api/common'
import { 
  fetchRoleList, 
  updateRole,
  fetchPermissionList,
  fetchPermissionById,
  updatePermission
} from '_admin/api/sys'

let permissionTreeList = []
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
      query: {
        name: ''
      },
      // ModalForm
      modalForm: {
        name       : '',
        value      : '',
        description: ''
      },

      // FormModal
      modal: {
        show      : false,
        btnLoading: false,
        title     : ''
      },
      modalPermission: {
        show      : false,
        btnLoading: false,
        title     : '角色权限配置'
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
            title: '角色名称',
            key  : 'name'
          },
          {
            title: '角色描述',
            key  : 'description'
          },
          {
            title : '操作',
            width : 150,
            render: (h, { row }) => {
              const actions = [
                { icon: 'edit', title: '角色', type: 'edit' },
                { icon: 'permission', title: '权限', type: 'permission' },
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

      permissionTreeList: [],
      roleId            : ''
    }
  },
  created () {
    this.fetchTableList()
    fetchPermissionList().then(res => {
      const { code, data } = res
      if (code === 0) {
        permissionTreeList = data
      }
    })
  },
  methods: {
    copyPermissionTreeList () {
      return JSON.parse(JSON.stringify(permissionTreeList))
    },
    // QueryBlock
    onClickQuery () {
      this.page.currentPage = 1
      this.fetchTableList()
    },
    onClickAdd () {
      this.table.curIndex = -1
      this.table.curId = ''
      this.modal.title = '新建角色'
      this.modal.show = true
    },
    fetchTableList () {
      this.table.loading = true
      const { name } = this.query
      const { currentPage: current, pageSize: size } = this.page
      fetchRoleList({ current, size, name }).then(res => {
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
    updateItem () {
      const { name, value, description } = this.modalForm
      return updateRole({
        id: this.table.curId, name, value, description
      })
    },
    onClickRowAction ({ type, row }) {
      const id = row.id
      if (type === 'edit') {

        const { table, modal, modalForm } = this 
        this.table.curId = id
        this.handleEditAction(row, { table, modal, modalForm })

      } else if (type === 'del') {

        this.handleDelActionAsync(id)

      } else {

        this.handlePermissionAction(id)

      }
    },
    
    handleDelActionAsync (id) {
      this.$xlModal.show({
        loading: true,
        msg    : '是否确认删除此角色?',
        ok     : async next => {
          const { code, msg } = await asyncDelRowById(`/sys/role/delete/${id}`)
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
    mergePermissionList (data, permissionList) {
      return permissionList.map(item => {
        const { children, id } = item
        if (children.length) {
          this.mergePermissionList(data, children)
        } else {
          item.checked = data.find(v => v === id) ? true : false
        }
        return item
      })
    },
    handlePermissionAction (id) {
      this.modalPermission.show = true
      if (this.roleId === id) return
      fetchPermissionById(id).then(res => {
        const { code, data } = res
        if (code === 0) {
          this.roleId = id
          this.permissionTreeList = this.mergePermissionList(data, this.copyPermissionTreeList())
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
      
    },

    onPermissionModalEmited ({ type, value }) {
      if (type === 'on-click-btn') {
        const modalPermission = this.modalPermission
        if (value === 'cancel') {
          modalPermission.show = false
        } else {
          modalPermission.btnLoading = true
          const permissionIds = this.$refs.permissionTree.getCheckedAndIndeterminateNodes().map(item => item.id)
          updatePermission({
            roleId: this.roleId,
            permissionIds
          }).then(res => {
            modalPermission.btnLoading = false
            if (res.code === 0) {
              modalPermission.show = false
              this.$Message.success('修改成功！')
            } else {
              this.$Message.warning('修改成功！')
            }
          })
        }
      }
    }
    
  }
}
</script>