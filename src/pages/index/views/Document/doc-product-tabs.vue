<template>
  <div class="doc-product-title">
    <ul class="application-control-tab">
      <li :class="activeIndex==index?'tab-focused':''" 
        v-for="(item,index) in tabs" 
        :key="index" 
        class="application-control-tab-item"
        @click="handleClick(index,item.value)">
        <!-- <i :class="`doc-control-icon-${type}_${index}`"></i> -->
        {{item.label}}
        </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    tabs: {
      type   : Array,
      default: () => []
    },
    type: String
  },
  data () {
    return {
      activeIndex: 0
    }
  },
  watch: {
    tabs (newVal) {
      if (newVal && newVal.length > 0) {
        this.$emit('on-click', newVal[0].value)
      }
    }
  },
  methods: {
    handleClick (index, value) {
      this.activeIndex = index
      this.$emit('on-click', value)
    }
  }
}
</script>
<style lang="scss">
.doc-product-title{
  width: 100%;
  background: #fff;
  overflow: hidden;
  padding: 0 24px;
}
.application-control-tab{
  overflow: hidden;
  float: left;
  .application-control-tab-item{
    font-size: 18px;
    float: left;
    height: 81px;
    line-height: 85px;
    margin-right:80px;
    position: relative;
    // padding-left: 24px;
    cursor: pointer;
    &::after{
      content: "";
      position: absolute;
      right: -40px;
      height: 18px;
      top: 32px;
      border-right: 1px solid #DFE5F3;
      padding: 0 20px;
    }
    &:last-of-type::after{
      border: 0
    }
    &:hover{
      color: $active;
      .doc-control-icon-saas_0{
        background: url('../../assets/img/application-control-icon-active_0.svg') no-repeat center center;
      }
      .doc-control-icon-saas_1{
        background: url('../../assets/img/doc-icon-saas-active_1.svg') no-repeat center center;
      }
      .doc-control-icon-saas_2{
        background: url('../../assets/img/doc-icon-saas-active_2.svg') no-repeat center center;
      }
      .doc-control-icon-paas_0{
        background: url('../../assets/img/application-control-icon-active_0.svg') no-repeat center center;
      }
      .doc-control-icon-paas_1{
        background: url('../../assets/img/application-control-icon-active_1.svg') no-repeat center center;
      }
      .doc-control-icon-paas_2{
        background: url('../../assets/img/application-control-icon-active_2.svg') no-repeat center center;
      }
      .doc-control-icon-paas_3{
        background: url('../../assets/img/application-control-icon-active_3.svg') no-repeat center center;
      }
      .doc-control-icon-daas_0{
        background: url('../../assets/img/application-control-icon-active_0.svg') no-repeat center center;
      }
      .doc-control-icon-daas_1{
        background: url('../../assets/img/doc-control-icon-daas-active_1.svg') no-repeat center center;
      }
      .doc-control-icon-daas_2{
        background: url('../../assets/img/doc-control-icon-daas-active_2.svg') no-repeat center center;
      }
      .doc-control-icon-daas_3{
        background: url('../../assets/img/doc-control-icon-daas-active_3.svg') no-repeat center center;
      }
    }
    i{
      width: 18px;
      height: 18px;
      display: inline-block;
      position: absolute;
      top: 34px;
      left: 0;
      background-size: contain !important;
    }
    .doc-control-icon-saas_0{
      background: url('../../assets/img/application-control-icon_0.svg') no-repeat center center;
    }
    .doc-control-icon-saas_1{
      background: url('../../assets/img/doc-icon-saas_1.svg') no-repeat center center;
    }
    .doc-control-icon-saas_2{
      background: url('../../assets/img/doc-icon-saas_2.svg') no-repeat center center;
    }
    .doc-control-icon-paas_0{
      background: url('../../assets/img/application-control-icon_0.svg') no-repeat center center;
    }
    .doc-control-icon-paas_1{
      background: url('../../assets/img/application-control-icon_1.svg') no-repeat center center;
    }
    .doc-control-icon-paas_2{
      background: url('../../assets/img/application-control-icon_2.svg') no-repeat center center;
    }
    .doc-control-icon-paas_3{
      background: url('../../assets/img/application-control-icon_3.svg') no-repeat center center;
    }
    .doc-control-icon-daas_0{
      background: url('../../assets/img/application-control-icon_0.svg') no-repeat center center;
    }
    .doc-control-icon-daas_1{
      background: url('../../assets/img/doc-control-icon-daas_1.svg') no-repeat center center;
    }
    .doc-control-icon-daas_2{
      background: url('../../assets/img/doc-control-icon-daas_2.svg') no-repeat center center;
    }
    .doc-control-icon-daas_3{
      background: url('../../assets/img/doc-control-icon-daas_3.svg') no-repeat center center;
    }
  }
  .tab-focused{
    color: $active;
    font-weight: 600;
    .doc-control-icon-saas_0{
      background: url('../../assets/img/application-control-icon-active_0.svg') no-repeat center center;
    }
    .doc-control-icon-saas_1{
      background: url('../../assets/img/doc-icon-saas-active_1.svg') no-repeat center center;
    }
    .doc-control-icon-saas_2{
      background: url('../../assets/img/doc-icon-saas-active_2.svg') no-repeat center center;
    }
    .doc-control-icon-paas_0{
      background: url('../../assets/img/application-control-icon-active_0.svg') no-repeat center center;
    }
    .doc-control-icon-paas_1{
      background: url('../../assets/img/application-control-icon-active_1.svg') no-repeat center center;
    }
    .doc-control-icon-paas_2{
      background: url('../../assets/img/application-control-icon-active_2.svg') no-repeat center center;
    }
    .doc-control-icon-paas_3{
      background: url('../../assets/img/application-control-icon-active_3.svg') no-repeat center center;
    }
    .doc-control-icon-daas_0{
      background: url('../../assets/img/application-control-icon-active_0.svg') no-repeat center center;
    }
    .doc-control-icon-daas_1{
      background: url('../../assets/img/doc-control-icon-daas-active_1.svg') no-repeat center center;
    }
    .doc-control-icon-daas_2{
      background: url('../../assets/img/doc-control-icon-daas-active_2.svg') no-repeat center center;
    }
    .doc-control-icon-daas_3{
      background: url('../../assets/img/doc-control-icon-daas-active_3.svg') no-repeat center center;
    }
  }
  .ivu-tabs-nav .ivu-tabs-tab:last-child{
    &::after{
      border: none;
    }
  }
}
</style>