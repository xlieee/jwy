<template>
  <Modal
    v-model="show"
    :title="title"
    class="modal-fix"
    width="480">
    {{msg}}
    <div slot="footer">
      <Button 
        v-if="cancelShow"
        @click="show = false">取消</Button>
      <Button 
        @click="onOk"
        :loading="loading"
        type="primary">{{okText}}</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  name: 'xl-modal',
  data () {
    return {
      show      : false,
      title     : '提示',
      msg       : '',
      loading   : false,
      okText    : '确定',
      cancelShow: true
    }
  },
  methods: {
    onOk () {
      this.show = false
    }
  }
}
</script>