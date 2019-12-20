<template>
  <div style="padding-bottom:20px">
    <Row :gutter="16"><div class="form-title form-title-fix">服务列表</div></Row>
    <div style="border:1px solid #e8eaec;border-bottom:none">
      <Table 
        :columns="table.columns" 
        :data="biz.serviceList"
        :loading="table.loading" />
      <Modal
        v-model="modal.show"
        @on-visiable-change="onVisiableChange"
        title="业务办理"
        transfer
        :mask-closable="false"
        :width="480">
        <Form
          ref="formRef"
          :model="form">
          <FormItem 
            label="ID："
            :label-width="$calcLabelWidth('ID：',{isRequired:true,extraNum:1})"
            prop="businessId"
            :rules="{required:true,message:'ID不能为空'}">
            <Input 
              v-model="form.businessId"
              placeholder="请输入ID" />
          </FormItem>
          <FormItem 
            label="密钥："
            :label-width="$calcLabelWidth('密钥：',{isRequired:true})"
            prop="secretKey"
            :rules="{required:true,message:'ID不能为空'}">
            <Input 
              v-model="form.secretKey"
              placeholder="请输入密钥" />
          </FormItem>
        </Form>
        <Modal
          v-model="stateModal.show"
          :mask="false"
          footer-hide
          :closable="false"
          :styles="{
            top: '160px',
            width:'150px',
            textAlign: 'center'
          }">
          <Icon 
            :type="stateModal.success?'md-checkmark-circle':'md-close-circle'"
            :color="stateModal.success?'#09bb07':'#f00'"
            size="48" />
          <p style="margin-top:6px;font-size:16px;font-weight:600">办理{{stateModal.success?'成功':'失败'}}</p>
        </Modal>
        <div slot="footer" style="text-align:center">
          <Button 
            @click="onClickModalBtn('cancel')"
            style="width:90px">取消</Button>
          <Button 
            @click="onClickModalBtn('confirm')"
            type="primary"
            :loading="modal.btnLoading"
            style="width:90px">确认办理</Button>
        </div>
      </Modal>

    </div>
    <div style="margin-top:20px">
      <span style="vertical-align: -8px;font-size:16px">办理说明：</span>
      <Input 
        v-model="biz.dealIntroduction"
        type="textarea"
        :rows="3"
        placeholder="请输入办理说明"
        style="width: calc(100% - 81px);vertical-align: text-top" />
    </div>
  </div>
  
</template>
<script>
import { updateDaasBiz, asyncDelBiz } from '@/api/application'
import observable from '../../observable'

const STATE = ['待办', '失败', '成功']
export default {
  name  : 'daas',
  inject: ['share'],
  data () {
    return {
      table: {
        loading: false,

        columns: [
          {
            title: '序号',
            type : 'index',
            width: 80
          },
          {
            title   : '名称',
            key     : 'fullName',
            ellipsis: true,
            tooltip : true
          },
          {
            title: '所属分类',
            key  : 'type',
            width: 120
          },
          {
            title   : 'ID',
            key     : 'businessId',
            ellipsis: true,
            tooltip : true
          },
          {
            title   : '密钥',
            key     : 'secretKey',
            ellipsis: true,
            tooltip : true
          },
          {
            title : '状态',
            width : 80,
            key   : 'state',
            render: (h, { row:{ state, deleted } }) => [deleted === 1 ? '删除' : STATE[state]]
          },
          {
            title   : '错误信息',
            key     : 'failMsg',
            width   : 120,
            ellipsis: true,
            tooltip : true
          },
          {
            title    : '操作',
            width    : 120,
            className: 'table-column-fix',
            render   : (h, { row }) => {
              const { state, deleted } = row
              const actions = [
                { icon: 'show-doc', type: 'show-doc', title: '跳转到文档' }
              ]
              if (this.share.canBiz) {
                if (deleted) {
                  actions.push({ icon: 'recall', type: 'del-recover', title: '恢复' })
                } else {
                  actions.push({ icon: 'del', type: 'del-recover', title: '删除' })
                  if (state !== 2) {
                    actions.unshift({ icon: 'edit', type: 'edit', title: '办理' })
                  }
                }
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
      form: {
        businessId: '',
        secretKey : ''
      },
      
      modal: {
        show      : false,
        btnLoading: false,
        curIndex  : -1,
        curId     : ''
      },

      stateModal: {
        show   : false,
        success: true
      }
    }
  },
  computed: {
    biz () {
      return observable.state.biz
    }
  },
  methods: {
    onClickRowAction ({ type, row }) {
      const { id } = row
      if (type === 'edit') {
        const { _index:index, secretKey, businessId } = row
        Object.assign(this.modal, {
          show    : true,
          curIndex: index,
          curId   : id
        })
        if (businessId) {
          this.form.businessId = businessId
          this.form.secretKey = secretKey
        }
      } else if (type === 'show-doc') {
        window.open(`${this.$baseUrl}/productDoc/${row.serviceId}?type=daas`)
      } else if (type === 'del-recover') {
        this.handleDelActionAsync(id, row._index, row.deleted)
      }
    },
    handleDelActionAsync (id, index, deleted) {
      this.table.loading = true
      asyncDelBiz(id).then(res => {
        this.table.loading = false
        const { code, msg } = res
        if (code === 0) {
          this.$Message.success(msg)
          this.biz.serviceList[index].deleted = deleted === 0 ? 1 : 0
        } else {
          this.$Message.error(msg)
        }
      }) 
    },
    onVisiableChange (value) {
      if (!value) {
        this.$refs.formRef.resetFields()
      }
    },
    onClickModalBtn (type) {
      const { modal } = this
      if (type === 'cancel') {
        modal.show = false
      } else {
        const { $refs:{ formRef } } = this
        formRef.validate(vaild => {
          if (vaild) {
            const { form:{ businessId, secretKey }, stateModal } = this
            const { curIndex, curId } = modal
            modal.btnLoading = true
            updateDaasBiz({
              id: curId,
              businessId, secretKey
            }).then(res => {
              modal.btnLoading = false  
              const { code } = res
              const _data = this.biz.serviceList[curIndex]
              if (code === 0) {
                _data.state = 2
                _data.businessId = businessId
                _data.secretKey = secretKey
                stateModal.success = true
              } else {
                _data.state = 1
                stateModal.success = false
              }
              stateModal.show = true
              setTimeout(() => {
                stateModal.show = false
              }, 1000)
            })
            
            modal.show = false
          }
        })
      }
    }
  }
}
</script>