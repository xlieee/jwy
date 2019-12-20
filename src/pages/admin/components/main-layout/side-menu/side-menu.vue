<template>
  <div class="sider-content">
    <slot></slot>
    <Menu
			v-show="!isCollapsed"
			ref="menu"
      @on-select="onSelect"
			:active-name="activeName" 
			:open-names="openNames"
			accordion
			theme="dark"
			class="sider-menu"
			style="width: auto">
      <side-menu-item 
        v-for="route of menuList"
        :key="route.name"
        :parent="route" />
		</Menu>
		<div 
			v-show="isCollapsed"
			class="collapsed-menu">
      <template v-for="route in menuList">
        <collapsed-menu 
          v-if="route.children && route.children.length"
          :key="route.name"
          @on-click="onClickCollapsedMenu"
          :active-name="activeName"
          :open-names="openNames"
          :parent="route" />
        <Tooltip 
          v-else
          transfer 
          placement="right" 
          :key="route.name">
          <Icon :type="route.icon" size="20" />
          <span 
            slot="content"
            :class="[
              'ivu-menu-item',
              {'ivu-menu-item--actived': $route.path === route.name}
            ]">{{route.label}}</span>
        </Tooltip>
      </template>
    </div>
  </div>
</template>
<script>
import SideMenuItem from './side-menu-item.vue'
import CollapsedMenu from './collapsed-menu.vue'

export default {
  components: {
    SideMenuItem,
    CollapsedMenu
  },
  props: {
    isCollapsed: Boolean
  },
  data () {
    return {
      openNames: []
    }
  },
  computed: {
    activeName () {
      return this.$store.state.activeTabPane
    },
    menuList () {
      return this.$store.state.user.menuList
    },
    collapsedMenuItem () {
      const path = this.getOpenNames(this.$route.path)[0]
      return this.menuList.find(item => path === item.name)
    }
  },
  watch: {
    openNames () {
      this.updateOpened()
    },
    '$route.path': {
      immediate: true,
      handler (newVal) {
        this.openNames = this.getOpenNames(newVal)
      }
    }
  },
  methods: {
    getOpenNames (path) {
      // eslint-disable-next-line
      const handledPaths = path.match(/\/([^\/]*)/g)
      return handledPaths.slice(0, handledPaths.length === 1 ? 1 : -1)
    },
    updateOpened () {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened()
      })
    },
    onSelect (name) {
      if (this.$route.path === name) return
      this.$router.push(name)
    },
    onClickCollapsedMenu ({ name }) {
      this.onSelect(name)
      this.openNames = this.getOpenNames(name)
    }
  }
}
</script>