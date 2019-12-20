<template>
  <Card :bordered="false" dis-hover>
    <div class="query-block">
      <span class="label">用户姓名：</span>
      <Input 
        v-model="query.name"
        style="width:270px"
        placeholder="请输入用户姓名进行搜索" />
    </div>
    <div class="query-block">
      <span class="label">内容：</span>
      <Input 
        v-model="query.content"
        style="width:270px"
        placeholder="请输入操作内容进行搜索" />
    </div>
    <div style="display:inline-block">
      <Button 
        @click="onClickQuery"
        style="width:88px;"
        type="primary">查 询</Button>
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