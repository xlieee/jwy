<template>
  <div class="newsList">
    <div class="product-v6-banner">
      <div class="product-banner-pc-wrapper">
        <div class="product-banner-pc-bg">
          <div class="product-banner-pc-bg-inner" style="background-image: url(../../assets/img/news-list-bg.png)"></div>
        </div>
      </div>
    </div>
    <div class="banner-position">
      <div class="newsList-banner">
        <div class="context">
          <h2>新闻资讯</h2>
        </div>
      
      </div>
    </div>
    <div class="newsList-main">
      <div class="item" v-for="(item,index) in newsList" :key="index" @click="handleClick(item)">
        <p class="title"><span class="stick" v-if="item.isTop"></span>{{item.title}}</p>
        <p class="text">{{item.briefIntroduction}}</p>
        <p class="news-footer">
          <span class="date">{{item.createTime}}</span>
          <span class="count">{{item.readingNum}}</span>
        </p>
      </div>
      <div class="page-model">
        <Page
          :total="total"
          show-total
          :page-size="page.size"
          @on-change="pageChange"
        ></Page>
      </div>
    </div>
    
  </div>
</template>
<script>
import { 
  fetchNewsList
} from '../../api/news'
export default {
  data () {
    return {
      newsList: [],
      page    : {
        current: 1,
        size   : 10
      },
      total: 0
    }
  },
  mounted () {
    this.getNewsList()
  },
  methods: {
    handleClick (row) {
      if (row.link === 1) {
        window.open(row.url)
      } else {
        this.$router.push({ path: '/newsDetail/' + row.id, query: { list: ['新闻资讯', '详情'], type: 'news' } })
      }
    },
    getNewsList () {
      fetchNewsList(this.page).then(res => {
        if (res.code === 0) {
          this.newsList = res.data.records
          this.total = res.data.total
        } else {
          this.newsList = []
        }
      })
    },
    pageChange (page) {
      this.page.current = page
      this.getNewsList()
    }
  }
}
</script>
<style lang="scss">

.newsList{
  background: #F1F3FE;
  width: 100%;
  min-height: calc(100vh - 223px);
  overflow: hidden;
  .product-v6-banner{
    height: 314px;
    .product-banner-pc-wrapper{
      position: absolute;
      top: 80px;
      right: 0;
      bottom: 0;
      left: 0;
      height: 293px;
      overflow: hidden;
    }
    .product-banner-pc-bg{
      background-color: #152247;
      background-position: center;
      background-repeat: no-repeat;
      height: 293px;
      transform: translate(0px, -60px) scale(1);
      transform-origin: center bottom;
      background-size: cover;
      transition: all 0.5s ease 0s;
      position: relative;
      background-image: url('../../assets/img/news-list-bg.png');
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
  .banner-position{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 172px;
    padding-top: 140px;
  }
  .newsList-banner{
    width: $mainWidth;
    margin: 0 auto;
    h2{
      font-size:36px;
      font-weight:400;
      color:#fff;
      line-height:172px;
    }
  }
  .newsList-main{
    width: $mainWidth;
    min-height: 300px;
    margin: 32px auto 156px;
    background: #fff;
    overflow: hidden;
    .item{
      padding: 31px 31px 0;
      cursor: pointer;
      &:hover{
        box-shadow:0px 1px 6px 0px rgba(246,111,106,0.3);
        .title{
          color: $active
        }
        .news-footer{
          border: 0;
        }
        
      }
      .title{
        font-size: 18px;
        color: #252B30;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .stick{
          width: 30px;
          height: 18px;
          margin-right: 8px;
          float: left;
          margin-top: 4px;
          background: url('../../assets/img/stick.svg') no-repeat center center;
        }
      }
      .text{
        font-size: 14px;
        color: #575D6C;
        margin: 20px 0 24px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        cursor: pointer;
      }
      .news-footer{
        border-bottom: 1px dashed #C0C4CC; 
        padding-bottom: 24px;
        span{
          font-size: 14px;
          color: #8A8E99;
          margin-right: 50px;
          position: relative;
          padding-left: 25px;
          &::before{
            content: '';
            display: inline-block;
            width: 18px;
            height: 18px;
            background-size: contain;
            position: absolute;
            top: 1px;
            left: 0;
          }
        }

        .date::before{
          background: url('../../assets/img/news-list-date.svg') no-repeat center center;
        }
        .count::before{
          background: url('../../assets/img/news-list-count.svg') no-repeat center center;
        }
      }
      .line{
        width: 100%;
        height: 1px;
        border-bottom: 1px dashed red;
      }
    }
  }
}
.page-model{
  float: right;
  margin: 20px 31px;
}
</style>