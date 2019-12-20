<template>
  <Select
    ref="select"
    class="tree-select"
    v-bind="$attrs"
    @on-change="handleChange"
    multiple
  >
    <tree-select-tree-item
      :selectedArray="value"
      :data="data"
      @on-clear="handleClear"
      @on-check="handleTreeCheck"
    ></tree-select-tree-item>
  </Select>
</template>

<script>
import Emitter from './emitter.js'
import TreeSelectTreeItem from './tree.vue'
export default {
  name      : 'TreeSelect',
  mixins    : [Emitter],
  components: {
    TreeSelectTreeItem
  },
  props: {
    value: {
      type   : Array,
      default: () => []
    },
    data: {
      type   : Array,
      default: () => []
    },
    loadData: Function
  },
  data () {
    return {
      isChangedByTree: true,
      isInit         : true
    }
  },
  provide () {
    return {
      parent: this
    }
  },
  methods: {
    handleChange (selected) {
      // 添加selected.length修复bug
      if (!this.isChangedByTree || selected.length) this.$emit('input', selected)
      this.isChangedByTree = false
    },
    handleTreeCheck (selectedArray) {
      this.isChangedByTree = true
      this.$emit('input', selectedArray.map(item => item.id))
    },
    handleClear () {
      this.$refs.select.reset()
    }
  }
}
</script>
<style lang="scss">
.tree-select {
  .ivu-tree-arrow {
    vertical-align: 2px;
  }
  .ivu-select-dropdown {
    padding: 0 6px;
  }
}
</style>