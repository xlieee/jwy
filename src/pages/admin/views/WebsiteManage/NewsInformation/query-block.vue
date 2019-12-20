<template>
  <Card :bordered="false" dis-hover>
    <div class="query-block">
      <span class="label">名称：</span>
      <Input 
        v-model="query.name"
        style="width:200px"
        placeholder="请输入新闻名称进行查询"/>
    </div>
    <div class="query-block">
      <span class="label">状态：</span>
      <Select 
        v-model="query.state"
        style="width:200px"
        clearable
        placeholder="请选择新闻状态">
        <Option 
          v-for="(item,index) in newsStatus" 
          :value="item.value" 
          :key="index">{{ item.name }}</Option>
      </Select>
    </div>
    <div style="display:inline-block">
      <Button 
        @click="onClickQuery"
        style="margin:0 20px 0 70px;width:88px;"
        type="primary">查 询</Button>
      <Button 
        @click="onClickAdd"
        type="primary" 
        ghost><Icon type="md-add" />新增新闻</Button>
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
  },
  data () {
    return {
      newsStatus: [
        { name: '已上线', value: 1 },
        { name: '待上线', value: 0 }
      ]
    }
  }
}
</script>