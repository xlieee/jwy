<template>
  <div class="indexMore">
    <div class="product-v6-banner">
      <div class="product-banner-pc-wrapper">
        <div v-if="$route.params.type" class="product-banner-pc-bg" :style="`background-image:url(${require(`../../assets/img/indexDetail_${$route.params.type}.png`)})`">
          <div class="product-banner-pc-bg-inner" style="background-image: url(../../assets/img/document-bg.png)"></div>
        </div>
      </div>
    </div>
    <div class="banner-position">
      <div class="application-banner">
        <div class="context">
          <h2>{{yun.title}}</h2>
          <p :title='yun.desc'>{{yun.remark.length>160?yun.remark.slice(0,160)+"...":yun.remark}}</p>
          <div class="star">
            <img src="../../assets/img/star_0.png" alt="" class="star0">
            <img src="../../assets/img/star_1.png" alt="" class="star1">
            <img src="../../assets/img/star_2.png" alt="" class="star2">
            <img src="../../assets/img/star_3.png" alt="" class="star3">
            <img src="../../assets/img/star_4.png" alt="" class="star4">
          </div>
        </div>
      
      </div>
    </div>
    <div class="content-banner" :style="`top:${$route.params.type=='iaas'?'16px':'-45px'}`">
      <div class="search-content" v-if="$route.params.type!='iaas'">
        <div class="search-head">
          <span>筛选条件</span>
          <i-input v-model="page.name" search placeholder="请输入关键词进行搜索" style="width:310px;height:44px;margin-top:10px" @on-search='handleSearch'>
            <Icon type="ios-search" slot="suffix" color='red'/>
          </i-input>
        </div>
        <div class="search-type">
          <span>类别：</span>
          <ul>
            <li :class="activeType==index?'active':''" v-for="(item,index) in typeList" :key="index" @click="handleClick(item,index)">{{item.title}}</li>
          </ul>
        </div>
      </div>
      <SideList :sideDataList='dataList' :descLength='40' :type='type'></SideList>
      <Page :total="page.total" :page-size="page.size" class-name='pagination' @on-change="changepage"/>
    </div>
  </div>
