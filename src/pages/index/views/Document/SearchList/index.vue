<template>
  <div class="searchList">
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
          <Input v-model="page.name" search enter-button="搜索" placeholder="请输入关键词搜索产品文档" style="width:885px;height:55px;padding:81px 0 0" @on-search='handleSearch'/>
        </div>
      </div>
    </div>
    <div class="content-banner">
      <div class="main">
        <!--搜索一级tab -->
        <ul class="service-search">
          <li v-for="(item,index) in searchTabList" :key="index" :class="tabSearchActive==index?'active':''" @click="handleSearchIndex(index,item.name)">
            {{item.name}} ( {{item.count}} )
          </li>
        </ul>
        
      </div>
    </div>
    <div class="searchList-content">
      <p class="tip">已找到
        <em v-if="tabName">{{tabName}}中</em>
        <span>“{{searchText}}”</span>
        的记录 {{changeTabs()}} 条</p>
      <!-- 搜索无数据 -->
      <NoContent :name='page.name' v-if="changeTabs()==0"/>
      <!-- <div class="searchList-no-text" v-if="changeTabs()==0">
        <img src="~_index/assets/img/no-content.svg" alt="">
        <p>未查询到<span>“{{page.name}}”</span>相关的数据</p>
      </div> -->
      <!-- 查询列表 -->
      <div class="searchList-list" v-else>
        <div v-if="tabName=='全部'||tabName=='规范文档'">
          <div class="item" v-for="item in docList" :key="item.id" @click="handleDoc(item)">
            <p v-html="returnSearchString(item.title)" class="title"></p>
            <p class="com text">来自：{{item.com}}</p>
          </div>
        </div>
        <div v-if="tabName=='全部'||tabName=='常见问题'">
          <div class="item" v-for="(item,index) in problemList" :key="index" @click="handleProblem(item)">
            <p v-html="returnSearchString(item.title)" class="title"></p>
            <p v-html="returnSearchString(item.text)" class="text"></p>
            <p class="com text">来自：{{item.com}}</p>
          </div>
        </div>
        <div v-if="tabName=='全部'||tabName=='产品文档'">
          <div class="item" v-for="(item,index) in proList" :key="index" @click="handleProblem(item)">
            <p v-html="returnSearchString(item.title)" class="title"></p>
            <p v-html="returnSearchString(item.text)" class="text"></p>
            <p class="com text">来自：{{item.com}}</p>
          </div>
        </div>
        <!-- <Page :total="changeTabs()" :page-size="page.size" class-name='pagination' style="margin:30px 30px 70px 0"/> -->
      </div>
    </div>
  </div>
