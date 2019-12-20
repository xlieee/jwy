<template>
  <div id="banner">
    <Dropdown v-for="(item,index) in menuList" :key="index" @click.native='handleChange(index)' :class="activeIndex==index?'active':''">
      <a class="activeLink" v-show="item.flag">
        {{item.name}}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <div class="activeLink banner-item" @click="handleClick(item)" v-show="!item.flag">
        {{item.name}}
      </div>
      <!-- <router-link :to="item.link" class="activeLink" v-show="!item.flag&&item.link!='/admin'">
        {{item.name}}
      </router-link> -->
      <!-- <a href="javascript:;" class="activeLink" v-show="item.link=='/admin'" @click="toAdmin">
        {{item.name}}
      </a> -->
      <DropdownMenu slot="list" v-if="item.flag">
          <DropdownItem v-for="(i,d) in item.children" :key="d">
            <router-link :to="i.link" class="itemLink">
              {{i.name}}
            </router-link>
          </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    
    <div class="banner-right">
      <span class="bench" @click="goWorkbench">工作台</span>
      <span class="login" @click="goLogin" v-if="!userInfo.realName">登录</span>
      <Dropdown class="login" v-else>
        <a>
          {{userInfo.realName}}
          <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem>
              <span class="itemLink" @click="onExit">
                安全退出
              </span>
            </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <PromptModal :modal-data="modalData"/>
  </div>
</template>
<script>
import { userInfo, exit } from '_index/api/user.js'
import PromptModal from '_index/components/prompt-modal.vue'
export default {
  components: {
    PromptModal
  },
  data () {
    return {
      menuList: [
        { name: '首页', link: '/' },
        { name: '产品中心', link: '/' },
        { name: '大屏数据', link: '/' },
        { name: '一键申请', link: '/application' },
        { 
          name    : '注册发布', 
          flag    : true, 
          children: [ 
            { name: '应用注册', link: '/applicationRegister' }, 
            { name: '服务发布', link: '/servicePublication' } 
          ],
          link: '/'
        },
        { name: '文档中心', link: '/document' },
        { name: '运营管理', link: '/admin' }
      ],
      activeIndex: 0,
      userInfo   : {},
      modalData  : {
        type           : '',
        applyPermission: false
      }
    }
  },
  watch: {
    '$route.name' (newVal) {
      
      if (newVal == 'index') {
        sessionStorage.activeIndex = 0
        this.activeIndex = 0
      }
    }
  },
  created () {
    //接收removeIndex，清除选中
    this.$root.$on('removeIndex', this.removeIndex)
    console.log(this.activeIndex, 'activeIndex')
  },
  mounted () {
    this.activeIndex = sessionStorage.activeIndex 
    console.log(localStorage.token, 'toekn5')
    if (localStorage.token) {
      this.getUsreInfo(localStorage.token)
    }
  },
  methods: {
    //banner切换
    handleChange (index) {
      if (index === 3 || index === 6) {
        if (localStorage.token) {
          //运营管理
          if (index === 6) {
            return
          } else {
            this.activeIndex = index
            sessionStorage.activeIndex = index
          }
        } else {
          return
        }
      } else {
        this.activeIndex = index
        sessionStorage.activeIndex = index
      }
    },
    //跳转到工作台
    goWorkbench () {
      if (localStorage.token) {
        this.$router.push('/workbench')
      } else {
        this.modalData.type = 'no-login'
        this.modalData.applyPermission = !this.modalData.applyPermission
      }
      
    },
    //登录
    goLogin () {
      console.log('111')
      window.location.href = '/login.html'
      // this.$router.push('/Login')
    },
    //清除banner选中状态
    removeIndex () {
      this.activeIndex = ''
    },
    //获取用户信息
    getUsreInfo (token) {
      userInfo(token).then(res => {
        this.userInfo = res
        sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        
      })
    },
    //退出
    onExit () {
      exit().then(res => {
        if (res.code === 0) {
          this.userInfo = {}
          localStorage.removeItem('token')
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    toAdmin () {
      window.open('/admin')
    },
    handleClick (row) {
      if (row.name === '一键申请' || row.name === '运营管理') {
        if (localStorage.token) {
          if (row.name === '运营管理') {
            window.open(row.link)
          } else {
            this.$router.push(row.link)
          }
        } else {
          this.modalData.type = 'no-login'
          this.modalData.applyPermission = !this.modalData.applyPermission
        }
      } else {
        this.$router.push(row.link)
      }
    }
  }
}
</script>