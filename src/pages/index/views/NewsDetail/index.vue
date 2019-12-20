<template>
  <div class="news-detail">
    <div class="product-v6-banner">
      <div class="product-banner-pc-wrapper">
        <div class="product-banner-pc-bg">
          <div class="product-banner-pc-bg-inner" style="background-image: url(../../assets/img/application-bg.png)"></div>
        </div>
      </div>
    </div>
    <div class="news-main">
      <Breadcrumb separator=">" class="separator">
        <BreadcrumbItem v-for="(item,index) in list" :key="index">{{item}}</BreadcrumbItem>
      </Breadcrumb>
      <div class="news-content">
        <div class="head">
          <p class="title">{{form.title}}</p>
          <p @click="back()" class="back">返回列表</p>
        </div>
        <div class="info">
          <span class="date">发布时间：{{form.createTime||form.modifiedTime}}</span>
          <span class="count">浏览量：{{form.readingNum}}</span>
        </div>
        <div class="news-text" v-html="form.content">
        </div>
        <div class="news-accessory" v-if="form.files&&form.files.length>0">
          <h2>附件·2</h2>
          <ul>
            <li v-for="(item,index) in form.files" :key="index">
              <a :href="item.url">{{item.originName}}</a>
            </li>
          </ul>
        </div>
        <div class="news-detail-footer">
          <p @click="handleLink(form,'front')" v-show="form.front!=null"><span>【上一篇】{{form.front?form.front.title:''}}</span></p>
          <p @click="handleLink(form,'next')" v-show="form.next!=null">【下一篇】{{form.next?form.next.title:''}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { 
  fetchDataDetailById
} from '../../api/news'
export default {
  data () {
    return {
      accessoryList: [
        { url: '/', text: '全国扫黑办发布严惩公职人员涉黑涉恶、办理非法放贷刑.PDF' },
        { url: '/', text: '全国扫黑办发布严惩公职人员涉黑涉恶、办理非法放贷刑.PDF' }
      ],
      form: {},
      list: ['新闻资讯', '详情'],
      type: ''
    }
  },
  mounted () {
    
    this.list = this.$route.query.list || ['新闻资讯', '详情']
    this.type = this.$route.query.type || ''
    this.getNewsDetail(this.$route.params.id, this.type)
  },
  watch: {
    '$route.query.type' (newVal) {
      this.list = this.$route.query.list || ['新闻资讯', '详情']
      this.getNewsDetail(this.$route.params.id, newVal)
    }
  },
  methods: {
    back () {
      history.back()
    },
    getNewsDetail (id, type) {
      //获取详情
      if (id && type) {
        fetchDataDetailById(id, type).then(res => {
          if (res.code === 0) {
            this.form = res.data
          } else {
            this.form = {}
          }
        })
      }
    },
    handleLink (row, type) {
      if (row[type].link) {
        window.location.href = row[type].url
      } else {
        this.getNewsDetail(row[type].id, this.type)
      }
    }
  }
}
</script>
<style lang="scss">
.news-detail{
  background: #F1F3FE;
  padding-bottom: 67px;
  margin-top: 140px;
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
  .news-main{
    width: $mainWidth;
    margin: 0 auto;
    .separator{
      padding: 23px 0;
      .ivu-breadcrumb-item-separator{
        color: #8A8E99
      }
    }
    .news-content{
      background: #fff;
      overflow: hidden;
      padding: 32px 32px 0;
      .head{
        display: flex;
        justify-content: space-between;
        .title{
          width: 1046px;
          font-size: 28px;
          color: #252B30;
          line-height:40px;
          font-weight: 600;
        }
        .back{
          width: 108px;
          height: 44px;
          background-color: $active;
          color: #fff;
          line-height: 44px;
          font-size: 16px;
          padding-left: 32px;
          cursor: pointer;
          border-radius: 2px;
          background-image: url('../../assets/img/news-back.svg');
          background-repeat: no-repeat;
          background-position-x: 10px;
          background-position-y:17px;
          &:hover{
            box-shadow: 0 8px 6px -4px rgba(246, 111, 106, 0.5)
          }
        }
      }
      .info{
        height: 70px;
        background: #F5F7FA;
        border-radius:2px;
        margin: 24px 0 36px;
        line-height: 70px;
        padding: 0 35px;
        span{
          margin-right: 50px;
          font-size:16px;
          color:#8A8E99;
          padding-left: 23px;
        }
        .date{
          background: url('../../assets/img/news-detail-date.svg') no-repeat left center;
        }
        .count{
          background: url('../../assets/img/news-detail-count.svg') no-repeat left center;
        }
      }
      .news-text{
        font-size:18px;
        color:#252B30;
        line-height:37px;
        text-indent: 2em;
        padding-bottom: 40px;
        border-bottom: 1px dashed #C0C4CC;
      }
      .news-accessory{
        overflow: hidden;
        padding-bottom: 17px;
        border-bottom: 2px solid #DCDFE6;
        h2{
          font-size: 20px;
          color: #252B30;
          font-weight: 600;
          margin: 30px 0 24px;
        }
        li{
          &:hover{
            a{
                padding-left: 15px;
                color: $active;
                &::before{
                  width: 9px;
                  background:$active
                }
              }
          }
        }
        a{
          margin-bottom: 20px;
          font-size: 16px;
          color: #252B30;
          padding-left: 10px;
          transition: ease 0.65s;
          position: relative;
          display: block;
          &::before{
            content: "";
            display: block;
            width: 4px;
            height: 1px;
            background: #252B30;
            position: absolute;
            left: 0;
            top: 50%;
            transition: ease 0.65s;
          }
        }
      }
      .news-detail-footer{
        height: 102px;
        line-height: 102px;
        
        // display: flex;
        // justify-content: space-between;
        font-size: 16px;
        color: #252B30;
        overflow: hidden;
        p{
          width: 400px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
          cursor: pointer;
          &:first-of-type{
            float: left;
            padding-left: 20px;
            background: url('../../assets/img/news-detail-prev.svg') no-repeat left center;
          }
          &:last-of-type{
            float: right;
            text-align: right;
            padding-right: 20px;
            background: url('../../assets/img/news-detail-next.svg') no-repeat right center;
          }
          &:hover{
            transition: .5s;
            color: $active;
            &:first-of-type{
              padding-left: 20px;
              background: url('../../assets/img/news-detail-prev-active.svg') no-repeat left center;
            }
            &:last-of-type{
              padding-right: 20px;
              background: url('../../assets/img/news-detail-next-active.svg') no-repeat right center;
            }
          }
        }
      }
    }
  }
}
</style>