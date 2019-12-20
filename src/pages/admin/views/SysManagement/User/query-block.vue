<template>
  <Card :bordered="false" dis-hover>
    <p slot="title">用户管理</p>
    <div class="query-block">
      <span class="label">姓名：</span>
      <Input 
        v-model="query.realName"
        @on-enter="onClickQuery"
        style="width:270px"
        placeholder="请输入用户姓名进行查询"/>
    </div>
    <div class="query-block">
      <span class="label">身份证号：</span>
      <Input 
        v-model="query.idCard"
        @on-enter="onClickQuery"
        style="width:270px"
        placeholder="请输入用户身份证号码进行查询"/>
    </div>
    <div class="query-block">
      <span class="label">用户类型：</span>
      <Select 
        v-model="query.type"
        @on-change="onClickQuery"
        style="width:270px"
        placeholder="请选择用户类型">
        <Option 
          v-for="item of typeList" 
          :value="item.code" 
          :key="item.code">{{ item.value }}</Option>
      </Select>
    </div>
    <div style="display:inline-block">
      <Button 
        @click="onClickQuery"
        style="margin:0 20px 0 80px;width:88px;"
        type="primary">查 询</Button>
      <Button 
        @click="onClickAdd"
        type="primary" 
        ghost><Icon type="md-add" />新增用户</Button>
    </div>
  </Card>
</template>
<script>
export default {
  inject: ['typeList'],
  props : {
    query: {
      type: Object
    },
    onClickQuery: {
      type: Function
    },
    onClickAdd: {
      type: Function
    }
  }
}
</script>