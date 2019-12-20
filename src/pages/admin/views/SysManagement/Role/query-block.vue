<template>
  <Card :bordered="false" dis-hover>
    <div class="query-block">
      <span class="label">用户角色：</span>
      <Input 
        v-model="query.name"
        @on-enter="onClickQuery"
        style="width:270px"
        placeholder="请输入用户角色" />
    </div>
    <div style="display:inline-block">
      <Button 
        @click="onClickQuery"
        style="margin:0 20px 0 20px;width:88px;"
        type="primary">查 询</Button>
      <Button 
        @click="onClickAdd"
        type="primary" 
        ghost><Icon type="md-add" />新增角色</Button>
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