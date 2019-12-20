<template>
  <div class="header-right">
    <Dropdown 
      @on-click="onClickDropdowMenu"
      class="header-dropdown">
      <svg-msg /> 待处理
      <DropdownMenu slot="list" v-show="false">
        <DropdownItem name="item1">待处理项1 <Badge :count="10"></Badge></DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Dropdown 
      @on-click="onClickDropdowMenu"
      class="header-dropdown"
      style="margin-left:24px">
      <svg-avatar /> {{$store.state.siteCommon.userInfo.realName}}
      <DropdownMenu slot="list">
        <DropdownItem name="logout">注销登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
import SvgAvatar from '_admin/components/svg-components/svg-avatar'
import SvgMsg from '_admin/components/svg-components/svg-msg'
import { logout } from '@/api'
export default {
  components: {
    SvgMsg,
    SvgAvatar
  },
  methods: {
    onClickDropdowMenu (name) {
      if ('logout' === name) {
        const { state:{ siteCommon:{ userInfo:{ idcard, password } } } } = this.$store
        logout({ 
          idCard: idcard, 
          password 
        }).then(res => {
          const { code } = res
          if (code === 0) {
            localStorage.removeItem('token')
            this.$Message.success({
              content: '注销成功！',
              onClose: () => {
                window.location.href = `/login?from=${encodeURIComponent(`/admin${this.$route.path}`)}`
              }
            })
          } else {
            this.$Message.error('注销失败！')
          }
        })
      }
    }
  }
}
</script>