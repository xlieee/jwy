<template>
  <div class="service-publish" id="application-register-main">
    <div class="product-v6-banner">
      <div class="product-banner-pc-wrapper">
        <div class="product-banner-pc-bg">
          <div class="product-banner-pc-bg-inner" style="background-image: url(../../assets/img/background_0.png)"></div>
        </div>
      </div>
    </div>
    <div class="service-publish-main">
      <h2>服务发布</h2>
      <p class="sub">提供API类SAAS服务、DAAS服务及PAAS服务的发布申请入口</p>
      
      <Steps :current="current" class="step">
        <Step v-for="(item,index) in stepList" :title="item.name" :key="index"></Step>
      </Steps>
      <div class="application-register-form">
        <keep-alive>
          <component :is="curComponent"></component>
        </keep-alive>
      </div>
    </div>
    <div class="service-publish-footer footer-fixed" id="service-publish-footer">
      <div class="footer" >
        <p @click="next">下一步<i></i></p>
        
      </div>
    </div>
  </div>
</template>
<script>
import Base from './base'
import $ from 'jquery'
export default {
  data () {
    return {
      stepList: [
        { name: '基本信息' },
        { name: '创建后端服务' },
        { name: '创建API' },
        { name: '创建API产品' }
      ],
      current     : 0,
      curComponent: Base
    }
  },
  mounted () {
    this.activeIndex = sessionStorage.activeIndex || 0
    window.addEventListener('scroll', this.handleScroll, true)  // 监听（绑定）滚轮滚动事件
  },
  methods: {
    next () {
      if (this.current == 3) {
        this.current = 0
      } else {
        this.current += 1
      }
    },
    handleScroll () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      if ((scrollTop + clientHeight) < $('#application-register-main').height()) {
        $('#service-publish-footer:first').addClass('footer-fixed')
      } else {
        $('#service-publish-footer:first').removeClass('footer-fixed')
      }
      
    }
  },
  components: {
    Base
  }
}
</script>
<style lang="scss">
.service-publish{
  background: #F1F3FE;
  .product-v6-banner{
    height: 0;
    .product-banner-pc-wrapper{
      position: absolute;
      top: 80px;
      right: 0;
      bottom: 0;
      left: 0;
      height: 60px;
      overflow: hidden;
    }
    .product-banner-pc-bg{
      background-color: #152247;
      background-position: center;
      background-repeat: no-repeat;
      height: 120px;
      transform: translate(0px, -60px) scale(1);
      transform-origin: center bottom;
      background-size: cover;
      transition: all 0.5s ease 0s;
      position: relative;
      transform: translate(0px, -59.7059px) scale(1);
      .product-banner-pc-bg-inner{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }
    }
  }
}
.service-publish-main{
  width: $mainWidth;
  margin: 140px auto 0;
  h2{
    padding-top: 40px;
    font-size: 28px;
    line-height: 40px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 10px;
  }
  .sub{
    font-size: 16px;
    color: #666666;
    line-height: 22px;
    margin-bottom: 28px;
  }
  .application-register-form{
    background: #fff;
    margin-top: 30px;
    padding: 32px 48px 80px;
    overflow: hidden;
  }
}
.service-publish-footer{
  height: 90px;
  width: 100%;
  background: #fff;
  box-shadow:0px -2px 20px 0px rgba(11,36,68,0.1);
  .footer{
    width: $mainWidth;
    height: 90px;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    >p{
      width: 140px;
      height: 44px;
      line-height: 44px;
      margin-top: 23px;
      background: #F66F6A;
      color: #fff;
      padding-left: 35px;
      float: right;
      margin-right: 48px;
      cursor: pointer;
      font-size: 16px;
      &:hover{
        box-shadow: 0 8px 6px -4px rgba(246, 111, 106, 0.5)
      }
      i{
        margin-left: 10px;
        display: inline-block;
        width: 15px;
        height: 12px;
        background: url('../../assets/img/right.png') no-repeat center center;
      }
    }
    
  }
}
.footer-fixed{
  position: fixed !important;
  bottom: 0
}
</style>