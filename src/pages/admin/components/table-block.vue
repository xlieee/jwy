<template>
  <Card 
    :bordered="false" 
    dis-hover 
    class="card-table-fix">
    <Table 
      :columns="table.columns" 
      :data="table.data"
      :loading="table.loading"
      size="large" />
    <div
      v-if="pageAvaliable"
      class="page-wrapper">
      <Page 
        :total="page.pageTotal"
        :current="page.currentPage"
        :show-total="!page.hideTotal"
        :show-elevator="!page.hideElevator"
        :show-sizer="!page.hideSizer"
        @on-change="onChangePage"
        @on-page-size-change="onPageSizeChange"
        placement="top" />
    </div>
    <slot></slot>
  </Card>
</template>
<script>

export default {
  props: {
    pageAvaliable: {
      type: Boolean
    },
    page: {
      type: Object
    },
    table: {
      type: Object
    }
  },
  created () {
    if (this.pageAvaliable) {
      this.onChangePage = pageNum => {
        this.$emit('on-emit', {
          type: 'on-change-page',
          data: { pageNum }
        })
      }
      this.onPageSizeChange = pageSize => {
        this.$emit('on-emit', {
          type: 'on-page-size-change',
          data: { pageSize }
        })
      }
    }
  }
}
</script>