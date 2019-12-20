<template>
  <div class="daas">
    <div class="saasMain">
      <div class="saas-head">
        <p class="saas-title daas-title">热门DAAS服务</p>
        <p class="daas-description saas-description">{{total}}个数据服务支撑</p>
      </div>
      <div class="saasContent">
        <SideItem :sideList='daasSide' type='daas' :bg='daasbg' :onSide='handleSide'/>
        <SideList :sideDataList='daasDataList' type='daas'/>
      </div>
      <a href="javascripg:;" class="more" @click="more('daas',daasSide)">查看更多</a>
    </div>
  </div>
</template>
<script>
import SideItem from '../../../components/side-item'
import SideList from '../../../components/side-list'
import daasbg from '../../../assets/img/home-side-daas-bg.png'
import { fetchSubclass, fetchAssData } from '_index/api/index.js'
export default {
  components: {
    SideItem,
    SideList
  },
  props: {
    more: {
      type: Function
    }
  },
  data () {
    return {
      daasSide    : [],
      daasbg      : 'background:url(' + daasbg + ') no-repeat center center',
      daasDataList: [],
      page        : {
        current : 1,
        size    : 9,
        subclass: ''
      },
      total: 0
    }
  },
  mounted () {
    this.getSubclass()
  },
  watch: {
    '$route.name' (newVal) {
      console.log(newVal)
      if (newVal == 'index') {
        this.page.subclass = this.daasSide[0].id
        this.getDataList()
      }
    }
  },
  methods: {
    //获取侧边列表
    getSubclass () {
      fetchSubclass('Daas').then(res => {
        if (res.code === 0) {
          this.page.subclass = res.data[0].id
          this.daasSide = res.data.map(item => {
            return {
              id    : item.id,
              title : item.title,
              remark: item.remark
            }
          })
          this.getDataList()
        } else {
          this.daasSide = []
        }
      })
    },
    //获取DaaS列表
    getDataList () {
      fetchAssData(this.page, 'daas').then(res => {
        if (res.code === 0) {
          this.daasDataList = res.data.records.map(item => {
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
          this.daasDataList = []
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