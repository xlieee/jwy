<template>
  <div class="modal-tabs">
    <Tabs
      v-model="value"
      @on-click="click"
      :animated="false">
      <!-- <Button 
        @click="onClickExtra"
        type="text" 
        size="small" 
        slot="extra">
        <Icon type="md-help" class="icon_md-help-fix" />流程说明
      </Button> -->
      <TabPane 
        v-for="tab of list"
        :disabled="tab.disabled"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"></TabPane>
    </Tabs>
  </div>
</template>
<script>
export default {
  props: {
    click: {
      type   : Function,
      default: () => () => {}
    }
  },
  data () {
    return {
      value: 'resource-info',

      list: [
        { label: '资源信息', name: 'resource-info' },
        { label: '审批信息', name: 'approval-info' },
        { label: '业务办理', name: 'biz-deal', disabled: true },
        { label: '反馈信息', name: 'feedback-info' }
      ]
    }
  },
  methods: {
    onClickExtra () {}
  }
}
</script>
<style lang="scss">
.modal-tabs {
  .ivu-tabs-tab {
    &.ivu-tabs-tab-active {
      font-weight: 600;
    }
    padding: 8px;
    font-size: 16px;
  }
  .ivu-tabs-bar {
    margin-bottom: 0;
    border-bottom-color: transparent;
  }
  .ivu-tabs-nav-right {
    margin-top: 8px;
    margin-right: 4px;
  }
  .icon_md-help-fix {
    margin-right: 4px;
    padding: 1px;
    font-size: 12px;
    border-radius: 50%;
    border: 1px solid;
    vertical-align: text-bottom;
  }
}
</style>