</template>
<script>
import SideList from '_index/components/side-list'
import { fetchAssData, fetchDataInstroduction } from '_index/api/index.js'
export default {
  components: {
    SideList
  },
  data () {
    return {
      yun: {
        id    : '',
        title : '',
        remark: ''
      },
      typeList  : [],
      activeType: 0,
      dataList  : [
        {
          id         : '0001',
          url        : '',
          title      : '涉毒人员基本信息查询',
          description: '是一项基于高可用分布式集群技术的消息中间件服务，提供了是一项基于高可用分布式集群技术的消息中间件服务，提供了是一项基于高可用分布式集群技术的消息中间件服务，提供了'
        }, {
          id         : '0002',
          url        : '',
          title      : '姓名分析',
          description: '是一项基于高可用分布式集群技术的消息中间件服务，提供了是一项基于高可用分布式集群技术的消息中间件服务，提供了'
        }, {
          id         : '0003',
          url        : '',
          title      : '拘留所人员信息查询',
          description: '是一项基于高可用分布式集群技术的消息中间件服务，提供了...'
        }, {
          id         : '0004',
          url        : '',
          title      : '卡口过车数据查询',
          description: '是一项基于高可用分布式集群技术的消息中间件服务，提供了...'
        }, {
          id         : '0005',
          url        : '',
          title      : '机动车驾驶证信息查询',
          description: '是一项基于高可用分布式集群技术的消息中间件服务，提供了...'
        }, {
          id         : '0006',
          url        : '',
          title      : '对象管控比对订阅',
          description: '是一项基于高可用分布式集群技术的消息中间件服务，提供了...'
        }, {
          id         : '0007',
          url        : '',
          title      : '宽带账号备案信息查询',
          description: '是一项基于高可用分布式集群技术的消息中间件服务，提供了...'
        }, {
          id         : '0008',
          url        : '',
          title      : '大数据比对模型',
          description: '是一项基于高可用分布式集群技术的消息中间件服务，提供了...'
        }, {
          id         : '0009',
          url        : '',
          title      : '警综案件文书查询',
          description: '是一项基于高可用分布式集群技术的消息中间件服务，提供了...'
        }
      ],
      type: 'cloudApp',
      page: {
        current : 1,
        size    : 9,
        subclass: '',
        name    : ''
      }
      // pic_daas,
      
    }
  },
  mounted () {
    this.type = this.$route.params.type || 'cloudApp'
    this.typeList = this.$route.query.sideList ? JSON.parse(this.$route.query.sideList) : []
    this.page.subclass = this.typeList[0] ? this.typeList[0].id : ''
    this.getDataList()
    this.getInstroduction()
  },
  watch: {
    '$route.name' (newVal) {
      if (newVal == 'indexMore') {
        this.type = this.$route.params.type || 'cloudApp'
        this.typeList = this.$route.query.sideList ? JSON.parse(this.$route.query.sideList) : []
        this.page.subclass = this.typeList[0].id
        this.activeType = 0
        this.getDataList()
        this.getInstroduction()
      }
    }
  },
  methods: {
    handleSearch (val) {
      this.getDataList()
      console.log(val)
    },
    handleClick (row, index) {
      this.activeType = index
      this.page.subclass = row.id
      this.getDataList()
    },
    //获取SaaS列表
    getDataList () {
      fetchAssData(this.page, this.type).then(res => {
        if (res.code === 0) {
          this.dataList = res.data.records.map(item => {
            return {
              id         : item.id,
              title      : item.shortName,
              description: item.description,
              url        : item.systemUrl,
              image      : item.imageUrl
            }
          })
          this.page.total = res.data.total
        } else {
          this.saasDataList = []
        }
      })
    },
    changepage (index) {
      this.page.current = index
      this.getDataList()
    },
    getInstroduction () {
      let data = ''
      if (this.type == 'yun') {
        data = 'cloudAppIntroduction'
      } else {
        data = this.type + 'Introduction'
      }
      fetchDataInstroduction(data).then(res => {
        console.log(res, '900')
        if (res.code == 0) {
          Object.keys(this.yun).forEach(field => {
            this.yun[field] = res.data[field]
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.indexMore{
  background: #F1F3FE;
  .product-v6-banner{
    height: 472px;
    .product-banner-pc-wrapper{
      position: absolute;
      top: 80px;
      right: 0;
      bottom: 0;
      left: 0;
      height: 392px;
      overflow: hidden;
    }
    .product-banner-pc-bg{
      background-color: #152247;
      background-position: center;
      background-repeat: no-repeat;
      height: 392px;
      transform: translate(0px, -60px) scale(1);
      transform-origin: center bottom;
      background-size: cover;
      transition: all 0.5s ease 0s;
      position: relative;
      background-image: url('../../assets/img/indexDetail_cloudApp.png');
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
      height: 332px;
      overflow: hidden;
      padding-top: 0;
  }
  .application-banner{
    width: 100%;
    height: 332px;
    background-size: cover;
    
    .context{
      margin: 0 auto;
      width: $mainWidth;
      padding-top: 67px;
      color: #fff;
      font-weight:500;
      position: relative;
      h2{
        color: #fff;
        font-size:40px;
        line-height:56px;
        font-weight: 400;
      }
      p{
        margin-top: 14px;
        line-height:34px;
        font-size: 16px;
        width: 880px;

      }
    }
    .star{
      overflow: hidden;
      img{
        position: absolute;
        animation: flash-data-v-661a5c8c 12s ease-out infinite;
        opacity: 0;
      }
      .star0{
        top: 115px;
        left: 730px;
        animation:lightning-data-v-661a5c8c 4s ease infinite alternate;
        opacity: 0;
        animation-delay:0s;
      }
      .star1{
        top: 50px;
        right: 0;
        animation:lightning-data-v-661a5c8c 4s ease infinite alternate;
        opacity: 0;
        animation-delay:4s;
      }
      .star2{
        top: 67px;
        left: 790px;
        animation-delay:0s;
      }
      .star3{
        bottom: 0px;
        left: 670px;
        animation-delay:4s;
      }
      .star4{
        bottom: -67px;
        right: -10px;
        animation-delay:8s
      }
    }
  }
  .content-banner{
    width: $mainWidth;
    margin: 0 auto;
    padding-bottom: 190px;
    position: relative;
    .search-content{
      background: #fff;
      border-radius: 2px;
      margin-bottom: 22px;
      .search-head{
        border-bottom: 1px solid #E4E6F3;
        box-shadow:0px 2px 20px 0px rgba(223,191,140,0.1);
        height: 61px;
        line-height: 61px;
        padding: 0 25px;
        display: flex;
        justify-content: space-between;
        span{
          font-size: 18px;
          color: #252B30;
          font-weight: 600
        }
        input{
          font-size: 14px;
        }
      }
      .search-type{
        margin: 0 25px;
        padding: 30px 0;
        overflow: hidden;
        span{
          font-size: 16px;
          color: #252B30;
          font-weight: 600;
          float: left;
          line-height: 32px;
        }
        ul{
          float: left;
          li{
            padding: 6px 26px;
            font-size: 16px;
            color: #252B30;
            cursor: pointer;
            margin-left: 10px;
            float: left;
          }
          .active{
            background:rgba(252,236,235,1);
            border-radius:2px;
            border:1px solid $active;
            color: $active;
            font-weight: 600
          }
        }
      }
    }
  }
  .home-side-list{
    width: 100%;
    ul{
      display: flex;
      // justify-content: space-between;
      flex-wrap: wrap;
      li{
        width: 32.5%;
        height: 140px;
        padding: 24px 18px;
        margin-bottom: 20px;
        // float: left;
        transition: all .3s ease;
        background: #fff;
        margin-right: 1.25%;
        &:nth-of-type(3n){
          margin-right: 0 !important
        }
        &:nth-of-type(7),&:nth-of-type(8),&:nth-of-type(9){
          margin-bottom: 0;
        }
        
        &:hover{
          // background:rgba(237,242,254,.8);
          box-shadow:0px 2px 20px 0px rgba(0,45,142,0.1);
          border-radius:2px;
          transition: .5s;
          transform: translate3d(0,-.3rem,0);
          .title{
            color: $active !important;
          }
          .desc{
            color: #3E4555;
          }
        }
      }
      a{
        overflow: hidden;
        display: inline-block;
      }
      .sub-class-bg{
        width: 80px;
        height: 80px;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        float: left;
        position: relative;
        img{
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          margin: auto;
        }
      }
      .sub-text{
        float: left;
        margin-left: 14px;
        width: calc(100% - 94px);
        .title{
          font-size: 20px;
          font-weight: 600;
          color: $baseColor2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .desc{
          font-size: 14px;
          color: $subColor2;
          margin-top: 12px;
          height: 45px;
        }
      }
    }
  }
}
</style>