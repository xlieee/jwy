<template>
  <div class="source-iaas">
    <TitleBlcok :name='type+"资源("+list.length+")"' :type='type'>
      <span :class="flag?'pickUp':'expansion'" v-if="list.length>10" @click="handleExpension">{{flag?'收起':'展开'}}</span>
    </TitleBlcok>
    <SideList :sideDataList='typeList' type='workBench'></SideList>
  </div>
</template>
<script>
import TitleBlcok from '../../components/title-block.vue'
import SideList from '../../components/side-list'
export default {
  props: {
    type: String,
    list: {
      type   : Array,
      default: () => []
    }
  },
  data () {
    return {
      typeList: [],
      flag    : false //是否展开
    }
  },
  mounted () {
    this.typeList = this.list.slice(0, 8)
  },
  methods: {
    handleExpension () {
      this.flag = !this.flag
      if (this.flag) {
        this.typeList = this.list
      } else {
        this.typeList = this.list.slice(0, 8)
      }
    }
  },
  components: {
    TitleBlcok,
    SideList
  }
}
</script>