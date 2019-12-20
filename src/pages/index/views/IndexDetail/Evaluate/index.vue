<template>
  <div class="evaluate">
    <div class="modalMain" style="padding:25px 0 0;">
      <div class="evaluate-head">
        <p class="title">全部评价（{{total}}条）</p>
        <div class="evaluate-rate">
          <div class="rateItem">
            <span class="label">功能：</span>
            <Rate disabled v-model="avgLevel.avgfeature" class="evaluate-head-rate"/>
          </div>
          <div class="rateItem">
            <span class="label">易用：</span>
            <Rate disabled v-model="avgLevel.avgusability" class="evaluate-head-rate"/>
          </div>
          <div class="rateItem">
            <span class="label">满意度：</span>
            <Rate disabled v-model="avgLevel.avgsatisfaction" class="evaluate-head-rate"/>
          </div>
        </div>
        <Select v-model="type" style="width:200px" @on-change="onChangeType">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="evaluate-main" v-if="dataList.length>0">
        <div class="evaluate-item" v-for="(item,index) in dataList" :key="index">
          <!-- <img src="../../../assets/img/evaluate_user.png" alt=""> -->
          <div class="evaluate-context">
            <div class="info">
              <p>{{item.username}} {{item.duty}}</p>
              <p>{{item.department}}</p>
            </div>
            <div class="evaluate-rate">
              <div class="rateItem">
                <span class="label">功能：</span>
                <Rate disabled v-model="item.feature" />
              </div>
              <div class="rateItem">
                <span class="label">易用：</span>
                <Rate disabled v-model="item.usability" />
              </div>
              <div class="rateItem">
                <span class="label">满意度：</span>
                <Rate disabled v-model="item.satisfaction" />
              </div>
            </div>
            <p class="text">
              {{item.content}}
            </p>
            <div class="footer">
              <div class="date">评论于·
                <Time :time="item.createTime" />
              </div>
              <div class="message" @click="getDetailEvaluate(item.id)">{{item.replyCount}}</div>
            </div>
          </div>
        </div>
        <Page :total="total" :page-size="page.size" class-name='pagination'  @on-change="onChangePage"/>
      </div>
      <div class="evaluate-main" style="height:336px" v-else>
        <div class="no-evaluate">
          <img src="../../../assets/img/no-evaluate.png" alt="">
          <span>暂无评价信息，赶快去评论吧！</span>
        </div>
        <a href="javascript:;" @click="modal = true">立即评论</a>
      </div>
    </div>
    <div class="evaluate-footer" v-if="dataList.length>0">
      <div class="evaluate-footer-main">
        <div class="info">
          <a href="javascript:;" @click="modal = true">我要评价</a>
        </div>
      </div>
    </div>
    <Modal
        v-model="modal"
        title="我要评价"
        @on-ok="ok"
        footer-hide
        width='960px'
        class-name="vertical-center-modal"
        @on-cancel="ok">
        <div class="evaluate-modal-rate">
          <div class="rateItem">
            <span class="label">功能：</span>
            <Rate v-model="form.feature" />
          </div>
          <div class="rateItem">
            <span class="label">易用：</span>
            <Rate v-model="form.usability" />
          </div>
          <div class="rateItem">
            <span class="label">满意度：</span>
            <Rate v-model="form.satisfaction" />
          </div>
          <Input type='textarea' v-model="form.content" placeholder="请输入您的评论" style="margin-top:26px" :rows="4"/>
        </div>
        <div class="evaluate-modal-footer">
          <span class="cancel" @click="modal = false;form={}">取消</span>
          <span class="sure" @click="onOk">确定</span>
        </div>
    </Modal>
    <Modal
        v-model="modal1"
        scrollable
        :title="`相关追问(${this.replyVoList.length})`"
        @on-ok="ok"
        width='1200px'
        class-name="evaluate-center-modal"
        @on-cancel="ok">
        <div class="evaluate-modal-main">
          <div class="item" v-for="(item,index) in replyVoList" :key="index">
            <p>{{item.content}}</p>
            <div class="item-footer">
              <div class="date">评论于· <Time :time="item.createTime" /></div>
              <div class="message">{{item.username}}    {{item.duty}}    {{item.department}}</div>
              <!-- <span @click="item.flag = !item.flag">回复</span> -->
            </div>
            
          </div>
          <div class="reply">
            <Input type='textarea' v-model="content" placeholder="请输入您的评论" :rows="4"/>
            <Button @click="onReply" :disabled='!content'>提交</Button>
          </div>
        </div>
        <div class="evaluate-modal-footer" slot='footer'>
          <span class="sure" @click="modal1 = false;content = ''">关闭</span>
        </div>
    </Modal>
  </div>
</template>
<script>
import { 
  fetchEvaluate, 
  asyncAddEvaluate,
  fetchEvaluateById,
  asyncReplyEvaluate
} from '_index/api/index.js'
export default {
  props: {
    sourceType: {
      type   : Number,
      default: () => 0
    },
    serviceId: {
      type: String
    }
  },
  data () {
    return {
      valueDisabled: 3,
      model1       : '1',
      typeList     : [
        { label: '时间排序', value: 0 },
        { label: '热度排序', value: 1 }
      ],
      dataList: [],
      page    : {
        current   : 1,
        size      : 10,
        sourceType: 0,
        ifHot     : 0
      },
      total : 0,
      type  : 0,
      modal : false,
      modal1: false,
      form  : {
        feature     : 0,
        usability   : 0,
        satisfaction: 0,
        content     : '',
        sourceType  : 0,
        serviceId   : ''
      },
      avgLevel   : {},
      replyVoList: [],
      id         : '',
      content    : '',
      types      : ['cloudApp', 'saas', 'daas', 'paas', 'iaas']
    }
  },
  
  watch: {
    '$route.params.id' (newVal) {
      if (newVal) {
        this.page.sourceType = this.sourceType
        this.form.serviceId = this.$route.params.id
        const index = this.types.findIndex(item => item === this.$route.query.type) + 1
        this.form.sourceType = index
        this.getList()
      }
    }
  },
  methods: {
    ok () {
      this.modal = false
    },
    //添加评论
    onOk () {
      asyncAddEvaluate(this.form).then(res => {
        if (res.code === 0) {
          this.$Message.success('评论成功！')
          this.modal = false
          this.form = {}
          this.getList()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    //评论列表
    getList () {
      fetchEvaluate(this.page, this.form.serviceId).then(res => {
        if (res.code === 0) {
          this.dataList = res.data.page.records
          this.total = res.data.total
          this.avgLevel = res.data.avgLevel || {}
        } else {
          this.dataList = []
        }
      })
    },
    onChangePage (page) {
      this.page.current = page
      this.getList()
    },
    //评论详情
    getDetailEvaluate (id) {
      fetchEvaluateById(id).then(res => {
        if (res.code == 0) {
          this.modal1 = true
          this.id = res.data.id
          this.replyVoList = res.data.replyVoList
        }
      })
    },
    //回复评价
    onReply () {
      let data = {
        evaluationId: this.id,
        content     : this.content
      }
      asyncReplyEvaluate(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('评论成功！')
          this.getDetailEvaluate(this.id)
          this.getList()
          this.content = ''
        } else {
          this.$Message.console.error(res.msg)
        }
      })
    },
    onChangeType (value) {
      this.page.ifHot = value === 1
      console.log(value)
      this.getList()
    }
  }
}
</script>