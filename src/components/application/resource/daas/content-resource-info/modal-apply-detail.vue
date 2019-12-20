<template>
  <Modal
    :value="value"
    @on-cancel="$emit('on-change')"
    transfer
    footer-hide
    :width="720"
    class="modal-apply-detail">
    <div slot="header" class="header"><Icon type="ios-information-circle" />应用信息详情</div>

    <template
      v-for="(info,index) of infoList">
      <div class="title" :key="`title-${index}`">{{info.label}}</div>
      <Row :gutter="16" :key="`row-${index}`">
        <i-col 
          v-for="(item,i) of info.list"
          :key="`col-${i}`"
          :span="item.span">
          <span class="label">{{item.label}}：</span><Input :value="item.value" readonly class="input-fix"/>
        </i-col>
      </Row>
    </template>

  </Modal>
</template>
<script>
export default {
  model: {
    prop : 'value',
    event: 'on-change'
  },
  props: {
    value: Boolean
  },
  data () {
    return {
      infoList: []
    }
  }
}
</script>
<style lang="scss">
.modal-apply-detail {
  .ivu-modal-content {
    overflow: hidden;
  }
  .ivu-modal-close {
    top: 14px;
    .ivu-icon {
      color: #fff;
    }
  }
  .ivu-modal-header {
    padding: 20px 16px;
    background: url('~@/assets/img/bg_apply-detail.jpg') no-repeat center / cover;
  }
  .header {
    color: #fff;
    font-size: 18px;
    .ivu-icon {
      margin-right: 8px;
      font-size: 24px;
      vertical-align: middle;
      color: $theme-color;
    }
  }
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  .ivu-input-large {
    height: 36px;
  }
  .label {
    display: inline-block;
    width: 80px;
    font-size: 15px;
  }
  .input-fix {
    width: calc(100% - 80px);
  }
  .ivu-row {
    margin: 12px 0;
  }
  .ivu-col {
    margin-bottom: 10px;
  }
  .ivu-input[disabled] {
    cursor: default;
  }
}
</style>