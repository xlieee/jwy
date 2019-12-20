<template>
  <div class="productDoc">
    <div class="product-v6-banner">
      <div class="product-banner-pc-wrapper">
        <div class="product-banner-pc-bg">
          <div class="product-banner-pc-bg-inner" style="background-image: url(../../assets/img/background_0.png)"></div>
        </div>
      </div>
    </div>
    <div class="application-register-main">
      <div class="doc-left">
        <div class="doc-left-main">
          <p class="title">{{dataInfo.fullName}}</p>
          <ul>
            <li v-for="(item,index) in menuList" :key="item.id" :class="active==index?'active':''" @click="handleItem(item,index)">{{item.name}}</li>
          </ul>
        </div>
        <div class="doc-left-item">
          <p class="title"><span></span>相关责任单位</p>
          <ul class="duty-unit">
            <li>责任单位：{{dataInfo.constructionUnit}}</li>
            <li>负责人：{{dataInfo.constructionPerson}}</li>
            <li>联系电话：{{dataInfo.constructionPhone}}</li>
          </ul>
        </div>
        <div class="doc-left-item">
          <p class="title"><span></span>附件下载专区</p>
          <div class="download">
            <a v-for="(item,index) in fileList" :href="item.fileId" :key="index" :title="item.name">{{item.name}}</a>
          </div>
        </div>
      </div>
      <div class="doc-right">
        <p class="breadcrumb">产品文档 > <span>{{dataInfo.fullName}}</span></p>
        <div class="doc-right-context">
          <div class="date">更新时间：{{modifiedTime}}</div>
          <p v-html="content"></p>
        </div>
        <!-- <div class="doc-right-file">
          <p class="doc-right-file-title">附件·2</p>
          <ul class="download">
            <li>微服务专家服务 - 专业服务.PDF</li>
            <li>微服务专家服务 - 专业服务.PDF</li>
          </ul>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { fetchDataDocumentList, fetchAssDataById } from '_index/api/index.js'
export default {
  data () {
    return {
      types       : ['cloudApp', 'saas', 'daas', 'paas', 'iaas'],
      active      : 0,
      menuList    : [],
      content     : '',
      modifiedTime: '',
      fileList    : [],
      dataInfo    : {
        constructionUnit  : '',
        constructionPerson: '',
        constructionPhone : '',
        fullName          : ''
      }
    }
  },
  mounted () {
    this.getDocument()
    this.getDataDetail()

    this.$watch('$route.params.id', () => {
      this.content = ''
      this.getDocument()
      this.getDataDetail()
    }) 
  },
  methods: {
    getDocument () {
      const index = this.types.findIndex(item => item === this.$route.query.type) + 1
      fetchDataDocumentList(this.$route.params.id, index).then(res => {
        if (res.code === 0) {
          if (res.data.length > 0) {
            this.menuList = res.data.filter(item => item.type === 0)
            this.content = this.menuList[0].content
            this.modifiedTime = this.menuList[0].modifiedTime
            this.fileList = res.data.filter(item => item.type === 1)
          } else {
            this.menuList = []
            this.content = ''
            this.modifiedTime = ''
            this.fileList = []
          }
        }
      })
    },
    handleItem (row, index) {
      this.active = index
      this.content = row.content
      this.modifiedTime = row.modifiedTime
    },
    getDataDetail () {
      fetchAssDataById(this.$route.params.id, this.$route.query.type).then(res => {
        if (res.code === 0) {
          Object.keys(this.dataInfo).forEach(item => {
            this.dataInfo[item] = res.data[item]
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.productDoc{
  background: #fff;
  min-height: calc(100vh - 223px);
  .product-v6-banner{
    height: 0;
    .product-banner-pc-wrapper{
      position: absolute;
      top: 80px;
      right: 0;
      bottom: 0;
      left: 0;
      height: 60px;
      overflow: hidden;
    }
    .product-banner-pc-bg{
      background-color: #152247;
      background-position: center;
      background-repeat: no-repeat;
      height: 120px;
      transform: translate(0px, -60px) scale(1);
      transform-origin: center bottom;
      background-size: cover;
      transition: all 0.5s ease 0s;
      position: relative;
      transform: translate(0px, -59.7059px) scale(1);
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
  .application-register-main{
    width: $mainWidth;
    margin: 140px auto 0;
    display: flex;
    justify-content: space-between;
    padding-top: 25px;
    .download a{
      display: block;
      font-size: 15px;
      color: #252B30;
      margin-bottom: 20px;
      position: relative;
      padding-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &::before{
        content: "";
        display: block;
        width: 4px;
        height: 1px;
        background: #606266;
        position: absolute;
        left: 0;
        top: 50%;
        -webkit-transition: ease 0.65s;
        transition: ease 0.65s;
      }
      &:hover{
        transition: .5s;
        color: $active;
        padding-left: 15px;
        &::before{
          transition: .5s;
          width: 9px;
          background:$active
        }
      }
    }
    .doc-left{
      width: 286px;
      margin-right: 15px;
      .doc-left-item,.doc-left-main{
        background: #F6F8FF;
        margin-bottom: 10px;
        .title{
          height: 60px;
          line-height: 60px;
          font-weight: 600;
          border-bottom: 1px solid #E4E6F3;
          margin-bottom: 32px;
        }
      }
      .doc-left-item{
        padding: 0 20px 20px;
        .title{
          font-size: 16px;
          color: #252B30;
          position: relative;
          padding-left: 10px;
          span{
            display: inline-block;
            width: 3px;
            height: 16px;
            background: $active;
            position: absolute;
            top: 22px;
            left: 0;
          }
        }
        .duty-unit li{
          font-size: 15px;
          color: #252B30;
          margin-bottom: 20px;
        }
        
      }
      .doc-left-main{
        padding: 0 30px 40px;
        .title{
          font-size: 18px;
          color: $active;
        }
        li{
          margin-bottom: 20px;
          font-size: 15px;
          color: #252B30;
          cursor: pointer;
        }
        .active{
          color: $active
        }
      }
    }
    .doc-right{
      width: calc(100% - 286px);
      padding-left: 35px;
      .breadcrumb{
        font-size: 14px;
        color: #8A8E99;
        margin-bottom: 45px;
        padding-left: 35px;
        span{
          font-size: 16px;
          color: #575D6C;
        }
      }
      .date{
        // width: 1005px;
        height: 70px;
        // background: #F5F7FA;
        padding: 0 35px 0 55px;
        line-height: 70px;
        font-size: 16px;
        color: #8A8E99;
        border-radius: 2px;
        margin-bottom: 40px;
        background:#F5F7FA url('../../assets/img/news-detail-date.svg') no-repeat 35px center;
      }
      .doc-right-context{
        padding-left: 35px;
        // border-bottom: 1px solid #C0C4CC;
        padding-bottom: 33px;
        p{
          font-size: 18px;
          color: #252B30;
          line-height:37px;
        }
        
      }
      .doc-right-file{
        margin-top: 30px;
        margin-bottom: 65px;
        .doc-right-file-title{
          font-size: 20px;
          color: #252B30;
          font-weight: 600;
          margin-bottom: 24px;
        }
      }
    }
  }
}
</style>