<template>
  <Form 
    ref="formRef" 
    :model="form"
    :rules="rules">
    <Row :gutter="16">
      <i-col :xl="10" :xxl="8">
        <FormItem 
          label="节点名称："
          :label-width="$calcLabelWidth('节点名称：',{isRequired:true})"
          prop="name">
          <Input 
            v-model="form.name"
            placeholder="请输入节点名称" />
        </FormItem>
      </i-col>
      <i-col :xl="7" :xxl="8">
        <FormItem 
          label="节点编码："
          :label-width="$calcLabelWidth('节点编码：',{extraNum:1})" 
          prop="code">
          <Input 
            v-model="form.code" />
        </FormItem>
      </i-col>
      <i-col :xl="7" :xxl="8">
        <FormItem 
          label="节点排序："
          :show-message="false"
          :label-width="$calcLabelWidth('节点排序：',{extraNum:1})" 
          prop="sort">
          <Input 
            :value="form.sort"
            @on-change="$filterInput($event,v => form.sort = v, {type:'number',length:5})"
            placeholder="请输入(1-99999)" />
        </FormItem>
      </i-col>
    </Row> 
    <FormItem 
      label="描述：" 
      :label-width="$calcLabelWidth('描述：',{extraNum:3})" 
      prop="desc"
      class="textarea-label-fix"
      style="width:100%">
      <Input 
        v-model="form.desc"
        type="textarea"
        :rows="3"
        placeholder="请输入描述" />
    </FormItem>        
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
        name: { required: true, message: '节点名称不能为空' },
        sort: { required: true, message: '节点排序不能为空' }
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