<template>
  <div class="indexDetail">
    <div class="product-v6-banner">
      <div class="product-banner-pc-wrapper">
        <div class="product-banner-pc-bg">
          <div class="product-banner-pc-bg-inner" style="background-image: url(_index/assets/img/application-bg.png)"></div>
        </div>
      </div>
    </div>
    <div class="banner-position">
      <div class="application-banner">
        <div class="context">
          <h2>{{dataInfo.fullName}}</h2>
          <p v-html="changeText"></p>
          <div class="star">
            <img src="../../assets/img/star_0.png" alt="" class="star0">
            <img src="../../assets/img/star_1.png" alt="" class="star1">
            <img src="../../assets/img/star_2.png" alt="" class="star2">
            <img src="../../assets/img/star_3.png" alt="" class="star3">
            <img src="../../assets/img/star_4.png" alt="" class="star4">
          </div>
          <div class="btnGroup">
            <a href="javascript:;" class="apply btnActive" @click="onApply">一键申请</a>
            <router-link :to='{path:`/productDoc/${$route.params.id}`,query:{type:$route.query.type}}' class="document">文档资料</router-link>
            <a href="javascript:;" class="system">进入系统</a>
          </div>
        </div>
      
      </div>
    </div>
    <div class="application-tabs">
      <ul>
        <li :class="activeIndex==index?'active':''" 
          v-for="(item,index) in tabList" 
          :key="index" 
          @click="handleClick(index)">{{item.name}}</li>
      </ul>
    </div>
    <div class="indexDetail-content">
      <keep-alive>
        <component :is="curComponent" :sourceType='index' :serviceId='$route.params.id' :data-info='unitInfo'></component>
      </keep-alive>
    </div>
    <PromptModal :modal-data="modalData" @on-success='onSubmit' @on-cancel='onCancel'/>
  </div>
</template>
<script>
import Introduce from './Introduce/index' //功能介绍
import Evaluate from './Evaluate/index'  //用户评价
// import PaasApplication from './Paas/index'
import { fetchAssDataById } from '_index/api/index.js'
import PromptModal from '_index/components/prompt-modal.vue'
import { asyncApplySubmit } from '@/api/index.js'
export default {
  components: {
    Introduce,
    Evaluate,
    PromptModal
  },
  data () {
    return {
      tabList: [
        { name: '应用介绍' },
        { name: '分层解耦' },
        { name: '用户评价' }
      ],
      types       : ['cloudApp', 'saas', 'daas', 'paas', 'iaas'],
      index       : 0,
      activeIndex : 0,
      curComponent: Introduce,
      dataInfo    : {
        fullName   : '上云应用',
        description: '这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述这里是上云应用的描述'
      },
      unitInfo: {
        buildUnit         : '',
        buildPerson       : '',
        buildPhone        : '',
        constructionUnit  : '',
        constructionPerson: '',
        constructionPhone : ''
      },
      modalData: {
        type           : '',
        applyPermission: false
      }
    }
  },
  computed: {
    changeText () {
      if (this.dataInfo.description.length > 160) {
        return this.dataInfo.description.slice(0, 160) + '...'
      } else {
        return this.dataInfo.description
      }
    }
  },
  mounted () {
    this.index = this.types.findIndex(item => item === this.$route.query.type) + 1
    this.getDataDetail()
  },
  watch: {
    '$route.params.id' (newVal) {
      if (newVal) {
        this.getDataDetail()
        this.activeIndex = 0
        this.curComponent = Introduce
      }
    }
  },
  methods: {
    handleClick (index) {
      this.activeIndex = index
      if (index == 0) {
        this.curComponent = Introduce
      } else if (index == 2) {
        this.curComponent = Evaluate
      } 
      // else if (index == 2) {
      //   this.curComponent = DaasApplication
      // } else {
      //   this.curComponent = SaasApplication
      // }
    },
    getDataDetail () {
      fetchAssDataById(this.$route.params.id, this.$route.query.type).then(res => {
        console.log(res, 'resde')
        if (res.code === 0) {
          Object.keys(this.dataInfo).forEach(item => {
            this.dataInfo[item] = res.data[item]
          })
          Object.keys(this.unitInfo).forEach(item => {
            this.unitInfo[item] = res.data[item]
          })
        }
      })
    },
    //一键申请
    onApply () {
      if (this.index < 4) {
        this.modalData.type = 'submitCarts'
        this.modalData.applyPermission = !this.modalData.applyPermission
      } else {
        this.modalData.type = 'submitCarts-yun'
        this.modalData.applyPermission = !this.modalData.applyPermission
      }
    },
    onCancel () {
      this.modalData.applyPermission = !this.modalData.applyPermission
    },
    onSubmit (form) {
      console.log(form)
      let data = {
        appId                 : form.appId,
        applyIntroduction     : form.applyIntroduction,
        applyPhone            : form.applyPhone,
        applyUser             : form.applyUser,
        departmentApprovalUser: form.departmentApprovalUser,
        cartIds               : this.$route.params.id,
        orgId                 : form.orgId.join(',')
      }
      asyncApplySubmit(data).then(res => {
        if (res.code === 0) {
          this.getDataDetail()
          this.$Message.success('提交成功')
          this.onCancel()
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  }
  
}
</script>
<style lang="scss">
@import './index.scss';
</style>