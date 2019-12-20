<template>
  <div class="sceneModal">
    <div class="modalMain">
      <div class="modal-head">
        <p class="modal-title">应用场景</p>
        <p class="modal-description">上云应用场景介绍</p>
      </div>
      <Tabs value="name1" class="scene-tabs" v-model="tabActive">
          <TabPane v-for="(item,index) in sceneData" :label="item.name" :name="item.name" :key="index">
            <img :src="item.imageUrl" alt="" class="scencePic">
            <div class="sceneContext">
              <p class="title">{{item.name}}</p>
              <p class="desc" v-html="item.description"></p>
            </div>
          </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
// import scenePic from '../../../assets/img/scene_pic.png'
export default {
  props: {
    sceneData: {
      type   : Array,
      default: () => []
    }
  },
  data () {
    return {
      tabActive: 0,
      tabsList : ['核心数据库', '高性能计算', '大数据', '数据仓储']
      // sceneData: {
      //   img  : scenePic,
      //   title: '核心数据库',
      //   desc : '满足核心数据库对性能和安全的要求，华为云BMS提供多种规格的服务器，支持自动化挂载共享云硬盘。满足核心数据库对性能和安全的要求，华为云BMS提供多种规格的服务器，支持自动化挂载共享云硬盘。满足核心数据库对性能和安全的要求，华为云BMS提供多种规格的服务器，支持自动化挂载共享云硬盘。满足核心数据库对性能和安全的要求，华为云BMS提供多种规格的服务器，支持自动化挂载共享云硬盘。满足核心数据库对性能和安全的要求，华为云BMS提供多种规格的服务器，支持自动化挂载共享云硬盘。满足核心数据库对性能和安全的要求，华为云BMS提供多种规格的服务器，支持自动化挂载共享云硬盘。满足核心数据库对性能和安全的要求，华为云BMS提供多种规格的服务器，支持自动化挂载共享云硬盘。满足核心数据库对性能和安全的要求，华为云BMS提供多种规格的服务器，支持自动化挂载共享云硬盘。'
      // }
    }
  },
  mounted () {
    console.log(this.sceneData, 'this.sceneData')
  }
}
</script>