<template>
  <Form 
    ref="formRef" 
    :model="form"
    :rules="rules">
    <Row :gutter="24">
      <i-col span="12">
        <FormItem 
          label="名称："
          :label-width="$calcLabelWidth('名称：',{isRequired:true})"
          prop="name">
          <Input 
            v-model="form.name"
            placeholder="根据用户信息填充，可修改" />
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem 
          label="组织编码："
          :label-width="$calcLabelWidth('组织编码：',{isRequired:true})" 
          prop="orgCode">
          <Input 
            v-model="form.orgCode"
            placeholder="请输入组织编码" />
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem 
          label="统一社会信用代码：" 
          :label-width="$calcLabelWidth('统一社会信用代码：')" 
          prop="creditCode">
          <Input 
            v-model="form.creditCode"
            placeholder="请输入统一社会信用代码" />
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem 
          label="排序："
          :label-width="$calcLabelWidth('排序：',{isRequired:true,extraNum:2})" 
          prop="sort">
          <Input 
            :value="form.sort"
            @on-change="$filterInput($event,v => form.sort = v, {type:'number',length:5})"
            placeholder="请输入(1-99999)" />
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem 
          label="负责人：" 
          :label-width="$calcLabelWidth('负责人：')" 
          prop="chargePerson">
          <Input 
            v-model="form.chargePerson"
            placeholder="请输入负责人" />
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem 
          label="负责人电话："
          :label-width="$calcLabelWidth('负责人电话：')" 
          prop="chargePersonTel">
          <Input 
            :value="form.chargePersonTel"
            @on-change="$filterInput($event,v => form.chargePersonTel = v, {type:'tel'})"
            placeholder="请输入负责人电话" />
        </FormItem>
      </i-col>
      <i-col span="24">
        <FormItem 
          label="描述：" 
          :label-width="$calcLabelWidth('描述：',{extraNum:1})" 
          prop="desc"
          class="textarea-label-fix">
          <Input 
            v-model="form.desc"
            type="textarea"
            :rows="3"
            size="large" />
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
        name   : { required: true, message: '组织名称不能为空' },
        orgCode: { required: true, message: '组织编码不能为空' },
        sort   : { required: true, message: '排序不能为空' }
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