<template>
  <Form 
    ref="formRef" 
    :model="form">
    <FormItem style="margin-bottom: 0;">
      <Alert show-icon>
        {{isPaticipantExact?`您为该表单的参与人，可填写审批意见，该意见会显示在【审批信息】的【${share.currentStepName}】中。`:'审批通过，工单进入下一审批环节；审批驳回，通知申请人重新申请!'}}
      </Alert>
    </FormItem>
    <FormItem 
      v-if="!isPaticipantExact"
      label="审批结果："
      :label-width="$calcLabelWidth('审批结果：',{isRequired:true})"
      prop="result"
      :rules="{required:true,message:'请选择审批结果',type:'number'}">
      <RadioGroup 
        v-model="form.result"
        class="radio-fix">
        <Radio :label="1">通过</Radio>
        <Radio :label="0">驳回</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem 
      label="审批说明："
      :label-width="$calcLabelWidth('审批说明：',{extraNum:1})"
      prop="comment">
      <Input
        v-model="form.comment"
        type="textarea"
        :rows="3"
        placeholder="请输入审批说明" />
    </FormItem>
  </Form>
</template>
<script>
import mixins from './mixins'
import observable from '../observable'
export default {
  name  : 'form-approval',
  mixins: [mixins],
  inject: ['share'],
  data () {
    return {
      form: {
        result : 1,
        comment: ''
      }
    }
  },
  computed: {
    isPaticipantExact () {
      const { permissions } = observable.state.resource
      return permissions.includes('PATICIPANT') && !permissions.includes('APPROVAL')
    }
  }
}
</script>