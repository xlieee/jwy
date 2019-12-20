<template>
  <div class="application">
    <div class="product-v6-banner">
      <div class="product-banner-pc-wrapper">
        <div class="product-banner-pc-bg">
          <div class="product-banner-pc-bg-inner" style="background-image: url(../../assets/img/application-bg.png)"></div>
        </div>
      </div>
    </div>
    <div class="banner-position">
      <div class="application-banner">
        <div class="context">
          <h2>资源一键申请</h2>
          <p>面向全省公安提供资源服务的一键申请，实现敏捷开发、快速上线，重塑系统开发模式</p>
          <div class="star">
            <img src="../../assets/img/star_0.png" alt="" class="star0">
            <img src="../../assets/img/star_1.png" alt="" class="star1">
            <img src="../../assets/img/star_2.png" alt="" class="star2">
            <img src="../../assets/img/star_3.png" alt="" class="star3">
            <img src="../../assets/img/star_4.png" alt="" class="star4">
          </div>
        </div>
      
      </div>
    </div>
    <div class="application-tabs">
      <ul>
        <li :class="activeIndex==index?'active':''" 
          v-for="(item,index) in tabList" 
          :key="index" 
          @click="handleClick(index)">{{item.name}}申请</li>
      </ul>
    </div>
    <div class="application-content">
      <keep-alive>
        <component :is="curComponent" @addCart='addGoods'></component>
      </keep-alive>
    </div>
    <div class="demo">
      <div class="side-nav">
        <ul>
          <li id="cart" @click="toCarts">
            <Badge :count="count" type="error" class-name="nav-badge">
              <img src="../../assets/img/application-cart.svg" alt="">
            </Badge>
            
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import IaasApplication from './Iaas/index'
import SaasApplication from './Saas/index'
import DaasApplication from './Daas/index'
import PaasApplication from './Paas/index'
import YunApplication from './Yun/index'
import { funParabola } from '_index/libs/parabola.js'
import { asyncAddCart, fetchCartCount } from '_index/api/application.js'

export default {
  components: {
    IaasApplication,
    SaasApplication,
    DaasApplication,
    PaasApplication,
    YunApplication
  },
  data () {
    return {
      tabList: [
        { name: 'IaaS资源' },
        { name: 'PaaS服务' },
        { name: 'DaaS服务' },
        { name: 'SaaS服务' },
        { name: '上云应用' }
      ],
      activeIndex : 0,
      curComponent: IaasApplication,
      count       : 0
    }
  },
  mounted () {
    this.getCartCount()
  },
  methods: {
    handleClick (index) {
      this.activeIndex = index
      if (index == 0) {
        this.curComponent = IaasApplication
      } else if (index == 1) {
        this.curComponent = PaasApplication
      } else if (index == 2) {
        this.curComponent = DaasApplication
      } else if (index == 3) {
        this.curComponent = SaasApplication
      } else {
        this.curComponent = YunApplication
      }
    },
    getCartCount () {
      fetchCartCount().then(res => {
        if (res.code === 0) {
          this.count = res.data
        } else {
          this.count = 0
        }
      })
    },
    addGoods (id, type) {
      let _this = this
      var fly = document.getElementById(`target-${id}`)//移动的元素
      var cart = document.getElementById('cart')//目标元素
      // 初始化抛物线动画
      var parabola = funParabola(fly, cart, {
        speed    : 100, // 每帧移动的像素大小
        curvature: 0.005, // 实际指焦点到准线的距离
        complete : function () {
          fly.style.display = 'none'
          _this.addToCarts(id, type)
          
        },
        otherTransform: ''
      }).init()
      console.log(parabola)
    },
    toCarts () {
      this.$router.push('/shoppingCart')
    },
    //加入购物车
    addToCarts (id, type) {
      asyncAddCart({ serviceId: id, type }).then(res => {
        if (res.code === 0) {
          this.getCartCount()
          this.$Message.success('添加成功')
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  }
  
}
</script>
<style lang="scss">
@import './index.scss';
#target{
  width:10px;
  height:10px;
  background:red;
  position:absolute;
}
</style>