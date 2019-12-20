<template>
  <div style="margin-top:16px">
    <Steps 
      v-if="list.length"
      :current="list.length-1" 
      direction="vertical" 
      class="steps-fix-approval">
      <Step
        v-for="(item,index) of list"
        :key="index"
        :title="item.stepName">
        <Icon 
          slot="icon" 
          size="28"
          :color="item.result === 1? '#09bb07': item.actualHandlePersonName?'#f00':'#5E7CE0'"
          :type="item.result === 1? 'ios-checkmark-circle': item.actualHandlePersonName?'ios-close-circle': 'ios-information-circle'" />
        <div slot="content">
          <template v-if="item.actualHandlePersonName">
            <p class="level1"><span class="name">{{item.actualHandlePersonName}}</span><span>{{item.actualHandlePersonDuty}}</span></p>  
            <p class="level2">{{item.actualHandlePersonOrgName}}</p>  
            <p class="level1">{{item.comment}}</p>  
            <p class="level2"><Icon type="md-time" size="16" /> {{item.approveTime}}</p>  
          </template>
          <Collapse v-if="item.participantCommnets.length">
            <Panel>参与人审批
              <div slot="content">
                <div
                  v-for="(v,index) of item.participantCommnets"
                  :key="v.id">
                  <Divider v-if="index > 0" />
                  <p class="level1"><span class="name">{{v.userName}}</span><span>{{v.userDuty}}</span></p>  
                  <p class="level2">{{v.userOrgName}}</p>  
                  <p class="level1">{{v.comment}}</p>  
                  <p class="level2"><Icon type="md-time" size="16" /> {{v.createTime}}</p>  
                </div>
              </div>
            </Panel>
          </Collapse>
        </div>
      </Step>
    </Steps>
    <Alert v-else show-icon>暂无审批信息!</Alert>
  </div>
</template>
<script>
export default {
  name: 'approval-info',
  data () {
    return {
      list: []
    }
  }
}
</script>
<style lang="scss">
.steps-fix-approval {
  .ivu-steps-tail {
    left: 17px;
    > i {
      width: 0;
      border-left: 1px dashed #C0C4CC; 
    }
  }
  .ivu-steps-main .ivu-steps-title {
    color: #17233D;
    font-size: 16px;
  }
  .ivu-steps-content {
    .level1 {
      margin-top: 10px;
      font-size: 14px;
      color: #252B30;
    }
    .level2 {
      margin: 6px 0;
      font-size: 13px;
      color: #575D6C;
    }
    .name {
      font-size: 15px;
      margin-right: 10px;
      font-weight: 600;
    }
  }
}
</style>