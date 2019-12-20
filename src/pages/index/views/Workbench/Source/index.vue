<template>
  <div class="applied" id="applied">
    <ul class="radioType">
      <li v-for="(item,index) in tabList" :key="index" :class="activeIndex==index?'active':''" @click="tabChange(item,index)">
        <i :class="'icon-'+item.icon"></i>{{item.name}}
      </li>
    </ul>
    <div class="work-source-content">
      <keep-alive>
        <component :is="componentsList[activeIndex]" :type='activeIndex'></component>
      </keep-alive>
    </div>
    <!-- <TypeItem type='Iaas' :list='iaasList'></TypeItem>
    <TypeItem type='Paas' :list='paasList'></TypeItem>
    <div class="applied-foot">
      <div class="applied-daas">
        <TitleBlcok name='Daas资源'></TitleBlcok>
        <SideList :sideDataList='daasList' type='daas'></SideList>
      </div>
      <div class="applied-daas">
        <TitleBlcok name='Saas资源'></TitleBlcok>
        <SideList :sideDataList='saasList' type='saas'></SideList>
      </div>
    </div> -->
  </div>
</template>
<script>
// import TypeItem from '../type-item'
// import TitleBlcok from '../../../components/title-block.vue'
// import SideList from '../../../components/side-list'
import SourceItem from './source-item'
import ServiceItem from './service-item'
// import $ from 'jquery'
export default {
  data () {
    return {
      tabList: [
        { name: '资源服务', icon: 'source' },
        { name: '服务发布', icon: 'service' },
        { name: '应用注册', icon: 'application' }
      ],
      activeIndex   : 0,
      componentsList: [SourceItem, ServiceItem, ServiceItem],
      iaasList      : [
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 }
      ],
      paasList: [
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '裸金属服务器 BMS', count: 27 },
        { name: 'ECS（弹性云服务器)', count: 27 },
        { name: '弹性伸缩 AS', count: 27 }
      ],
      daasList: [
        { name: '使用中的DAAS资源总数', count: 4 }
      ],
      saasList: [
        { name: '使用中的SAAS资源总数', count: 4 }
      ]
    }
  },
  mounted () {
    // window.addEventListener('scroll', this.handleScroll, true)  // 监听（绑定）滚轮滚动事件
  },
  methods: {
    // handleScroll () {
    //   // let clientHeight = document.documentElement.clientHeight || document.body.clientHeight  
    //   // 设备/屏幕高度
    //   let scrollObj = document.getElementById('work-content') // 滚动区域
    //   let workContentLeft = document.getElementById('work-content-left') //滚动左侧区域
    //   let scrollTop = scrollObj.scrollTop // div 到头部的距离
    //   let scrollHeight = scrollObj.scrollHeight // 滚动条的总高度
    //   console.log(scrollTop, scrollHeight, workContentLeft.clientWidth)
      
    //   if (scrollTop >= 24) {
    //     if (scrollTop >= 357) {
    //       $('#title-Paas:first').addClass('title-fixed')
    //       $('#title-Iaas:first').removeClass('title-fixed')
    //       $('#title-Paas:first').innerWidth(workContentLeft.clientWidth)
    //     } else {
    //       $('#title-Iaas:first').addClass('title-fixed')
    //       $('#title-Iaas:first').innerWidth(workContentLeft.clientWidth)
    //       $('#title-Paas:first').removeClass('title-fixed')
    //       $('#title-Paas:first+.home-side-list').css('padding-top', '0')
    //       $('#title-Iaas:first+.home-side-list').css('padding-top', '60px')
    //     }
    //   } else {
    //     $('#title-Iaas:first').removeClass('title-fixed')
    //     $('#title-Paas:first').removeClass('title-fixed')
    //     $('#title-Iaas:first+.home-side-list').css('padding-top', '0')
    //     $('#title-Paas:first+.home-side-list').css('padding-top', '0')
    //   }
    // },
    tabChange (row, index) {
      this.activeIndex = index
    }
  },
  components: {
    SourceItem,
    ServiceItem
    // TypeItem,
    // TitleBlcok,
    // SideList
  }
}
</script>