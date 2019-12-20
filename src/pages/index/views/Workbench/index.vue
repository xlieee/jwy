<template>
  <div class="workbench">
    <div class="work-side">
      <div class="user-info">
        <img src="../../assets/img/user.png" alt="">
        <p>{{userInfo.realName}}</p>
      </div>
      <ul>
        <li v-for="(item,index) in workList" :key="index" :class="current==index?'work-side-active':''" @click="handleClick(index)">
          <img :src="current==index?require(`../../assets/img/work-side-active_${item.icon}.svg`):require(`../../assets/img/work-side_${item.icon}.svg`)" alt="" v-if="item.name!='通知消息'">
          <Badge :count="noReadCount" class-name="work-badge" v-else>
              <img :src="current==index?require(`../../assets/img/work-side-active_${item.icon}.svg`):require(`../../assets/img/work-side_${item.icon}.svg`)" alt="">
          </Badge>
          
          <p>{{item.name}}</p>
        </li>
      </ul>
    </div>
    <div class="work-content" id="work-content">
      <div class="work-content-left" id="work-content-left">
        <component :is="componentsList[current]" :current='current'></component>
      </div>
    </div>
    <WorkModal :title="message.createTime" 
      :modalText='modalText' 
      :modalShow="detailModal" 
      @cancel='handleClose' 
      type='detailModal'/>
  </div>
</template>
<script>
import Source from './Source'//资源总览
import Approve from './Approve'//申请审批
import FormSource from './FormSource'//申请单
import Message from './Message' //通知消息
import TitleBlcok from '../../components/title-block.vue'
import WorkModal from './modal'
export default {
  components: {
    Source,
    Approve,
    TitleBlcok,
    FormSource,
    Message,
    WorkModal
  },
  data () {
    return {
      workList: [
        { name: '资源总览', icon: '0' },
        { name: '申请单', icon: '1' },
        { name: '申请审批', icon: '2' },
        { name: '通知消息', icon: '5' }
      ],
      current       : 0,
      curComponent  : Source,
      componentsList: [Source, FormSource, Approve, Message],
      newsList      : [
        { date: '10-10', title: '您的桌面云申请单被驳回，请及时处理您的桌面云申请单被驳回，请及时处理' },
        { date: '10-10', title: '您的桌面云申请单被驳回，请及时处理' },
        { date: '10-10', title: '您的桌面云申请单被驳回，请及时处理' },
        { date: '10-10', title: '您的桌面云申请单被驳回，请及时处理' }
      ],
      userInfo: {},
      page    : {
        current: 1,
        size   : 6
      },
      total  : 0,
      message: {
        createTime: '',
        content   : '',
        id        : ''
      },
      modalText  : '',
      detailModal: false,
      noReadCount: 0
    }
  },
  mounted () {
    this.userInfo = JSON.parse(sessionStorage.userInfo)
  },
  methods: {
    handleClick (index) {
      this.current = index
    },
    //获取用户机构
    getOrg (arr) {
      if (arr && arr.length > 0) {
        let names = []
        names = arr.map(item => item.name)
        return names.join(',')
      }
    },
    //更多消息
    moreMessage () {
      this.curComponent = Message
      this.current = 5
    },
    show (row) {
      const { message } = this
      Object.keys(message).forEach(item => {
        message[item] = row[item]
      })
      this.modalText = row.content
      this.detailModal = true
    },
    handleClose (modal) {
      this[modal] = false
    }
  }
  
}
</script>
<style lang="scss">
@import './index.scss';
</style>