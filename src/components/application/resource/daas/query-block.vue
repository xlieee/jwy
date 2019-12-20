<template>
  <Card 
    :bordered="false" 
    dis-hover>
    <div class="query-block-application">
      <div :class="['left',{collapsed}]">
          <div class="item">
            <span>申请单号：</span>
            <Input 
              v-model="query.orderNum"
              @on-enter="onClickQuery"
              placeholder="请输入申请单号" />
          </div>
          <div class="item">
            <span>状态：</span>
            <Select v-model="query.state">
              <Option 
                v-for="(item,index) of stateList" 
                :value="item.code" 
                :key="index">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="item">
            <span>时间：</span>
            <DatePicker 
              :value="query.time"
              @on-change="v => query.time = v"
              type="daterange"
              :editable="false"
              placement="bottom-end" 
              placeholder="起始时间 - 截至时间"
              transfer></DatePicker>
          </div>
          <div class="item">
            <span>资源名称：</span>
            <Input 
              v-model="query.name"
              @on-enter="onClickQuery"
              placeholder="请输入资源名称" />
          </div>
      </div>
      <Button
        @click="onClickQuery"
        class="query-btn right"
        style="width:88px;"
        type="primary">查 询</Button>
    </div>
  </Card>
</template>
<script>
export default {
  props: {
    collapsed   : Boolean,
    fromAdmin   : Boolean,
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
    const stateListAdmin = [
      { code: -1, name: '全部' },
      { code: 0, name: '待审批' },
      { code: 1, name: '已完成' },
      { code: 2, name: '被驳回' }
    ]
    const stateListIndex = [
      { code: 0, name: '待处理' },
      { code: 1, name: '已处理' }
    ]
    const stateList = this.fromAdmin ? stateListAdmin : stateListIndex
    const state = this.fromAdmin ? -1 : 0
    return {
      stateList,

      query: {
        orderNum: '',
        state,
        time    : ['', ''],
        name    : ''
      }
    }
  }
}
</script>
<style lang="scss">
$item-place: 320;
.query-block-application {
  display: flex;
  .left {

    margin-right: 15px;
    width: 640px;
    .item {
      flex: 1;
      display: flex;
      align-items: center;
      float: left;

      margin: 5px 16px 5px 0;
      width: 300px;
      height: 40px;
      &:last-child {
        margin-right: 0;
      }
      > span {
        flex-shrink: 0;
        width: 80px;
        font-size: 16px;
        text-align: right;
      }
    }
    
  }
  @media screen and (min-width: 1300px) {
    .left {
      &.collapsed {
        width: 960px;
      }
    }
  }
  @media screen and (min-width: 1400px) {
    .left {
      width: 640 + $item-place + px;
    }
  }
  @media screen and (min-width: 1520px) {
    .left {
      &.collapsed {
        width: auto;
      }
    }
  }
  @media screen and (min-width: 1700px) {
    .left {
      width: auto;
    }
  }
  .query-btn {
    flex-shrink: 0;
    margin-top: 5px;
  }
}
</style>