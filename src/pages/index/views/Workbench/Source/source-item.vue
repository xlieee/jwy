<template>
  <div class="sourceItem">
    <div class="sourceItemList">
      <div class="list" v-for="(item,index) in typeList" :key="index">
        <TitleBlcok :name='item.name'/>
        <div class="form-data" :style="`background:${item.color}`">
          <div class="total">
            <div>
              <p class="title">申请总数：</p>
              <p class="data">{{item.total}} <span v-if="item.count"><i></i>调用数：{{item.count}}万次</span> </p>
            </div>
          </div>
          <img :src="`${require('_index/assets/img/work-'+item.type+'.png')}`" alt="">
        </div>
      </div>
    </div>
    <TypeItem type='Iaas' :list='iaasList'></TypeItem>
  </div>
</template>
<script>
import TitleBlcok from '../../../components/title-block.vue'
import TypeItem from '../type-item'
export default {
  components: {
    TitleBlcok,
    TypeItem
  },
  data () {
    return {
      typeList: [
        { name: '上云应用', type: 'yun', color: '#5E6BE0', total: 24 },
        { name: 'SaaS服务', type: 'saas', color: '#0091FF', total: 24, count: 200 },
        { name: 'DaaS资源', type: 'daas', color: '#26D0AA', total: 24, count: 200 },
        { name: 'PaaS资源', type: 'paas', color: '#F7AD00', total: 24, count: 200 }
      ],
      iaasList: [
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
      ]
    }
  }
}
</script>