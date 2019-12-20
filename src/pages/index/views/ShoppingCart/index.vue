<template>
  <div class="shopping-cart">
    <div class="product-v6-banner">
      <div class="product-banner-pc-wrapper">
        <div class="product-banner-pc-bg">
          <div class="product-banner-pc-bg-inner" style="background-image: url(../../assets/img/background_0.png)"></div>
        </div>
      </div>
    </div>
    <div class="shopping-main">
      <div class="shopping-head">
        <p><img src="../../assets/img/shopping-cart.svg" alt=""> 购物车</p>
        <router-link to="/application"><span>+</span> 添加更多产品</router-link>
      </div>
      <div class="shopping-table">
        <div class="shopping-table-header">
          <Dropdown @on-click="changeItemTabs($event)">
            <a class="shopping-table-list shopping-table-list-fw shopping-table-list-active" @click="changeTabs($event,'.shopping-table-list-yun')">
              {{text}} ({{total}})
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem v-for="(item,index) in tabList" :key="index" :name='item.type'>
                  <span class="itemLink">
                    {{item.name}} 
                    <i>{{item.total}}</i>
                  </span>
                </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <span class="shopping-table-list shopping-table-list-yun" @click="changeTabs($event,'.shopping-table-list-fw')">上云应用 ({{cloudAppCount}})</span>
        </div>
        <Table ref="selection" 
          :columns="columns" 
          :data="resultList" 
          @on-row-click="onRowClick"
          @on-selection-change="select => tableSlect(select)" 
           v-if="resultList.length>0"
          >
          <template slot-scope="{ row, index }" slot="action">
            <Tooltip content="编辑" placement="bottom" v-show="row.type===4||row.type===5">
                <span class="editIcon" @click="show(row,index)"></span>
            </Tooltip>
            <Tooltip content="删除" placement="bottom">
                <span class="deleteIcon" @click="remove(row,index)"></span>
            </Tooltip>
          </template>
        </Table>
        <div class="no-shopping" v-else>
          <div>
            <img src="../../assets/img/no-shopping.svg" alt="">
            <span>购物车还是空的，快去添加点产品吧！</span>
          </div>
          <p>
            <router-link to="/application"><em>+</em> 立即添加</router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="shopping-footer" v-if="resultList.length>0">
      <div class="shopping-footer-main">
        <div class="info">
          <div class="selectedCount">
            <Checkbox @on-change='handleSelectedAll'>
              <span class="text" v-show="selectionList.length>0">已选 <span style="color:#303133">({{count}})</span></span>
              <span class="text" v-show="selectionList.length==0">全选</span>
            </Checkbox>
            <span class="text" style="margin-left:20px;cursor:pointer" @click="removeAll">批量删除</span>
          </div>
          <a href="javascript:;" @click="onApply">立即申请({{count}})</a>
        </div>
      </div>
    </div>
    <Modal
        v-model="deleteModal"
        title="提示"
        class-name="vertical-center-modal"
        @on-cancel="deleteModal = false">
        <div class="modalText">
          {{modalText}}
        </div>
        <div class="modalFooter" slot="footer">
          <Button 
            @click="deleteModal = false"
            class="btn btn-cancel">取消</Button>
          <Button 
            @click="onDelete"
            class="btn btn-ok">确定</Button>
        </div>
    </Modal>
    <PromptModal :modal-data="modalData" @on-ok='onSubmit' @on-cancel='onCancel'/>
    <!-- <PromptModal :modal-data="modalData" @on-success='onSubmit' @on-cancel='onCancel'/> -->
    <Modal
        v-model="successModal"
        title="提示"
        @on-ok="successModal = false"
        footer-hide
        class-name="vertical-center-modal"
        @on-cancel="successModal = false">
        <div class="successModalText">
          <img src="../../assets/img/shopping-submit.png" alt="">
          <p>提交成功</p>
          <p>您的申请表单已成功提交，请耐心等待审核</p>
        </div>
    </Modal>
  </div>
