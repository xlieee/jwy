<template>
  <Form 
    ref="formRef" 
    :model="form">
    <FormItem style="margin-bottom: 0;">
      <Alert show-icon>说明：加办后，该申请单将流转到加办的上级领导审批!</Alert>
    </FormItem>
    <FormItem 
      label="加办人："
      :label-width="$calcLabelWidth('加办人：',{isRequired:true})"
      prop="person"
      :rules="{required:true,message:'请选择加办人',trigger:'change'}">
      <select-person 
        v-model="form.person"
        clearable
        :default-option-list="defaultOptionList"/>
    </FormItem>
    <FormItem 
      label="加办说明："
      :label-width="$calcLabelWidth('加办说明：')"
      prop="comment">
      <Input
        v-model="form.comment"
        type="textarea"
        :rows="3"
        placeholder="请输入加办说明" />
    </FormItem>
  </Form>
</template>
<script>
import SelectPerson from '@/components/select-person'
import mixins from './mixins'
export default {
  name      : 'form-add',
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