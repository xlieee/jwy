export default {
  mounted () {
    const { formRef } = this.$refs
    this.validate = formRef.validate
    this.resetFields = formRef.resetFields
  }
}