</template>
<script>
import $ from 'jquery'
import { fetchCartList, asyncDeleteCart } from '_index/api/application.js'
import { asyncApplySubmit } from '@/api/index.js'
import PromptModal from '_index/components/prompt-modal.vue'
export default {
  components: {
    PromptModal
  },
  data () {
    return {
      count     : 0,
      text      : '资源服务',
      dataList  : [],
      resultList: [],
      columns   : [
        {
          type : 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '资源名称',
          key  : 'serviceName'
          
        }, {
          title: '资源类型',
          key  : 'typeName',
          width: 120
        }, 
        // {
        //   title: '应用名称',
        //   key  : 'application'
        // }, 
        {
          title: '配置信息',
          key  : 'info'
        }, 
        // {
        //   title: '状态',
        //   key  : 'status',
        //   width: 100
        // }, 
        {
          title: '操作',
          width: 100,
          key  : 'control',
          slot : 'action'
        }
      ],
      tabList: [
        { name: 'IAAS资源', total: 0, type: 5 }, 
        { name: 'PAAS服务', total: 0, type: 4 }, 
        { name: 'DAAS服务', total: 0, type: 3 }, 
        { name: 'SAAS服务', total: 0, type: 2 }
      ],
      active        : 0,
      deleteModal   : false,
      successModal  : false,
      flag          : 0, //0--资源服务；1--上云应用
      info          : {}, //点击的单行数据
      isDeleteSingle: true, //true:删除单条数据；false:批量删除
      selectionList : [], //已选数据
      total         : 0,
      cloudAppCount : 0,
      modalText     : '您确认要删除此数据吗？删除数据后不可恢复，请谨慎操作!',
      modalData     : {
        type           : '',
        applyPermission: false
      }
    }
  },
  watch: {
    '$route.name' (newVal) {
      if (newVal === 'shoppingCart') {
        this.getDataList()
      }
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      fetchCartList().then(res => {
        if (res.code === 0) {
          this.dataList = res.data.list
          this.tabList[0].total = res.data.iaasCount
          this.tabList[1].total = res.data.paasCount
          this.tabList[2].total = res.data.daasCount
          this.tabList[3].total = res.data.saasCount
          this.cloudAppCount = res.data.cloudAppCount
          this.total         = res.data.total
          if (this.flag == 0) {
            this.resultList = this.dataList.filter(item => item.type != 1)
          }
        } else {
          this.resultList = []
          this.dataList = []
        }
      })
    },
    onRowClick (row, index) {
      console.log(row, index)
    },
    handleSelectedAll (value) {
      if (value) {
        this.count = this.resultList.length
        this.selectionList = this.resultList
      } else {
        this.count = 0
      }
      this.$refs.selection.selectAll(value)
    },
    tableSlect (selection, isInit) {
      console.log(selection, isInit)
      this.count = selection.length
      this.selectionList = selection
    },
    changeTabs (e, name) {
      console.log(e.target, name, $(e.target).text())
      $(e.target).addClass('shopping-table-list-active')
      $(name).removeClass('shopping-table-list-active')
      if (name == '.shopping-table-list-yun') {
        this.flag = 0
        this.resultList = this.dataList.filter(item => item.type != 1)
      } else {
        this.flag = 1
        this.resultList = this.dataList.filter(item => item.type === 1)
      }
      // this.active = index
    },
    changeItemTabs (type) {
      console.log(this.selectionList, 'this.selectionList')
      this.count = 0
      this.resultList = this.dataList.filter(item => item.type === type)
    },
    remove (row) {
      this.deleteModal = true
      this.info = row
      this.isDeleteSingle = true
      this.modalText = '您确认要删除此数据吗？删除数据后不可恢复，请谨慎操作!'
    },
    removeAll () {
      if (this.selectionList.length === 0) {
        this.modalText = '请勾选要删除的数据'
      } else {
        this.modalText = '您确认要删除此数据吗？删除数据后不可恢复，请谨慎操作!'
      }
      this.deleteModal = true
      this.isDeleteSingle = false
    },
    onDelete () {
      let str = ''
      if (this.isDeleteSingle) {
        str = this.info.id
      } else {
        if (this.selectionList.length === 0) {
          this.deleteModal = false
          return
        }
        let arr = this.selectionList.map(item => item.id)
        str = arr.join(',')
      }
      asyncDeleteCart(str).then(res => {
        if (res.code === 0) {
          this.deleteModal = false
          this.getDataList()
          this.$Message.success('删除成功')
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    onSubmit (form) {
      console.log(form)
      let cartIds = this.selectionList.map(item => item.id)
      let data = {
        appId                 : form.appId,
        applyIntroduction     : form.applyIntroduction,
        applyPhone            : form.applyPhone,
        applyUser             : form.applyUser,
        departmentApprovalUser: form.departmentApprovalUser,
        cartIds               : cartIds.join(','),
        orgId                 : form.orgId.join(','),
        fileId                : form.fileId
      }
      asyncApplySubmit(data).then(res => {
        if (res.code === 0) {
          this.getDataList()
          this.$Message.success('提交成功')
          this.onCancel()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    onCancel () {
      this.modalData.applyPermission = !this.modalData.applyPermission
    },
    //立即申请按钮
    onApply () {
      if (this.selectionList.length === 0) {
        this.modalText = '请勾选要申请的数据'
        this.deleteModal = true
      } else {
        if (this.flag === 0) {
          this.modalData.type = 'submitCarts'
          this.modalData.applyPermission = !this.modalData.applyPermission
        } else {
          this.modalData.type = 'submitCarts-yun'
          this.modalData.applyPermission = !this.modalData.applyPermission
        }
      }
      
    }
  }
}
</script>
<style lang="scss">
.top,.bottom{
        text-align: center;
    }
.shopping-cart{
  background: #F1F3FE;
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
  .shopping-main{
    width: $mainWidth;
    margin: 0 auto;
    .shopping-head{
      padding: 40px 0;
      overflow: hidden;
      cursor: pointer;
      p{
        float: left;
        font-size: 28px;
        color: #303133;
        font-weight: 500;
        img{
          margin-right: 14px;
        }
        
      }
      a{
        float: left;
        margin-left: 40px;
        font-size: 18px;
        color: #303133;
        line-height: 42px;
        position: relative;
        span{
          color: $active;
          margin-right: 11px;
          font-weight: 600;
        }
        &::before{
          content: '';
          position: absolute;
          top: 12px;
          left: -20px;
          width: 1px;
          height: 21px;
          background-color: #C0C4CC;
          display: inline-block;
        }
      }
    }
    .shopping-table{
      padding: 32px 24px 92px;
      background: #fff;
      overflow: hidden;
      min-height: calc(100vh - 435px);
      .shopping-table-header{
        margin-bottom: 30px;
        .itemLink{
          font-size: 16px;
          color: #333333;
          i{
            font-style: normal;
            margin-left: 10px;
            display: inline-block;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: $active;
            font-size: 12px;
            color: #fff;
            font-weight: 500;
            text-align: center;
            line-height: 18px;
            float: right;
          }
        }
        .shopping-table-list{
          font-size: 16px;
          color: #303133;
          
          &-fw{
            padding-right: 30px;
          }
          &-yun{
            padding-left: 30px;
            position: relative;
            cursor: pointer;
            &::before{
              content: "";
              display: inline-block;
              width: 1px;
              height: 14px;
              background: #DFE5F3;
              position: absolute;
              left: 0;
              top: 4px;
            }
          }
          &-active{
            font-weight: 600;
            color: $active;
            font-size: 18px;
          }
        }
      }
      .tabs{
        display: flex;
        margin-bottom: 30px;
        li{
          padding: 0 31px;
          position: relative;
          cursor: pointer;
          &:first-of-type{
            padding: 0 30px 0 0;
          }
          &::after{
            content: "";
            display: inline-block;
            width: 1px;
            height: 14px;
            background: #DFE5F3;
            position: absolute;
            right: 0;
            top: 4px;
          }
        }
        &-active{
          font-weight: 600;
          color: $active;
          font-size: 18px;
        }
      }
    }
    .no-shopping{
      background: #fff;
      overflow: hidden;
      min-height: calc(100vh - 526px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      >div{
        line-height: 167px;
      }
      img{
        width: 167px;
        height: 167px;
        float: left;
      }
      span{
        font-size: 16px;
        color: #303133;
        font-weight: 500;
        line-height: 28px;
      }
      p{
        width: 100%;
        text-align: center;
        em{
           list-style: none;
          font-size: 26px;
          position: absolute;
          left: 20px;
        }
        a{
          width: 140px;
          height: 44px;
          display: inline-block;
          background-color: #F66F6A;
          color: #fff;
          line-height: 44px;
          border-radius: 2px;
          font-size: 16px;
          position: relative;
          padding-left: 16px;
        }
      }
    }
  }
}
.shopping-footer{
  width: 100%;
  height: 90px;
  background: #fff;
  box-shadow:0px -2px 20px 0px rgba(11,36,68,0.1);
  .shopping-footer-main{
    width: $mainWidth;
    margin: 0 auto;
  }
  .info{
    height: 90px;
    margin-right:40px;
    position: relative;
    .selectedCount{
      float: left;
      height: 90px;
      line-height: 90px;
      padding-left: 40px;
    }
    .text{
      line-height: 90px;
      color:#303133;
      padding-left: 10px;
      font-size: 16px;
      span{
        color: #1890FF
      }
    }
    a{
      float: right;
      width:108px;
      height:44px;
      text-align: center;
      line-height: 44px;
      background:#F66F6A;
      border-radius:2px;
      border:1px solid #F66F6A;
      margin: 23px 0 0;
      color: #fff;
      font-size: 16px;
      &:hover{
        box-shadow: 0 8px 6px -4px rgba(246, 111, 106, 0.5);
      }
    }
  }
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    .modalText{
      font-size:18px;
      font-weight:600;
      color:#303133;
    }
    .successModalText{
      text-align: center;
      p{
        &:first-of-type{
          font-size: 24px;
          color: #303133;
          margin-top: 20px;
        }
        &:last-of-type{
          font-size: 16px;
          color: #606266;
          margin-top: 10px;
        }
      }
    }
}
.modalFooter{
  margin-top: 33px;
  display: flex;
  justify-content: center;
  box-shadow:0px -2px 4px 0px rgba(246,111,106,0.1);
  border-radius:0px 0px 4px 4px;
  padding-top: 13px;
  .btn:first-of-type{
    margin-right: 20px;
  }
  .btn{
    width: 108px;
    height: 44px;
    font-size: 16px;
  }
  .btn-cancel{
    background: #EBEEF5;
    color: #606266;
  }
  .btn-ok{
    background: $active;
    color: #fff;
  }
}

</style>