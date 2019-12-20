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
            <span>所属子类：</span>
            <Select 
              v-if="!isDaas"
              v-model="query.subTypeOther"
              clearable
              @on-change="onClickQuery">
              <Option 
                v-for="item of subTypeOtherList" 
                :value="item.id" 
                :key="item.id">{{ item.name }}</Option>
            </Select>
            <Cascader 
              v-if="isDaas"
              :data="subTypeDaasList" 
              v-model="query.subTypeDaas"></Cascader>
          </div>
          <div class="item">
            <span>状态：</span>
            <Select 
              v-model="query.status"
              @on-change="onClickQuery">
              <Option 
                v-for="(item,index) of ['全部'].concat(statusList)"
                :value="index - 1" 
                :key="index">{{ item}}</Option>
            </Select>
          </div>
        </div>
        <Button
          @click="onClickQuery"
          class="query-btn"
          style="margin-left: 10px;width:88px;"
          type="primary">查 询</Button>
      </div>
      <Button
        @click="onClickAdd"
        type="primary"
        ghost
        class="right"
        style="width:96px;">
        <Icon type="md-add" />新增应用
      </Button>
    </div>
  </Card>
</template>
<script>
export default {
  inject: ['subTypeDaasList', 'subTypeOtherList'],
  props : {
    onClickAdd   : Function,
    onClickQuery : Function,
    statusList   : Array,
    isDaas       : Boolean,
    sourceApiType: String
  },
  data () {
    return {
      query: {
        name        : '',
        subTypeDaas : [],
        subTypeOther: '',
        status      : -1
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

      width: 70%;
    }
    .item {
      flex: 1;
      display: flex;
      align-items: center;

      margin-right: 16px;
      max-width: 320px;
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