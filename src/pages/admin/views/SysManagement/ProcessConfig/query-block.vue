<template>
  <Card 
    :bordered="false" 
    dis-hover>
    <div class="query-block1">
      <div class="left">
        <div class="query-content">
          <div class="item">
            <span>服务名称：</span>
            <Input 
              v-model="query.name"
              @on-enter="onClickQuery"
              placeholder="请输入服务名称" />
          </div>
          <div class="item">
            <span>默认流程：</span>
            <Select 
              v-model="query.type"
              @on-change="onClickQuery">
              <Option 
                v-for="(item,index) of ['全部'].concat(processList)"
                :value="index - 1" 
                :key="index">{{ item }}</Option>
            </Select>
          </div>
        </div>
        <Button
          @click="onClickQuery"
          class="query-btn"
          style="width:88px;"
          type="primary">查 询</Button>
      </div>
      <Button
        @click="onClickAdd"
        type="primary"
        ghost
        class="right"
        style="width:96px;">
        <Icon type="md-add" />新增流程
      </Button>
    </div>
  </Card>
</template>
<script>
export default {
  props: {
    onClickAdd: {
      type   : Function,
      default: () => () => {}
    },
    onClickQuery: {
      type   : Function,
      default: () => () => {}
    },
    processList: {
      type   : Array,
      default: () => []
    }
  },
  data () {
    return {
      query: {
        name: '',
        type: -1
      }
    }
  }
}
</script>
<style lang="scss">
.query-block1 {
  display: flex;
  .left {
    flex: 1;
    display: flex;

    margin-right: 20px;

    .query-content {
      display: flex;
    }
    .item {
      flex: 1;
      display: flex;
      align-items: center;

      margin-right: 16px;
      width: 300px;
      > span {
        flex-shrink: 0;
        font-size: 16px;
      }
    }

    .query-btn {
      flex-shrink: 0;
    }
  }
  .right {
    flex-shrink: 0;
  }
}
</style>