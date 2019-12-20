<template>
  <div class="doc-paas">
    <div class="dataList" v-if="tableList.length>0">
      <SideList :sideDataList='tableList' :descLength='40' type='iaas' origin='doc'></SideList>
      <Page :total="total" :page-size="page.size" class-name='pagination' @on-change="changepage"/>
    </div>
    <NoContent v-else/>
  </div>
</template>
<script>
import SideList from '_index/components/side-list'
import { fetchAssData } from '_index/api/index.js'
import NoContent from '../no-content'
export default {
  components: {
    SideList,
    NoContent
  },
  data () {
    return {
      tableList: [],
      page     : {
        current : 1,
        size    : 10,
        subclass: '',
        name    : ''
      },
      total: 0
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    //获取IaaS列表
    getData () {
      fetchAssData(this.page, 'iaas').then(res => {
        if (res.code === 0) {
          this.tableList = res.data.records.map(item => {
            return {
              id         : item.id,
              title      : item.shortName,
              image      : item.imageUrl,
              description: item.description
            }
          })
          this.total = res.data.total
        } else {
          this.tableList = []
        }
      })
    },
    changepage (index) {
      this.page.current = index
      this.getData()
    }
  }
}
</script>
