<template>
  <div style="border:1px solid #e8eaec;border-bottom:none">
    <Table 
      :columns="table.columns" 
      :data="tableData" />
    <Modal
      v-model="modal.show"
      title="选择服务"
      transfer
      :mask-closable="false"
      :width="600">
      <select-service 
        v-model="serviceId"
        ref="selectService"
        clearable/>

      <div slot="footer" style="text-align:center">
        <Button 
          @click="onClickModalBtn('cancel')"
          style="width:90px">取消</Button>
        <Button 
          @click="onClickModalBtn('confirm')"
          type="primary"
          :loading="modal.btnLoading"
          :disabled="modal.btnDisabled"
          style="width:90px">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import SelectService from '@/components/select-service'
import { asyncDelRowById, asyncDaasService } from '@/api'
import observable from '../../observable'
export default {
  name      : 'daas',
  components: { SelectService },
  inject    : {
    share: {
      default: () => ({
        canEdit: false
      })
    }
  },
  data () {
    return {
      table: {
        columns: [
          {
            title: '序号',
            type : 'index',
            width: 80
          },
          {
            title: '名称',
            key  : 'fullName'
          },
          {
            title: '所属分类',
            key  : 'subclassName'
          },
          {
            title    : '操作',
            width    : 120,
            className: 'table-column-fix',
            render   : (h, { row }) => {
              const actions = [{ icon: 'show-doc', type: 'show-doc', title: '跳转到文档' }]
              if (this.share.canEdit) {
                actions.push({ icon: 'del', type: 'del', title: '删除' })
              }
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
        ]
      },

      serviceId: '',
      
      modal: {
        show       : false,
        btnLoading : false,
        btnDisabled: true,
        title      : '新增'
      }
    }
  },
  computed: {
    tableData () {
      return observable.state.resource.serviceList.map(item => {
        const { id, fullName, type, subclassName, serviceId } = item
        return { id, fullName, subclassName: subclassName || type, serviceId }
      })
    }
  },
  watch: {
    serviceId (newVal) {
      this.modal.btnDisabled = !newVal
    }
  },
  methods: {
    onClickRowAction ({ type, row }) {
      if (type === 'add') {
        this.modal.show = true
      } else if (type === 'show-doc') {
        window.open(`${this.$baseUrl}/productDoc/${row.serviceId}?type=daas`)
      } else if (type === 'del') {
        this.handleDelActionAsync(row.id, row._index)
      }
    },
    handleDelActionAsync (id, index) {
      this.$xlModal.show({
        loading: true,
        msg    : '是否确认删除此服务?',
        ok     : async next => {
          const { code, msg } = await asyncDelRowById(`/bpm/applyDaas/delete/${id}`)
          next()
          if (code === 0) {
            this.$Message.success(msg)
            observable.state.resource.serviceList.splice(index, 1)
          } else {
            this.$Message.error(msg)
          }
        }
      })
    },
    onClickModalBtn (type) {
      const { modal } = this
      if (type === 'cancel') {
        modal.show = false
      } else {
        const serviceId = this.serviceId
        if (serviceId) {
          const { tableData } = this
          const find = tableData.find(item => serviceId === item.serviceId)
          if (find) {
            return this.$Message.info('该服务已存在！')
          }
          modal.btnLoading = true
          asyncDaasService({
            orderNum: observable.state.resource.id,
            serviceId
          }).then(res => {
            modal.btnLoading = false
            const { code, data, msg } = res
            if (code === 0) {
              this.$Message.success(msg)
              const { fullName, subclassName } = this.$refs.selectService.optionList.find(item => serviceId === item.id)
              observable.state.resource.serviceList.push({ id: data, fullName, subclassName })
              this.serviceId = ''
              modal.show = false
            } else {
              this.$Message.error(msg)
            }
          })

        }
      }
    }
  }
}
</script>