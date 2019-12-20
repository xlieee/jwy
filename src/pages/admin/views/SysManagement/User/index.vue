<template>
  <div class="layout_left-right">
    <Row :gutter="24">
      <i-col span="6">
        <Card 
          ref="card-tree"
          :bordered="false" 
          dis-hover>
          <p slot="title">所属组织</p>
          <Tree 
            v-if="!treeErrorMsg"
            :empty-text="emptyText"
            :data="allOrgList"
            @on-select-change="onSelectChange"
            class="common-tree-fix" />
          <div 
            v-else
            class="ivu-tree-empty">{{treeErrorMsg}}
            <Icon 
              @click="fetchAllOrgList"
              type="md-refresh-circle" 
              size="24" 
              title="重新获取"
              style="float:right;cursor:pointer" />
          </div>
        </Card>
      </i-col>
      <i-col span="18">
        <query-block
          v-once
          :query="query"
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
            :title="modal.title || '详情'"
            transfer
            class="modal-fix modal-body-scrollable"
            :width="840">
            <modal-form 
              ref="modalForm"
              :form="modalForm" />
            <div slot="footer">
              <Button @click="onClickModalBtn('cancel')">取消</Button>
              <Button 
                @click="onClickModalBtn('confirm')"
                :loading="modal.btnLoading"
                type="primary">确定</Button>
            </div>
          </Modal>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
import ModalForm from './modal-form.vue'
import QueryBlock from './query-block.vue'

import { asyncDelRowById, fetchAllOrgList } from '_admin/api/common'
import { 
  fetchUserTypeList, 
  fetchUserList, 
  updateUser,
  updateUserPwd
} from '_admin/api/sys'

