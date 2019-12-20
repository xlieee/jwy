<template>
  <div class="btn-group">
    <Button 
      v-for="btn of btnList"
      :key="btn.type"
      v-show="btn.show"
      :loading="btn.loading"
      @click="onClickBtn(btn.type)"
      :class="`btn-${btn.type}`">
      <i :class="['icon-sprites-g2',`icon_g2-${btn.type}`]"></i>{{btn.text}}
    </Button>
    <Button 
      @click="onClickBtn('cancel')"
      class="btn-cancel">关闭</Button>
    <Modal
      v-model="modal.show"
      :title="modal.title"
      transfer
      :mask-closable="false"
      :width="600">

      <compoent ref="compRef" :is="curFormComp"></compoent>

      <div slot="footer" style="text-align:center">
        <Button 
          @click="onClickModalBtn('cancel')"
          style="width:90px">取消</Button>
        <Button 
          @click="onClickModalBtn('confirm')"
          type="primary"
          :loading="confirmLoading"
          style="width:90px">确定</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
export default {
  components: {
    FormApproval: () => import('./form-approval'),
    FormForward : () => import('./form-forward'),
    FormAdd     : () => import('./form-add')
  },
  data () {
    return {
      btnList: [
        { text: '提交', show: false, type: 'submit', loading: false },
        { text: '保存', show: false, type: 'save', loading: false },
        { text: '审批', show: false, type: 'approval' },
        { text: '加办', show: false, type: 'add' },
        { text: '转发', show: false, type: 'forward' }
      ],
      
      modal: {
        show : false,
        title: ''
      },

      confirmLoading: false,

      curFormComp: null
    }
  },
  methods: {
    onClickBtn (type) {
      if (type === 'cancel') {
        this.$emit('on-close-modal')
      } else {
        if (type === 'save' || type === 'submit') {
          this.$emit('on-click-btn', { type })
        } else {
          this.modal.show = true
          this.modal.title = this.btnList.find(item => type === item.type).text
          
          this.curFormComp = `form-${type}`
        }
      }
      
    },
    onClickModalBtn (type) {
      const { modal } = this
      if (type === 'cancel') {
        modal.show = false
      } else {
        const { $refs:{ compRef } } = this
        compRef.validate(vaild => {
          if (vaild) {
            this.resetFields = compRef.resetFields
            const _type = this.curFormComp.split('form-')[1]
            this.$emit('on-click-confirm', {
              type: _type,
              data: JSON.parse(JSON.stringify(compRef.form)),
              text: this.btnList.find(item => _type === item.type).text
            })
            // modal.show = true
          }
        })
      }
    }
  }
}
</script>