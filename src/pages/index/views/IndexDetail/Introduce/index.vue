<template>
  <div>
    <FunctionModal :func-data='funcData' v-if="funcData.length>0"></FunctionModal>
    <SceneModal :scene-data='sceneData' v-if="sceneData.length>0"></SceneModal>
    <FunctionDetail :func-data='funcDetail' v-if="funcDetail.length>0"></FunctionDetail>
    <UnitModal :data-info='dataInfo' v-if="dataInfo.buildUnit"></UnitModal>
  </div>
</template>
<script>
import FunctionModal from './function-modal' //功能特点
import SceneModal from './scene-modal'  //应用场景
import FunctionDetail from './function-detail' //功能详情
import UnitModal from './unit-modal'  //功能详情
import { fetchDataSubclassfwById } from '_index/api/index.js'
export default {
  components: {
    FunctionModal,
    SceneModal,
    FunctionDetail,
    UnitModal
  },
  props: {
    sourceType: {
      type: Number
    },
    serviceId: {
      type: String
    },
    dataInfo: {
      type   : Object,
      default: () => {}
    }
  },
  data () {
    return {
      funcData  : [],
      sceneData : [],
      funcDetail: []
      // dataInfo  : {
      //   buildUnit         : '',
      //   buildPerson       : '',
      //   buildPhone        : '',
      //   constructionUnit  : '',
      //   constructionPerson: '',
      //   constructionPhone : ''
      // }
    }
  },
  watch: {
    sourceType (newVal) {
      if (newVal) {
        this.sourceType = newVal
        this.handleDetail()
      }
    },
    '$route.params.id' (newVal) {
      if (newVal) {
        this.handleDetail()
      }
    }
  },
  methods: {
    handleDetail () {
      fetchDataSubclassfwById(this.serviceId, this.sourceType).then(res => {
        if (res.code === 0) {
          this.funcData = res.data.filter(item => item.type === 0)
          this.sceneData = res.data.filter(item => item.type === 1)
          this.funcDetail = res.data.filter(item => item.type === 2)
        }
      })
    }
  }
}
</script>