export default {
  components: {
    QueryBlock,
    ModalForm
  },
  provide () {
    return {
      typeList  : this.typeList,
      allOrgList: this.allOrgList
    }
  },
  data () {
    return {
      treeErrorMsg: '',
      emptyText   : '数据获取中...',

      queryOrgId: '',
      query     : {
        realName: '',
        idCard  : '',
        type    : undefined
      },
      // ModalForm
      modalForm: {
        realName    : '',
        idcard      : '',
        phone       : '',
        sort        : '',
        orgs        : [],
        type        : '',
        manageOrgs  : [], // 管理部门
        tenantId    : '', // 租户类型
        duty        : '',
        policeNumber: '',
        policeRank  : '',
        policeType  : '',
        roles       : '',
        description : ''
      },

      // FormModal
      modal: {
        show      : false,
        loading   : false,
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
            width: 60
          },
          {
            title: '姓名',
            key  : 'realName'
          },
          {
            title   : '身份证号',
            key     : 'idcard',
            ellipsis: true,
            tooltip : true
          },
          {
            title: '排序',
            width: 70,
            key  : 'sort'
          },
          {
            title   : '所属组织',
            key     : 'org',
            ellipsis: true,
            render  : (h, { row: { orgList } }) => {
              if (!orgList) return ''
              const data = orgList.map(item => item.name).join(',')
              return <Tooltip content={data} theme="light" class="tooltip-ellipsis">{data}</Tooltip>
            }
          },
          {
            title : '用户类型',
            width : 130,
            key   : 'userType',
            render: (h, { row: { type } }) => [this.typeList.find(item => type === item.code).value]
          },
          {
            title   : '角色',
            key     : 'role',
            ellipsis: true,
            render  : (h, { row: { roleList } }) => {
              if (!roleList) return ''
              const data = roleList.map(item => item.name).join(',')
              return <Tooltip content={data} theme="light" class="tooltip-ellipsis">{data}</Tooltip>
            }
          },
          {
            title : '操作',
            width : 120,
            render: (h, { row }) => {
              const actions = [
                { icon: 'edit', type: 'edit', title: '编辑' },
                { icon: 'lock', type: 'reset', title: '重置密码' },
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
        data    : [],
        curIndex: -1
      },
      allOrgList: [],
      typeList  : []
    }
  },
  created () {
    this.fetchAllOrgList()

    fetchUserTypeList().then(res => {
      const { code, data } = res
      if (code === 0) {
        this.typeList.push(...data)
      }
    })
  },
  mounted () {
    const cardBodyEl = this.$refs['card-tree'].$el.querySelector('.ivu-card-body')
    const { top } = cardBodyEl.getBoundingClientRect()
    cardBodyEl.style.overflow = 'auto'
    cardBodyEl.style.maxHeight = `calc(100vh - ${top + 24}px)`
  },
  methods: {
    fetchAllOrgList () {
      this.treeErrorMsg = ''
      fetchAllOrgList().then(res => {
        const { code, data, msg } = res
        if (code === 0) {
          if (!data || !data.length) {
            this.emptyText = '暂无数据'
            return 
          }
          this.allOrgList.push(...JSON.parse(JSON.stringify(data)))
          this.fetchTableList()
        } else {
          this.treeErrorMsg = msg
        }
      }).catch(() => {
        this.treeErrorMsg = '数据获取失败'
      })
    },
    onSelectChange (curSelectedArr, curSelected) {
      Object.assign(this.query, {
        realName: '',
        idCard  : '',
        type    : undefined
      })
      this.queryOrgId = curSelectedArr.length ? curSelected.id : ''
      this.onClickQuery()
    },

    // QueryBlock
    onClickQuery () {
      this.page.currentPage = 1
      this.fetchTableList()
    },
    onClickAdd () {
      this.table.curIndex = -1
      this.modal.title = '新增用户'
      this.modal.show = true
    },
    fetchTableList () {
      this.table.loading = true
      const { realName, idCard, type } = this.query
      const { currentPage: current, pageSize: size } = this.page
      fetchUserList({
        current, size, realName, idCard, type, orgId: this.queryOrgId
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

    // row-action
    onClickRowAction ({ type, row }) {
      if (type === 'edit') {
        this.handleEditAction(row)
      } else if (type === 'del') {
        this.handleDelActionAsync(row.id)
      } else if (type === 'reset') {
        this.handleResetPwd(row.id)
      }
    },
    handleEditAction (row) {
      const { _index, title } = row
      const { table, modal, modalForm } = this
      table.curIndex = _index 
      Object.assign(modal, {
        show: true,
        title
      })
      const copyData = JSON.parse(JSON.stringify(row, Object.keys(modalForm)))
      const { management, orgList, roleList } = row
      copyData.manageOrgs = management ? management.split(',') : []
      copyData.orgs = orgList && orgList.map(item => item.id)
      copyData.roles = roleList && roleList.map(item => item.id)
      Object.assign(modalForm, copyData)
    },
    handleDelActionAsync (id) {
      this.$xlModal.show({
        loading: true,
        msg    : '是否确认删除此用户?',
        ok     : async next => {
          const { code, msg } = await asyncDelRowById(`/sys/user/delete/${id}`)
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
    handleResetPwd (id) {
      this.$xlModal.show({
        loading: true,
        msg    : '是否重置该用户的密码?',
        ok     : async next => {
          const { code, msg } = await updateUserPwd(id)
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
        const { modalForm, table, $refs } = this

        $refs.modalForm.validate(async vaild => {
          if (vaild) {
            modal.btnLoading = true
            const copyData = JSON.parse(JSON.stringify(modalForm))
            copyData.orgs = copyData.orgs.map(item => ({ orgId: item }))
            const { data, curIndex } = table 
            if (curIndex !== -1) {
              copyData.id = data[curIndex].id
            }
            const { code, msg } = await updateUser(copyData)
            modal.btnLoading = false
            if (code === 0) {
              this.$Message.success(msg)
              modal.show = false
              this.fetchTableList()
            } else {
              this.$Message.error(msg)
            }
          }
        })
      }
    }
  }
}
</script>