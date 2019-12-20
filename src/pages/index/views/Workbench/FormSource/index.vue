<template>
  <div>
    <component :is="curComponent" :onClick='handleClick' :type='type'></component>
  </div>
</template>
<script>
import Home from './home'
import TableBlock from './table-block'
export default {
  components: {
    Home,
    TableBlock
  },
  props: {
    current: Number
  },
  
  data () {
    return {
      curComponent: Home,
      type        : 0
    }
  },
  methods: {
    handleClick (flag, row) {
      this.type = row ? row.type : 0
      console.log(this.type)
      if (flag == 0) {
        this.curComponent = Home
      } else {
        this.curComponent = TableBlock
      }
    }
  }
}
</script>