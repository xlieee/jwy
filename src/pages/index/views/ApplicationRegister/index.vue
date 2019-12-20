<template>
  <div class="application-register">
    <div class="product-v6-banner">
      <div class="product-banner-pc-wrapper">
        <div class="product-banner-pc-bg">
          <div class="product-banner-pc-bg-inner" style="background-image: url(../../assets/img/background_0.png)"></div>
        </div>
      </div>
    </div>
    <div class="application-register-main">
      <h2>应用注册</h2>
      <p class="sub">提供API类SAAS服务、DAAS服务及PAAS服务的发布申请入口</p>
      <div class="application-register-form">
        <Base />
      </div>
    </div>
    <div class="application-register-footer footer-fixed" id="application-register-footer">
      <div class="footer">
        <p class="submitBtn">提交审核</p>
        <p class="cancelBtn">取消</p>
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
      
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll, true)  // 监听（绑定）滚轮滚动事件
  },
  methods: {
    handleScroll () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      if ((scrollTop + clientHeight) < $('.application-register').height()) {
        $('#application-register-footer:first').addClass('footer-fixed')
      } else {
        $('#application-register-footer:first').removeClass('footer-fixed')
      }
      
    }
  },
  components: {
    Base
  }
}
</script>
<style lang="scss">
.application-register{
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
.application-register-main{
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
.application-register-footer{
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
      float: right;
      margin-right: 48px;
      cursor: pointer;
      font-size: 16px;
      text-align: center;
      
    }
    .submitBtn{
      background: #F66F6A;
      color: #fff;
      &:hover{
        box-shadow: 0 8px 6px -4px rgba(246, 111, 106, 0.5)
      }
    }
    .cancelBtn{
      background: #EBEEF5;
      color: #606266;
      margin-right: 20px;
    }
  }
}
.footer-fixed{
  position: fixed !important;
  bottom: 0
}
</style>