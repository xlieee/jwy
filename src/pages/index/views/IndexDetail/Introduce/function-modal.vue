<template>
  <div class="modalMain">
    <div class="modal-head">
      <p class="modal-title">功能特点</p>
      <p class="modal-description">重点功能特点描述</p>
    </div>
    <ul class="modalList">
      <li v-for="(item,index) in funcData" :key="index">
        <img :src="item.imageUrl" alt="">
        <p class="title">{{item.name}}</p>
        <p class="desc" v-html="item.description"></p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    funcData: {
      type   : Array,
      default: () => []
    }
  },
  data () {
    return {
      
    }
  }
}
</script>