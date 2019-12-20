<template>
  <div class="saas daas iaas">
    <div class="saasMain">
      <div class="saas-head">
        <p class="saas-title daas-title">IAAS基础设施服务</p>
        <p class="saas-description daas-description">{{total}}个数据服务支撑</p>
      </div>
      <div class="saasContent">
        <SideList :sideDataList='iaasDataList' :titleLength="10" :descLength="65" type='iaas'/>
      </div>
      <a href="javascripg:;" class="more" @click="more('iaas',iaasSide)">查看更多</a>
    </div>
  </div>
</template>
<script>
import SideList from '../../../components/side-list'
import { fetchAssData } from '_index/api/index.js'
export default {
  components: {
    SideList
  },
  props: {
    more: {
      type: Function
    }
  },
  data () {
    return {
      iaasDataList: [],
      page        : {
        current : 1,
        size    : 9,
        subclass: ''
      },
      iaasSide: [],
      total   : 0
    }
  },
  mounted () {
    this.getDataList()
    
  },
  watch: {
    '$route.name' (newVal) {
      console.log(newVal)
      if (newVal == 'index') {
        this.getDataList()
      }
    }
  },
  methods: {
    //获取SaaS列表
    getDataList () {
      fetchAssData(this.page, 'iaas').then(res => {
        if (res.code === 0) {
          this.iaasDataList = res.data.records.map(item => {
            return {
              id         : item.id,
              title      : item.shortName,
              description: item.description,
              url        : item.systemUrl,
              image      : item.imageUrl
            }
          })
          this.total = res.data.total
        } else {
          this.iaasDataList = []
        }
      })
    },
    handleSide (id) {
      this.page.subclass = id
      this.getDataList()
    }
  }
}
</script>