<template>
  <div id="header">
    <div class="logo" @click="gohome">
      <img src="../assets/img/logo1.png" alt="">
      <span class="line"></span>
      <img class="logoText" src="../assets/img/logo.svg" alt="">
      <!-- <span class="logoText">一切资源化、资源目录化、目录全局化、全局标准化</span> -->
    </div>
    <div class="header-right">
      <div class="head-search">
        <i-input placeholder="搜索" class="search-inner">
          <i class="icon-search" slot="suffix"></i>
        </i-input>
      </div>
      
    </div>
  </div>
</template>
<script>
export default {
  
  methods: {
    gohome () {
      this.$router.push('index')
      sessionStorage.activeIndex = 0
    }
  }
}
</script>