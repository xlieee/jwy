<template>
  <Modal
    v-model="applyPermission"
    title="提示"
    width='960px'
    footer-hide
    class-name="vertical-center-modal"
    @on-cancel="applyPermission = false">
    <Table 
      :columns="columns" 
      :data="datas" 
      :row-key='true'
      >
    </Table>
  </Modal>
</template>
<script>
export default {
  props: {
    permission: {
      type: Boolean
    }
  },
  watch: {
    permission (newVal) {
      console.log(newVal, 'newVal')
      this.applyPermission = newVal
    }
  },
  data () {
    return {
      applyPermission: false,
      columns        : [
        {
          title: '序号',
          type : 'index',
          width: 80
        },
        {
          title: '姓名',
          key  : 'name'
        },
        {
          title: '单位',
          key  : 'unit'
        },
        {
          title: '申请单号',
          key  : 'count'
        },
        {
          title: '申请时间',
          key  : 'date'
        }
      ],
      datas: []
    }
  },
  methods: {
    onOk () {
      this.$emit('ok')
    }
  }
}
</script>