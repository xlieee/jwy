<template>
  <div class="home-side" :style="bg">
    <dl v-for="(item,index) in sideList" :key="index" :data-id='item.id' @click="onClick(index,item)" :class="active===index?'home-side-active':''">
      <dt>
        <img :src="item.remark" alt="">
      </dt>
      <dd>{{item.title}}</dd>
    </dl>
  </div>
</template>
<script>
export default {
  props: {
    sideList: {
      type   : Array,
      default: () => []
    },
    type: {
      type: String
    },
    bg: {
      type: String
    },
    onSide: {
      type: Function
    }
  },
  data () {
    return {
      active: 0
    }
  },
  watch: {
    '$route.name' () {
      this.active = 0
    }
  },
  methods: {
    onClick (index, row) {
      this.active = index
      console.log(index, row)
      // this.$emit('on-side', row.id)
      this.onSide(row.id)
    }
  }
}
</script>