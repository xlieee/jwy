<template>
  <Form 
    ref="formRef" 
    :model="form">
    <FormItem style="margin-bottom: 0;">
      <Alert show-icon>说明：转发后，工单将流转至您转发的管理员处理!</Alert>
    </FormItem>
    <FormItem 
      label="转发至："
      :label-width="$calcLabelWidth('转发至：',{isRequired:true})"
      prop="person"
      :rules="{required:true,message:'请选择被转发人',trigger:'change'}">
      <select-person 
        v-model="form.person"
        clearable
        :default-option-list="defaultOptionList"/>
    </FormItem>
    <FormItem 
      label="转发说明："
      :label-width="$calcLabelWidth('转发说明：')"
      prop="comment">
      <Input
        v-model="form.comment"
        type="textarea"
        :rows="3"
        placeholder="请输入转发说明" />
    </FormItem>
  </Form>
</template>
<script>
import SelectPerson from '@/components/select-person'
import mixins from './mixins'
export default {
  name      : 'form-forward',
  components: { SelectPerson },
  mixins    : [mixins],
  data () {
    return {
      form: {
        person : '',
        comment: ''
      },

      defaultOptionList: []
    }
  }
}
</script>