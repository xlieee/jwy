<template>
  <Form 
    ref="formRef" 
    :model="form" 
    :rules="rules">
    <FormItem 
      label="租户名称："
      :label-width="$calcLabelWidth('租户名称：',{isRequired:true,extraNum:1})"
      prop="name">
      <Input 
        v-model="form.name"
        placeholder="请输入租户名称" />
    </FormItem>
    <FormItem 
      label="管辖组织机构："
      :label-width="$calcLabelWidth('管辖组织机构：')" 
      prop="jurisdiction">
      <tree-select
        v-model="form.jurisdiction"
        :data="allOrgList"
        :expand-all="false"
        check-strictly></tree-select>
    </FormItem>             
  </Form>
</template>
<script>
import TreeSelect from '_admin/components/tree-select'
export default {
  components: { TreeSelect },
  props     : {
    allOrgList: {
      type   : Array,
      default: () => []
    },
    form: {
      type: Object
    }
  },
  data () {
    return {
      rules: {
        name: { required: true, message: '租户名称不能为空' }
      }
    }
  },
  mounted () {
    const formRef = this.$refs.formRef
    this.validate = formRef.validate
    this.resetFields = formRef.resetFields

  }
}
</script>