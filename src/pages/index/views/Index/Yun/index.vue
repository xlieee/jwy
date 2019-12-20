<template>
  <div class="yun">
    <div class="yunMain">
      <div class="yun-head">
        <p class="yun-title">典型上云案例</p>
        <p class="yun-description">经典警云案例分析，带您快速了解我们的产品</p>
      </div>
      <Tabs class="yun-tabs" v-model="tabActive" @on-click='onTabChange'>
          <TabPane v-for="(item,index) in tabsList" :label="item.title" :name="item.id" :key="index">
            <TabItem :list="list"/>
          </TabPane>
      </Tabs>
      <a href="javascripg:;" class="tab-more" @click="more">查看更多经典案例</a>
    </div>
    <PromptModal :modal-data="modalData"/>
  </div>
</template>
<script>
import TabItem from './tabItem.vue'
import PromptModal from '_index/components/prompt-modal.vue'
import { fetchSubclass, fetchAssData } from '_index/api/index.js'
export default {
  components: {
    TabItem,
    PromptModal
  },
  data () {
    return {
      tabsList : [],
      list     : [],
      tabActive: 0,
      page     : {
        current : 1,
        size    : 4,
        subclass: ''
      },
      modalData: {
        type           : '',
        applyPermission: false
      }
    }
  },
  mounted () {
    this.getSubclass()
  },
  '$route.name' (newVal) {
    if (newVal == 'index') {
      this.page.subclass = this.tabsList[0].id
      this.getSubclass()
    }
  },
  methods: {
    //获取侧边列表
    getSubclass () {
      fetchSubclass('CloudApp').then(res => {
        if (res.code === 0) {
          this.page.subclass = res.data[0].id
          this.tabsList = res.data.map(item => {
            return {
              id   : item.id,
              title: item.title
            }
          })
          this.getDataList()
        } else {
          this.saasSide = []
        }
      })
    },
    //获取yun列表
    getDataList () {
      fetchAssData(this.page, 'cloudApp').then(res => {
        if (res.code === 0) {
          this.list = res.data.records.map(item => {
            return {
              id         : item.id,
              title      : item.shortName,
              description: item.description,
              url        : item.systemUrl,
              image      : item.imageId
            }
          })
        } else {
          this.saasDataList = []
        }
      })
    },
    onTabChange (name) {
      this.page.subclass = name
      this.getDataList()
    },
    more () {
      const { tabsList } = this
      if (localStorage.token) {
        this.$router.push({ path: 'indexMore/cloudApp', query: { sideList: JSON.stringify(tabsList) } })
      } else {
        this.modalData.type = 'no-login'
        this.modalData.applyPermission = !this.modalData.applyPermission
      }
    }
  }
}
</script>