</template>
<script>
import { 
  fetchProblemData,
  fetchDocumentData
} from '_admin/api/website'
import {
  fetchListAllByName
} from '_index/api/website'
import NoContent from '../no-content'
export default {
  components: {
    NoContent
  },
  data () {
    return {
      page: {
        size          : 100000,
        current       : 1,
        name          : '',
        state         : 1,
        classification: ''
      },
      searchList   : [],
      searchText   : '',
      searchTabList: [
        { name: '全部', count: 0 },
        { name: '产品文档', count: 0 },
        { name: '规范文档', count: 0 },
        { name: '常见问题', count: 0 }
      ],
      tabSearchActive: 0,
      tabName        : '全部',
      problemList    : [],
      docList        : [],
      proList        : [],
      total          : 0,
      types          : ['cloudApp', 'saas', 'daas', 'paas', 'iaas']
    }
  },
  created () {
    this.page.name = this.$route.query.text
    this.searchText = this.$route.query.text
    if (this.page.name) {
      this.getDoc()
      this.getProblem()
      this.getProduct()
    }
  },
  watch: {
    '$route' (newVal) {
      this.tabName = '全部'
      this.tabSearchActive = 0
      this.page.name = newVal.query.text
      this.searchText = newVal.query.text
    }
  },
  methods: {
    handleSearch (value) {
      if (value) {
        this.page.name = value
        this.searchText = value
        this.searchList = []
        this.getDoc()
        this.getProblem()
        this.getProduct()
      }
    },
    //使查询字符串变色
    returnSearchString (str) {
      let string = str
      if (!string) {
        return ''
      }
      if (this.page.name && this.page.name.length > 0) {
        // 匹配关键字正则
        let replaceReg = new RegExp(this.page.name, 'g')
        // 高亮替换v-html值
        let replaceString = '<em style="color:#F66F6A">' + this.page.name + '</em>'
        // 开始替换
        string = string.replace(replaceReg, replaceString)
      }
      return string
    },
    handleSearchIndex (index, name) {
      this.tabSearchActive = index
      this.page.current = 1
      this.tabName = name
    },
    getProblem () {
      fetchProblemData(this.page).then(res => {
        if (res.code === 0) {
          this.problemList = res.data.records.map((item) => {
            return {
              id   : item.id,
              title: item.title,
              text : item.content,
              com  : '产品文档 >  常见问题 >  ' + item.title
            }
          })
          this.searchTabList[3].count = this.problemList.length
          this.searchList.push(...this.problemList)
          this.searchTabList[0].count = this.searchList.length
          this.total = res.data.total
        } else {
          this.table.data = []
          this.total = 0
        }
      })
    },
    getDoc () {
      fetchDocumentData(this.page).then(res => {
        this.docList = res.data.records.map((item) => {
          return {
            id   : item.id,
            title: item.title,
            text : item.content,
            com  : '产品文档 >  规范文档 >  ' + item.title
          }
        })
        this.searchTabList[2].count = this.docList.length
        this.searchList.push(...this.docList)
        this.searchTabList[0].count = this.searchList.length
        this.total = res.data.total
      })
    },
    getProduct () {
      fetchListAllByName(this.page).then(res => {
        if (res.code === 0) {
          this.proList = res.data.records.map((item) => {
            return {
              id   : item.id,
              title: item.name,
              text : item.content,
              com  : `产品文档 >  ${this.types[item.sourceType].toUpperCase()}产品文档 >  ` + item.name
            }
          })
          this.searchTabList[1].count = this.proList.length
          this.searchList.push(...this.proList)
          this.searchTabList[0].count = this.searchList.length
          this.total = res.data.total
        }
      })
    },
    changeTabs () {
      switch (this.tabName) {
      case '全部':
        return this.searchList.length
      case '产品文档':
        return this.proList.length
      case '规范文档':
        return this.docList.length
      case '常见问题':
        return this.problemList.length
      }
    },
    handleDoc (row) {
      window.location.href = this.$baseUrl + ':8006/document/downloadFiles/' + row.id
    },
    handleProblem (row) {
      this.$router.push({ path: '/newsDetail/' + row.id, query: { list: ['产品文档', '常见问题', row.title], type: 'problem'  } })
    }
  }
}
</script>
<style lang="scss">
.searchList{
  background: #F1F3FE;
  .product-v6-banner{
    height: 217px;
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
      height: 280px;
      transform: translate(0px, -60px) scale(1);
      transform-origin: center bottom;
      background-size: cover;
      transition: all 0.5s ease 0s;
      position: relative;
      background-image: url('../../../assets/img/document-bg.png');
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
    height: 220px;
    overflow: hidden;
    padding-top: 0;
  }
  .content-banner{
    background: #0B2444;
    .main{
      width: $mainWidth;
      margin: 0 auto;
      .service{
        overflow: hidden;
        li{
          width: calc(100% / 3);
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
            left: 35%;
          }
          
        }
        .active{
          color: $active;
          background: #041933;
          
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
  .head{
    height: 217px;
    // background: url('../../assets/img/document-bg.png') no-repeat center center;
    background-size: cover;
    text-align: center;
    .head-main{
      width: $mainWidth;
      margin: 0 auto;
    }
    input{
      height: 55px;
      // line-height: 55px;
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
  .searchList-content{
    width: $mainWidth;
    margin: 0 auto;
  }
  .tip{
    font-size: 16px;
    color: #8A8E99;
    margin: 30px 0;
    span{
      color: $active
    }
  }
  .searchList-list{
    background: #fff;
    overflow: hidden;
    min-height: 448px;
    .item{
      padding: 30px 30px 0;
      cursor: pointer;
      &:hover{
        
        box-shadow:0px 1px 6px 0px rgba(246,111,106,0.3);
        .title{
          color: $active
        }
        .com{
          border-bottom: 0;
        }
      }
      .title{
        font-size: 18px;
        color: #1A0DAB;
        font-weight: 600;
        margin-bottom: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .text{
        font-size: 14px;
        color: #575D6C;
        padding-bottom: 24px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .com{
        border-bottom: 1px dashed #C0C4CC;
      }
    }
  }
  
}
</style>