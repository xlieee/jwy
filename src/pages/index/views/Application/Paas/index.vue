<template>
  <div class="application-iaas">
    <div class="application-control">
      <ul class="application-control-tab">
        <li :class="activeIndex==index?'tab-focused':''" 
          v-for="(item,index) in tabList" 
          :key="index" 
          class="application-control-tab-item"
          @click="changeTabs(index,item.value)">
          {{item.label}}
          </li>
      </ul>
      <i-input placeholder="请输入资源名称进行搜索" search style="width: 268px" class="application-control-search" @on-search='handleSearch'/>
    </div>
    <keep-alive>
      <component :is="curComponent" :list='handleData(list)' ass-type='paas'></component>
    </keep-alive>
  </div>
</template>
<script>
import AssContent from '../assContent'
import { fetchSubclass, fetchAssUseTokenData } from '_index/api/index.js'
export default {
  data () {
    return {
      list        : [],
      tabList     : [],
      curComponent: AssContent,
      activeIndex : null,
      page        : {
        current : 1,
        size    : 10,
        subclass: '',
        name    : '',
        state   : 1
      },
      total: 0
    }
  },
  mounted () {
    this.getSubclass()
    this.getData()
  },
  methods: {
    handleData (stateType) {
      return stateType.reduce((ret, cur, index) => {
        const coordinate_0 = ~~(index / 3)
        ret[coordinate_0] = ret[coordinate_0] || []
        ret[coordinate_0].push(cur)
        return ret
      }, [])
    },
    //获取所属分类
    getSubclass () {
      fetchSubclass('Paas').then(res => {
        if (res.code === 0) {
          this.tabList = res.data.map(item => {
            return {
              value: item.id,
              label: item.title
            }
          })
          this.getData()
        } else {
          this.daasSide = []
        }
      })
    },
    //获取paaS列表
    getData () {
      fetchAssUseTokenData(this.page, 'paas').then(res => {
        if (res.code === 0) {
          this.list = res.data.records.map(item => {
            return {
              id         : item.id,
              name       : item.shortName,
              image      : item.imageUrl,
              description: item.description
            }
          })
          this.total = res.data.total
        } else {
          this.list = []
        }
      })
    },
    changeTabs (index, value) {
      this.activeIndex = index
      this.page.subclass = value
      this.getData()
    },
    changepage (index) {
      this.page.current = index
      this.getData()
    },
    handleSearch (name) {
      this.page.name = name
      this.getData()
    }
  },
  components: {
    AssContent
  }
}
</script> 