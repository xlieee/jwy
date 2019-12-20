<template>
  <div class="saas paas">
    <div class="saasMain">
      <div class="saas-head">
        <p class="saas-title">热门PAAS服务</p>
        <p class="saas-description">{{total}}个警务云平台服务</p>
      </div>
      <div class="saasContent">
        <SideItem :sideList='paasSide' type='paas' :bg='paasbg' :onSide='handleSide'/>
        <SideList :sideDataList='paasDataList' type='paas'/>
      </div>
      <a href="javascripg:;" class="more" @click="more('paas',paasSide)">查看更多</a>
    </div>
  </div>
</template>
<script>
import SideItem from '../../../components/side-item'
import SideList from '../../../components/side-list'
import paasbg from '../../../assets/img/home-side-paas-bg.png'
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
      paasSide    : [],
      paasbg      : 'background:url(' + paasbg + ') no-repeat center center',
      paasDataList: [],
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
        this.page.subclass = this.paasSide[0].id
        this.getDataList()
      }
    }
  },
  methods: {
    //获取侧边列表
    getSubclass () {
      fetchSubclass('Paas').then(res => {
        if (res.code === 0) {
          this.page.subclass = res.data[0].id
          this.paasSide = res.data.map(item => {
            return {
              id    : item.id,
              title : item.title,
              remark: item.remark
            }
          })
          this.getDataList()
        } else {
          this.paasSide = []
        }
      })
    },
    //获取SaaS列表
    getDataList () {
      fetchAssData(this.page, 'paas').then(res => {
        if (res.code === 0) {
          this.paasDataList = res.data.records.map(item => {
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
          this.paasDataList = []
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