<template>
  <!-- 搜索无数据 -->
  <div class="searchList-no-text">
    <img src="~_index/assets/img/no-content.svg" alt="">
    <p>未查询到<span v-if="name">“{{name}}”</span>相关的数据</p>
  </div>
</template>
<script>
export default {
  props: {
    name: String
  }
}
</script>
<style lang="scss">
@import './index.scss';
</style>