<template>
  <div class="tabModel">
    <Table
      :columns="columnsData"
      :data="tableList"
    >
    </Table>
  </div>
</template>
<script>
export default {
  props: {
    columnsData: {
      type: Array,
      default () {
        return []
      }
    },
    tableList: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>