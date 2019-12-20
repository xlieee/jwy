<template>
  <!-- <Submenu name="sys">
    <template slot="title">
      <Icon type="md-settings" size="20" />
      <span>系统设置</span>
    </template>
    <MenuItem 
      v-for="item of menuList"
      :key="item.name"
      :name="item.name">{{item.label}}<Icon type="md-arrow-dropright" class="menu-item_arrow" />
    </MenuItem>
  </Submenu> -->
  <Submenu :name="parent.name">
    <template slot="title">
      <Icon :type="parent.icon" size="20" />
      <span>{{ parent.label }}</span>
    </template>
    <template v-if="parent.children">
      <template v-for="item in parent.children">
        <!-- <template v-if="item.children && item.children.length === 1">
          <side-menu-item 
            v-if="item.children && item.children.length" 
            :key="item.name" 
            :parent="item"></side-menu-item>
          <MenuItem 
            v-else 
            :name="item.name" 
            :key="item.children[0].name">
            {{item.children[0].label}}<Icon type="md-arrow-dropright" class="menu-item_arrow" />
          </MenuItem>
        </template>
        <template v-else> -->
          <side-menu-item 
            v-if="item.children && item.children.length" 
            :key="item.name" 
            :parent="item"></side-menu-item>
          <MenuItem 
            v-else 
            :name="item.name" 
            :key="item.name">
            {{item.label}}<Icon type="md-arrow-dropright" class="menu-item_arrow" />
          </MenuItem>
        <!-- </template> -->
      </template>
    </template>
  </Submenu>
</template>
<script>
export default {
  name : 'SideMenuItem',
  props: {
    parent: Object
  }
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
  // }
}
</script>
