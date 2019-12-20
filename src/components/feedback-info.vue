<template>
  <div class="feedback-wrap">
    <List v-if="list.length" class="list-fix-feedback set-max-height">
      <ListItem
        v-for="(item,index) of list"
        :key="index">
        <ListItemMeta 
          :avatar="require('@/assets/img/pic_feedback-avatar.png')">
          <div slot="title">
            <p class="level1"><span class="name">{{item.createUserName}}</span><span>{{item.createUserDuty}}</span></p>  
            <p class="level2">{{item.createUserOrg}}</p>  
          </div>
          <div slot="description">
            <p class="level1">{{item.content}}</p>  
            <p class="level2"><Icon type="md-time" size="16" /> {{item.createTime}}</p> 
          </div>
        </ListItemMeta>
      </ListItem>
    </List>
    <div 
      v-else 
      class="set-max-height"
      style="padding-top:16px">
      <Alert show-icon>暂无反馈信息!</Alert>
    </div>
    
    <Spin size="large" fix v-show="spinShow"></Spin>

    <div class="reply-block" v-show="replyAble">
      <Input 
        v-model="reply"/>
      <Button 
        @click="onClickReply"
        :disabled="!replyLen"
        :class="replyBtnCls" style="width:100px">提 交</Button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'feedback-info',
  data () {
    return {
      replyAble: true,

      reply   : '',
      spinShow: false,

      list: []
    }
  },
  computed: {
    replyLen () {
      return this.reply && this.reply.trim().length
    },
    replyBtnCls () {
      return ['btn-reply-submit', { 'btn-reply-submit--active': this.replyLen }]
    }
  },
  methods: {
    onClickReply () {
      this.spinShow = true
      this.$emit('callback', {
        type: 'feedback-info',
        data: this.reply
      })
    }
  }
}
</script>
<style lang="scss">
.feedback-wrap {
  padding: 0 0 30px !important;
  height: 100%;
  .set-max-height {
    padding: 0 20px;
    height: calc(100% - 60px);
  }
  .reply-block {
    display: flex;
    align-items: center;
    padding: 0 24px;
    height: 90px;

    background-color: rgba(246,248,255,1);
    box-shadow: 0px -2px 20px 0px rgba(11,36,68,0.1);
  }
  .btn-reply-submit {
    margin-left: 20px;
    color: #fff;
    background-color: #F66F6A;
    opacity: .5;
    &:not([disabled]):hover,
    &:active {
      border-color: #F66F6A;
    }
    &:focus {
      box-shadow: 0 0 0 2px rgba(246, 111, 106, 0.2);
    }
    &--active {
      opacity: 1;
    }
  }
}
.list-fix-feedback {
  overflow-y: auto;
  .level1 {
    font-size: 14px;
    color: #252B30;
  }
  .level2 {
    margin: 4px 0;
    font-size: 13px;
    color: #575D6C;
  }
  .name {
    font-size: 15px;
    margin-right: 10px;
    font-weight: 600;
  }
  .ivu-list-item-meta-description {
    margin-top: 12px;
    .level2 {
      margin-top: 12px;
    }
  }
}
</style>