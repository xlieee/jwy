<template>
  <div class="news">
    <div class="product-v6-banner">
      <div class="product-banner-pc-wrapper">
        <div class="product-banner-pc-bg">
          <div class="product-banner-pc-bg-inner" style="background-image: url(../../assets/img/background_0.png)"></div>
        </div>
      </div>
    </div>
    <div class="banner-position">
      <div class="news-left">
        <Carousel class="news-carousel" 
          v-model="activeCarousel" 
          :autoplay-speed='5000' 
          arrow='never'>
          <CarouselItem v-for="(item) of newsCarousel" :key="item.id">
            <a 
              @click="handleLink(item,'carousel','轮播图')"
              class="carousel-item" 
              target="_blank">
              <img :src="item.imageUrl" :title="item.title" alt="">
              <p class="title">{{item.title}}</p>
              <p class="description" :title="item.briefIntroduction">{{item.briefIntroduction.length>70?(item.briefIntroduction.slice(0,70)+"..."):item.briefIntroduction}}</p>
            </a>
          </CarouselItem>
        </Carousel>
        <!-- <Carousel autoplay :autoplay-speed=5000 radius-dot :height=365 v-model="activeCarousel" loop class="news-carousel">
        <CarouselItem v-for="item of newsCarousel" :key="item.id">
          <a 
              @click="handleLink(item,'carousel','轮播图')"
              class="carousel-item" 
              target="_blank">
              <p class="title">{{item.title}}</p>
              <img :src="item.imageUrl" :title="item.title" alt="">
              <p class="description" :title="item.briefIntroduction">{{item.briefIntroduction.length>70?(item.briefIntroduction.slice(0,70)+"..."):item.briefIntroduction}}</p>
            </a>
        </CarouselItem>
      </Carousel> -->
      </div>
      <div class="news-right">
        <router-link class="news-more" to="newsList">查看更多新闻资讯</router-link>
        <ul class="news-list">
          <li v-for="(item,index) of newsList" :key="index" class="news-list-item">
            <span class="date"><span>{{item.onlineTime.slice(8,11)}}</span>/{{item.onlineTime.slice(5,7)}}</span>
            <div @click="handleLink(item,'news','新闻资讯')" :title="item.title" class="text">
              <p class="news-title">{{item.title}}</p>
              <p class="news-description">{{item.briefIntroduction | splitByDescription(70)}}</p>
            </div> 
          </li>
        </ul>
        
      </div>
    </div>
  </div>
</template>
<script>
import { 
  fetchNewsList,
  fetchCarouselData
} from '../../api/news'
import $ from 'jquery'
export default {
  props: {
    bigEvents: {
      type   : Array,
      default: () => []
    }
  },
  data () {
    return {
      carouselCurIndex: 0,
      value2          : 0,
      page            : {
        current: 1,
        size   : 5
      },
      newsList      : [],
      newsCarousel  : [],
      activeCarousel: 0
    }
  },
  mounted () {
    this.getNewsList()
    this.fetchCarouselData()
  },
  methods: {
    removeTag (str) {
      if (!str) return ''
      return str.replace(/<[^>]*>/ig, '')
    },
    getNewsList () {
      fetchNewsList(this.page).then(res => {
        if (res.code === 0) {
          this.newsList = res.data.records
        } else {
          this.newsList = []
        }
      })
    },
    fetchCarouselData () {
      fetchCarouselData(this.page).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.newsCarousel = res.data.records
        } else {
          this.newsCarousel = []
        }
      })
    },
    handleLink (row, type, name) {
      if (row.link === 1) {
        window.open(row.url)
      } else {
        // console.log(row.id, type)
        this.$router.push({ path: '/newsDetail/' + row.id, query: { list: [name, '详情'], type: type } })
      }
    },
    carouselChange (oldVal, newVal) {
      if (oldVal == this.newsCarousel.length - 1) {
        $('.ivu-carousel-track').fadeToggle()
        // $('.ivu-carousel-track.higher').fadeToggle()
      }
      console.log(oldVal, newVal, $('.ivu-carousel-track.higher'))
      
    }
  }
  
}
</script>
<style>
 
</style>