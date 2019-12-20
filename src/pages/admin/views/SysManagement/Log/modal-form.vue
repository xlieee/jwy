<template>
  <Form 
    ref="formRef" 
    :model="form" 
    :rules="rules">
    <Row :gutter="24">
      <i-col span="12">
        <FormItem 
          label="角色名称："
          :label-width="$calcLabelWidth('角色名称：',{isRequired:true})"
          prop="name">
          <Input 
            v-model="form.name"
            placeholder="请输入角色名称" />
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem 
          label="角色编码："
          :label-width="$calcLabelWidth('角色编码：')" 
          prop="roleCode">
          <Input 
            v-model="form.roleCode"
            placeholder="请输入角色编码" />
        </FormItem>
      </i-col>
      <i-col span="24">
        <FormItem 
          label="角色描述：" 
          :label-width="$calcLabelWidth('角色描述：',{extraNum:1})" 
          prop="desc"
          class="textarea-label-fix">
          <Input 
            v-model="form.desc"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述" />
        </FormItem>
      </i-col>
    </Row>             
  </Form>
</template>
<script>
export default {
  props: {
    form: {
      type: Object
    }
  },
  data () {
    return {
      rules: {
        name: {
          required: true, message : '角色名称不能为空'
        }
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