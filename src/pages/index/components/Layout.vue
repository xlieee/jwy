<template>
  <div id="app">
    <div class="bac" style="z-index:199">
      <Header/>
      <Banner v-if="$route.name!='workbench'&&$route.name!='Login'"/>
    </div>
    <keep-alive>
      <router-view />
    </keep-alive>
    <Footer v-if="$route.name!='workbench'"/>
    
    <QuickNav @back="backTo" v-if="$route.name=='index'"/>
      <!-- :count="applyCount" -->
    
  </div>
</template>

<script>
import Header from './header'
import Footer from './footer'
import Banner from './banner'
import QuickNav from './quick-nav'
import { utilBackTo } from '../utils'
// import $ from 'jquery'
export default {
  components: {
    Header,
    Footer,
    Banner,
    QuickNav
    
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll, true)  // 监听（绑定）滚轮滚动事件
  },
  methods: {
    backTo (name) {
      utilBackTo(name ? this.$el.querySelector(`.anchor_${name}`).offsetTop : 0)
    },
    handleScroll () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let banner = document.getElementById('banner')
      if (scrollTop > 0) {
        banner.style.backgroundColor = '#0B2444'
      } else {
        banner.style.backgroundColor = 'rgba(11, 36, 68, 0.4)'
      }
    }
  }
}
</script>
