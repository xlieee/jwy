<template>
  <div class="title-block" :id="type?'title-'+type:''">
    <!-- <img src="../assets/img/title-icon.svg" alt=""> -->
    <p class="name">{{name}}</p>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    name: String,
    type: String
  }
}
</script>
<style lang="scss">
.title-fixed{
  position: fixed;
  top: 80px;
  z-index: 999;
  transition: .5s;
  background:$active !important;
  .name{
    color: #fff !important;
    background: url('../assets/img/title-icon-fff.svg') no-repeat 0 center !important;
  }
  .expansion{
    color: #fff !important;
    background: url('../assets/img/expansion-fff.svg') no-repeat 42px center !important;
  }
  .pickUp{
    color: #fff !important;
    background: url('../assets/img/pickUp-fff.svg') no-repeat 42px center !important;
  }
  .tip{
    p{
      color: #fff !important;
      span{
        color: #fff !important;
      }
    }
  }
}
.title-block{
  height: 50px;
  transition: .5s;
  overflow: hidden;
  line-height: 50px;
  padding: 0 20px;
  background: #fff;
  border-bottom:1px solid $active;
  .name{
    padding-left: 44px;
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    display: inline-block;
    background: url('../assets/img/title-icon.svg') no-repeat 0 center;
    
  }
  .expansion{
    float: right;
    color: #606266;
    font-size: 14px;
    width: 56px;
    cursor: pointer;
    background: url('../assets/img/expansion.svg') no-repeat 42px center;
    transition: .5s;
  }
  .pickUp{
    float: right;
    color: $active;
    font-size: 14px;
    width: 56px;
    cursor: pointer;
    background: url('../assets/img/pickUp.svg') no-repeat 42px center;
    transition: .5s;
  }
}
</style>