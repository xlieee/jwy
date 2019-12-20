<template>
  <Dropdown 
    ref="dropdown" 
    @on-click="onClickDropdown"
    @on-visible-change="onVisiableChange"
    placement="right-start"
    :class="['menu-dropdown-fix',{'show-menu':show}]">
    <div 
      :class="[
        'ivu-menu-item',
        {'ivu-menu-item--actived': path === parent.name.split('/')[1]}
      ]">
      <Icon :type="parent.icon" size="16" />
    </div>
    <!-- <DropdownMenu slot="list">
      <DropdownItem 
        v-for="item of menuList"
        :key="item.name"
        :name="item.name"
        :selected="activeName.indexOf(item.name) > -1">{{item.label}}</DropdownItem>
    </DropdownMenu> -->
    <template v-if="parent.children">
      <DropdownMenu 
        ref="dropdown"
        slot="list">
        <template v-for="item in parent.children">
          <CollapsedMenu 
            v-if="item.children && item.children.length"
            :parent="item" 
            :key="item.name"></CollapsedMenu>
          <DropdownItem 
            v-else
            :key="item.name"
            :name="item.name"
            :selected="activeName === item.name">{{item.label}}</DropdownItem>
        </template>
      </DropdownMenu>
    </template>
  </Dropdown>
</template>
<script>
export default {
  name : 'CollapsedMenu',
  props: {
    activeName: {
      type   : String,
      default: ''
    },
    parent: {
      type: Object
    }
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
    path () {
      return this.$route.path.split('/')[1]
    }
  },
  // data () {
  //   return {
  //     menuList: [
  //       { name: '/sys/org', label: '组织结构' },
  //       { name: '/sys/process-config', label: '流程配置' },
  //       { name: '/sys/user', label: '用户管理' },
  //       { name: '/sys/role', label: '角色管理' },
  //       { name: '/sys/tenant', label: '租户管理' },
  //       { name: '/sys/dict', label: '数据字典' },
  //       { name: '/sys/log', label: '系统日志' },
  //       { name: '/platform/news', label: '新闻管理' },
  //       { name: '/platform/carousel', label: '轮播管理' },
  //       { name: '/platform/doc', label: '规范文档管理' },
  //       { name: '/platform/question', label: '常见问题管理' }
  //     ]
  //   }
  // },
  methods: {
    onVisiableChange (v) {
      this.show = v
    },
    onClickDropdown (name) {
      this.$emit('on-click', { name })
    }
  }
}
</script>
