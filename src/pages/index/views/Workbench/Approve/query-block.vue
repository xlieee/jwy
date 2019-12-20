<template>
  <Form 
    ref="formRef" 
    :model="form"
    class="work-approve-query">
    <Row>
      <i-col span='6'>
        <FormItem 
          label="申请单号："
          :label-width="$calcLabelWidth('申请单号',{isRequired:true,extraNum:1})"
          prop="title">
          <Input 
            v-model="form.title"
            placeholder="请输入申请单号" />
        </FormItem>
      </i-col>
      <i-col span='5'>
        <FormItem 
          label="状态"
          :label-width="$calcLabelWidth('状态',{isRequired:true,extraNum:1})"
          prop="status">
          <RadioGroup 
            v-model="form.status">
            <Radio v-for="(item,index) in newsStatus" :label="item.value" style="margin-right:14px" :key="index">{{item.name}}</Radio>
          </RadioGroup>
        </FormItem>
       </i-col>
      <i-col span='6'>
        <FormItem 
          label="时间："
          :label-width="$calcLabelWidth('时间：',{isRequired:true,extraNum:1})"
          prop="date">
          <DatePicker type="date" placeholder="请选择时间" :value='form.date' @on-change="handleDate" style="width:100%"></DatePicker>
        </FormItem>
      </i-col>
      <i-col span='6' offset='1'>
        <Button 
        @click="onClickQuery"
        class="sure"
        type="primary">查 询</Button>
        <Button 
          type="primary" 
          class="cancel"
          ghost>重 置</Button>
      </i-col>
       
    </Row>
    <Row>
      <i-col span='6'>
        <FormItem 
          label="资源名称："
          :label-width="$calcLabelWidth('资源名称',{isRequired:true,extraNum:1})"
          prop="title">
          <Input 
            v-model="form.title"
            placeholder="请输入资源名称" />
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
    },
    onClickQuery: {
      type: Function
    }
  },
  data () {
    return {
      newsStatus: [
        { name: '已上线', value: 1 },
        { name: '待上线', value: 0 }
      ]
    }
  },
  methods: {
    handleDate (value) {
      this.form.date = value
    }
  }
}
</script>