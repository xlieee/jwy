<template>
  <div class="document">
    <div class="product-v6-banner">
      <div class="product-banner-pc-wrapper">
        <div class="product-banner-pc-bg">
          <div class="product-banner-pc-bg-inner" style="background-image: url(../../assets/img/document-bg.png)"></div>
        </div>
      </div>
    </div>
    <div class="banner-position">
      <div class="head">
        <div class="head-main">
          <p class="head-text">警务云文档中心</p>
          <Input v-model="searchText" search enter-button="搜索" placeholder="请输入关键词搜索产品文档" style="width:716px;height:55px;padding:81px 0 0" @on-search='handleSearch'/>
        </div>
      </div>
    </div>
    <div class="content-banner">
      <div class="main">
        <!--文档一级tab -->
        <ul class="service">
          <li v-for="(item,index) in tabsList" :key="index" :class="tabActive==index?'active':''" @click="handleIndex(index)">
            <i :class="item.class"></i>
            {{item.name}}
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <!-- tab内容 -->
      <component :is="curComponent" :docs='typeList' :tabType='tabActive'></component>
      <!-- <keep-alive>
      </keep-alive> -->
    </div>
  </div>
</template>
<script>
import DocMain from './docMain' //产品文档
import DocList from './docList'
import { fetchDocumentTypeList, fetchProblemTypeList } from '../../api/news'
export default {
  data () {
    return {
      tabsList     : [{ name: '产品文档', class: 'information' }, { name: '规范文档', class: 'standard' }, { name: '常见问题', class: 'question' }],
      searchTabList: [
        { name: '全部', count: 20 },
        { name: '产品文档', count: 20 },
        { name: '规范文档', count: 20 },
        { name: '常见问题', count: 20 }
      ],
      list           : [],
      tabActive      : 0,
      tabSearchActive: 0,
      curComponent   : DocMain,
      isSearch       : false, //是否处于搜索状态
      searchText     : '', //查询关键字
      typeList       : []//规范文档/常见问题类型列表
      
    }
  },
  watch: {
    '$route.query.text' (newVal) {
      this.searchText = newVal
    }
    // '$route.name'() {
    //   this.tabActive = 0
    //   this.curComponent = DocMain
    // }
  },
  methods: {
    handleIndex (index) {
      this.tabActive = index
      if (index == 0) {
        this.curComponent = DocMain
      } else {
        if (index == 1) {
          this.getDocTypeList()
        } else {
          this.fetchProblemTypeList()
        }
        
      }
    },
    handleSearch (value) {
      this.searchText = value
      this.$router.push({ path: 'searchList', query: { text: value } })
      sessionStorage.removeItem('activeIndex')
      this.$root.$emit('removeIndex')
    },
    //规范文档类型列表
    getDocTypeList () {
      fetchDocumentTypeList().then(res => {
        if (res.code === 0) {
          this.typeList = res.data.map((item) => {
            return {
              id  : item.id,
              name: item.name
            }
          })
        } else {
          this.typeList = []
        }
        this.curComponent = DocList

      })
    },
    //常见问题类型列表
    fetchProblemTypeList () {
      fetchProblemTypeList().then(res => {
        if (res.code === 0) {
          this.typeList = res.data.map((item) => {
            return {
              id  : item.id,
              name: item.name
            }
          })
        } else {
          this.typeList = []
        }
        this.curComponent = DocList

      })
    }
  },
  components: {
    // DocItem,
    DocMain,
    DocList
  }
}
</script>
<style lang="scss">
  .document{
    background: #F1F3FE;
    .product-v6-banner{
      height: 358px;
      .product-banner-pc-wrapper{
        position: absolute;
        top: 80px;
        right: 0;
        bottom: 0;
        left: 0;
        height: 278px;
        overflow: hidden;
      }
      .product-banner-pc-bg{
        background-color: #152247;
        background-position: center;
        background-repeat: no-repeat;
        height: 337px;
        transform: translate(0px, -60px) scale(1);
        transform-origin: center bottom;
        background-size: cover;
        transition: all 0.5s ease 0s;
        position: relative;
        background-image: url('../../assets/img/document-bg.png');
        transform: translate(0px, -0.7059px) scale(1);
        .product-banner-pc-bg-inner{
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }
      }
    }
    .banner-position{
      position: absolute;
      top: 140px;
      right: 0;
      bottom: 0;
      left: 0;
      height: 217px;
      overflow: hidden;
      padding-top: 0;
    }
    .head{
      height: 217px;
      // background: url('../../assets/img/document-bg.png') no-repeat center center;
      background-size: cover;
      text-align: center;
      .head-main{
        width: $mainWidth;
        margin: 0 auto;
      }
      .head-text{
        font-size: 36px;
        line-height:217px;
        color: #fff;
        float: left;
        margin-right: 60px;
      }
      input{
        height: 55px;
        line-height: 55px;
        text-indent: 11px;
        border-radius: 2px 0 0 2px !important;
        &::placeholder{
          color: #C0C4CC;
          font-size: 16px;
        }
      }
      .ivu-input-group-append, .ivu-input-group-prepend{
        border-radius: 2px;
      }
      .ivu-input:hover{
        border: 0;
      }
      .ivu-input-search{
        padding: 0 36px !important;
        font-size: 18px;
        background: $active !important;
        border-color: $active !important;
        cursor: pointer;
        color: #fff;
      }
    }
    .content-banner{
      background: #0B2444;
      .main{
        width: $mainWidth;
        margin: 0 auto;
        .service{
          overflow: hidden;
          li{
            width: calc((100% - 1px) / 3);
            float: left;
            text-align: center;
            line-height: 70px;
            color: #fff;
            cursor: pointer;
            font-size: 18px;
            position: relative;
            i{
              width: 22px;
              height: 22px;
              display: inline-block;
              position: absolute;
              top: 24px;
              // left: 35%;
              left:calc(50% - 65px)
            }
            .information{
              background: url('../../assets/img/infomation.svg') no-repeat center center
            }
            .standard{
                background: url('../../assets/img/standard.svg') no-repeat center center
              }
              .question{
                background: url('../../assets/img/question.svg') no-repeat center center
              }
            .guide{
              background: url('../../assets/img/guide.png') no-repeat center center
            }
          }
          .active{
            color: $active;
            background: #041933;
            .information{
                background: url('../../assets/img/infomation-active.svg') no-repeat center center
              }
              .standard{
                background: url('../../assets/img/standard-active.svg') no-repeat center center
              }
              .question{
                background: url('../../assets/img/question-active.svg') no-repeat center center
              }
          }
        }
        .service-search{
          overflow: hidden;
          li{
            padding: 0 25px;
            float: left;
            height: 70px;
            line-height: 70px;
            font-size: 18px;
            color: #fff;
            font-weight: 500;
            cursor: pointer;
            &:hover{
              background: #041933;
              color: $active
            }
          }
          .active{
            color: $active;
            background: #041933;
          }
        }
      }
    }
    .content{
      width: $mainWidth;
      margin:auto;
      overflow: hidden;
    }
    .documents-tabs{
      
      .ivu-tabs-nav-scroll{
        text-align: center;
        color: #6F7479;
        font-size: 18px;
        line-height:80px;
      }
      .ivu-tabs-nav{
        width:100%

      }
      .ivu-tabs-tab{
        padding: 0;
        width: 24%;
        
      }
      
      .ivu-tabs-nav .ivu-tabs-tab-active{
        color: $active;
        font-weight: 600
      }
      .ivu-tabs-ink-bar{
        background-color: $active;
      }
      .ivu-tabs-bar{
        margin: 0;
      }
    }
 
  }
</style>