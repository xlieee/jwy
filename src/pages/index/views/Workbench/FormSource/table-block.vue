<template>
  <div>
    <div class="form-head">
      <p>申请单 >  <span>{{typeList[type-1]}}</span></p>
      <Button @click="back">返回</Button>
    </div>
    <common-resource-form 
      :left-offset="110"
      fromAdmin
      class-name="ivu-modal-wrap-index-top"/>
  </div>
</template>
<script>
import CommonResourceForm from '@/components/application/resource/daas'
export default {
  components: {
    CommonResourceForm
  },
  props: {
    type   : Number,
    onClick: Function
  },
  provide () {
    return {
      dynamicVar: this.transmitData
    }
  },
  created () {
    this.transmitData.resourceType = this.type
    this.transmitData.type = this.aliasList[this.type - 1]
  },
  data () {
    return {
      typeList    : ['上云应用', 'SAAS服务', 'DAAS服务', 'PAAS服务', 'IAAS服务', '服务发布', '应用注册'],
      aliasList   : ['cloud', 'saas', 'daas', 'paas', 'iaas', 'application', 'service'],
      transmitData: {
        type        : 'daas',
        resourceType: 3
      }
    }
  },
  methods: {
    back () {
      this.onClick(0)
    }
    
  }
}
</script>
<style lang="scss">
.form-head{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  button{
    width: 108px;
    height: 44px;
    background: $active;
    color: #fff;
    border-radius: 2px;
    &:hover{
      background: $active;
      color: #fff;
    }
  }
  p{
    font-size: 14px;
    color: #8A8E99;
    line-height: 44px;
    span{
      font-size: 16px;
      color: #0B2444
    }
  }
}
</style>