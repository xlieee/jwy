<template>
  <Modal
    ref="modal"
    v-model="modal.show"
    @on-visible-change="onVisibleChange"
    :title="modal.title || '详情'"
    class="modal-fix"
    transfer
    :width="width">
    <slot></slot>
    <div slot="footer" v-show="!modal.hideFooter">
      <Button @click="onClickModalBtn('cancel')">取消</Button>
      <Button 
        @click="onClickModalBtn('confirm')"
        :loading="modal.btnLoading"
        type="primary">确定</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    modal: {
      type: Object
    },
    width: {
      type   : Number,
      default: 720
    }
  },
  methods: {
    onVisibleChange (value) {
      this.$emit('on-emit', {
        type: 'on-visible-change',
        value
      })
    },
    onClickModalBtn (btnType) {
      this.$emit('on-emit', {
        type : 'on-click-btn',
        value: btnType
      })
    }
  }
}
</script>