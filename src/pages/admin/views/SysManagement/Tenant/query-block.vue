<template>
  <Card :bordered="false" dis-hover>
    <div class="query-block">
      <span class="label">租户名称：</span>
      <Input 
        v-model="query.name"
        @on-enter="onClickQuery"
        style="width:270px"
        placeholder="请输入租户名称"/>
    </div>
    <div class="query-block">
      <span class="label" style="width:120px">管辖组织机构：</span>
      <Input 
        v-model="query.orgName"
        @on-enter="onClickQuery"
        style="width:270px"
        placeholder="请输入管辖组织机构"/>
    </div>
    <div style="display:inline-block">
      <Button 
        @click="onClickQuery"
        style="margin:0 20px 0 20px;width:88px;"
        type="primary">查 询</Button>
      <Button 
        @click="onClickAdd"
        type="primary" 
        ghost><Icon type="md-add" />新增租户</Button>
    </div>
  </Card>
</template>
<script>
export default {
  props: {
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