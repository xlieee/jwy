<template>
  <div class="doc-list">
    <div class="sideLeft">
      <ul>
        <li v-for="(item,index) in docs" 
          :key="index" 
          :class="activeIndex==index?'active':''"
          @click="handleClick(item,index)"
          >{{item.name}}</li>
      </ul>
    </div>
    <div class="sideRight">
      <Spin fix size="large" v-if="spinShow" style="margin-top:50px"></Spin>
      <div v-if="!spinShow&&dataList.length>0" style="margin:20px 32px 33px 0;overflow:hidden">
        <ul class="datas">
          <li v-for="(item,index) in dataList" :key="index" @click="handleItem(item)">
            <p class="context">
              {{item.title}}
              <span v-if="tabType==2">浏览量：{{item.readingNum}}次</span>
              <span v-else class="doc-download">{{item.readingNum}}次</span>
            </p>
            <p class="line"></p>
          </li>
        </ul>
        <Page 
          :total="page.pageTotal" 
          :page-size="page.size" 
          :current="page.current"
          @on-change="onChangePage"
          class-name='pagination' 
          style="margin-top:30px"/>
      </div>
      <NoContent v-if="!spinShow&&dataList.length==0"/>
    </div>
  </div>
</template>
<script>
import { fetchProblemData, fetchDocumentData } from '../../api/news'
import NoContent from './no-content'
export default {
  components: {
    NoContent
  },
  props: {
    docs: {
      type   : Array,
      default: () => []
    },
    tabType: {
      type   : Number,
      default: () => 1
    }
  },
  mounted () {
    this.page.classification = this.docs[0].id
    if (this.tabType == 2) {
      this.fetchProblemList()
    } else {
      this.fetchDocumentList()
    }
  },
  watch: {
    tabType (newVal) {
      this.activeIndex = 0
      setTimeout(() => {
        this.page.classification = this.docs[0].id
        if (newVal == 2) {
          this.fetchProblemList()
        } else {
          this.fetchDocumentList()
        }
      }, 1000)
    },
    '$route.name' (newVal) {
      if (newVal == 'document') {
        this.activeIndex = 0
        setTimeout(() => {
          this.page.classification = this.docs[0].id
          if (this.tabType == 2) {
            this.fetchProblemList()
          } else {
            this.fetchDocumentList()
          }
        }, 1000)
      }
    }
  },
  data () {
    return {
      activeIndex: 0,
      page       : {
        size          : 10,
        current       : 1,
        state         : 1,
        classification: ''
      },
      dataList: [],
      spinShow: false
    }
  },
  methods: {
    handleClick (item, index) {
      this.page.classification = item.id
      this.activeIndex = index
      if (this.tabType == 2) {
        this.fetchProblemList()
      } else {
        this.fetchDocumentList()
      }
    },
    //点击单条数据
    handleItem (row) {
      const { tabType } = this
      if (tabType == 2) {
        //常见问题则跳转至详情页面
        this.$router.push({ path: '/newsDetail/' + row.id, query: { list: ['产品文档', '常见问题', row.title], type: 'problem'  } })
      } else {
        //规范文档直接下载
        window.location.href = this.$baseUrl + '/fileStore/download/' + row.fileIds + '?BusinessId=' + row.id
        this.fetchDocumentList()
      }
    },
    //获取右侧列表
    fetchProblemList () {
      this.spinShow = true
      fetchProblemData(this.page).then(res => {
        this.spinShow = false
        if (res.code === 0) {
          this.dataList = res.data.records
          this.page.pageTotal = res.data.total
        } else {
          this.dataList = []
          this.page.pageTotal = 0
        }
      })
    },
    fetchDocumentList () {
      this.spinShow = true
      fetchDocumentData(this.page).then(res => {
        this.spinShow = false
        if (res.code === 0) {
          this.dataList = res.data.records
          this.page.pageTotal = res.data.total
        } else {
          this.dataList = []
          this.page.pageTotal = 0
        }
      })
    },
    // page
    onChangePage (pageNum) {
      this.page.current = pageNum
      if (this.tabType == 2) {
        this.fetchProblemList()
      } else {
        this.fetchDocumentList()
      }
    }
  }
}
</script>
<style lang="scss">
.doc-list{
  overflow: hidden;
  background: #fff;
  margin: 30px 0 60px;
  min-height: calc(100vh - 600px);
  .sideLeft{
    background: #F7F9FB;
    margin: 19px 32px 19px 19px; 
    float: left;
    width: 222px;
    padding: 20px 0 0 25px;
    li{
      margin-bottom: 38px;
      font-size:16px;
      font-weight:500;
      color:#303133;
      line-height:22px;
      cursor: pointer;
      &:hover{
        color: $active
      }
    };
    .active{
      color:$active
    }
  };
  .sideRight{
    float: left;
    width: calc(100% - 273px);
    // padding: 20px 32px 33px 0;
    position: relative;
    .datas{
      li{
        cursor: pointer;
        border-bottom: 1px dashed #C0C4CC;
        &:hover{
          // border-bottom: 1px dashed $active;
          border: 0;
          // box-shadow: 0px 1px 6px 0px rgba(246, 111, 106, 0.3);
          .context{
            color: $active
          }
          .line{
            width: 100%;
            transition: width ease-in-out 1s;
            border-bottom: 1px dashed $active
          }
        }
        
      }
      .context{
        display: block;
        overflow: hidden;
        height: 58px;
        line-height: 58px;
        font-size: 16px;
        color: #303133;
        .doc-download{
          display: inline-block;
          background: url('../../assets/img/doc-download.svg') no-repeat 0 center;
          padding-left: 20px;
        }
        span{
          font-size: 14px;
          float: right;
          color: #909399;
        }
      }
      .line{
        width: 0;
        height: 1px;

      }
    }
    
  }
}
</style>