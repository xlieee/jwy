<template>
  <div style="position:relative">
    <Steps :current="current" class="steps-fix">
      <Step
        v-for="(step,index) of list"
        :key="index"
        :title="step.title"
        @mouseenter.native="onMouse($event,index,'enter')"
        @mouseleave.native="onMouse($event,index,'leave')">
        <div 
          v-show="showContent && step.contentShow" 
          slot="content" 
          :class="stepContentClass">{{step.content}}</div>
      </Step>
    </Steps>
    <Spin size="large" fix v-if="loading" style="background-color: rgba(255, 255, 255, 0.2);"></Spin>
  </div>
</template>
<script>
export default {
  props: {
    leftOffset: {
      type: Number
    },
    showContent: Boolean,
    collapsed  : Boolean
  },
  data () {
    return {
      loading: false,

      current: 0,
      list   : [
        { contentShow: false, title: '申请', content: '' },
        { contentShow: false, title: '部门内审批', content: '' }
      ]
    }
  },
  computed: {
    stepContentClass () {
      return this.leftOffset
        ? ['step-content-fix', 'index']
        : ['step-content-fix', `${this.collapsed ? 'collapased' : 'admin'}`]
    }
  },
  methods: {
    onMouse (e, index, type) {
      if (!this.showContent) return 

      if (index < this.current) {
        this.list[index].contentShow = type === 'enter'
      }
    }
  }
}
</script>
<style lang="scss">
.steps-fix {
  &.ivu-steps {
    padding: 0 16px;
    .ivu-steps-title {
      margin-top: 2px;
      font-size: 16px;
      background-color: #F8FBFF;
    }
    .ivu-steps-head {
      background-color: #F8FBFF;
    }
  }
  .ivu-steps-item {
    overflow: initial;
    cursor: default;
    .step-content-fix {
      position: absolute;
      z-index: 1;
      padding: 4px;
      font-size: 14px;
      background-color: #fff;
      box-shadow: 0 0 1px rgba(0,0,0,.2);
    }
    // &:last-child {
    //   .step-content-fix {
    //     right: 6px;
    //     text-align: right;
    //   }
    // }
    .admin {
      width: calc((100vw - 580px) / 4);
    }
    
    .collapased {
      width: calc((100vw - 404px) / 4);
    }
    .index {
      width: calc((100vw - 324px - #{$pageIndexleftOffset + px}) / 4);
    }
    
    &.ivu-steps-status-finish .ivu-steps-head-inner {
      background-color: $theme-color;
      border: none;
      .ivu-steps-icon {
        font-size: 25px;
        color: #fff;
      }
    }
    
  }
}

</style>