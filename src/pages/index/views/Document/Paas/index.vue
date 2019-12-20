<template>
  <div class="doc-paas">
    <DocProductTabs :tabs='tabs' type='paas' @on-click='changeTabs'></DocProductTabs>
    <div class="dataList" v-if="tableList.length>0">
      <SideList :sideDataList='tableList' :descLength='40' type='paas' origin='doc'></SideList>
      <Page :total="total" :page-size="page.size" class-name='pagination' @on-change="changepage"/>
    </div>
    <NoContent v-else/>
  </div>
</template>
<script>
import DocProductTabs from '../doc-product-tabs'
import SideList from '_index/components/side-list'
import { fetchSubclass, fetchAssData } from '_index/api/index.js'
import NoContent from '../no-content'
export default {
  components: {
    DocProductTabs,
    SideList,
    NoContent
  },
  data () {
    return {
      tabs     : [],
      tableList: [],
      page     : {
        current : 1,
        size    : 10,
        subclass: '',
        name    : ''
      },
      total: 0
    }
  },
  mounted () {
    this.getSubclass()
    this.getData()
  },
  methods: {
    //获取所属分类
    getSubclass () {
      fetchSubclass('Paas').then(res => {
        if (res.code === 0) {
          this.tabs = res.data.map(item => {
            return {
              value: item.id,
              label: item.title
            }
          })
          this.getData()
        } else {
          this.daasSide = []
        }
      })
    },
    //获取paaS列表
    getData () {
      fetchAssData(this.page, 'paas').then(res => {
        if (res.code === 0) {
          this.tableList = res.data.records.map(item => {
            return {
              id         : item.id,
              title      : item.shortName,
              image      : item.imageUrl,
              description: item.description
            }
          })
          this.total = res.data.total
        } else {
          this.tableList = []
        }
      })
    },
    changeTabs (value) {
      this.page.subclass = value
      this.getData()
    },
    changepage (index) {
      this.page.current = index
      this.getData()
    }
  }
}
</script>
<style lang="scss">
.dataList{
  // overflow: hidden;
  margin-top: 10px;
  margin-bottom: 110px;
  .home-side-list{
    width: 100%;
    ul{
      display: flex;
      flex-wrap: wrap;
      li{
        // width: calc((100% - 40px) / 3);
        width: 32.5%;
        height: 140px;
        padding: 24px 18px;
        margin-bottom: 20px;
        margin-right: 1.25%;
        // float: left;
        // display: inline-block;
        transition: all .3s ease;
        // margin-right: 20px;
        background: #fff;
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