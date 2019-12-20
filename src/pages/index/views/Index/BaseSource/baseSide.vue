<template>
  <div class="base-side">
    <div class="base-side-head">
      <img :src="info.pic" alt="">
      <span>{{info.text}}</span>
    </div>
    <div class="base-side-list">
      <dl v-for="(item,index) in sideList" :key="index">
        <dt>{{item.num}}</dt>
        <dd>{{item.name}}</dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    sideList: {
      type   : Array,
      default: () => []
    },
    info: {
      type: Object
    }
  },
  data () {
    return {
        
    }
  }
}
</script>