<template>
  <Layout>
    <Sider 
      hide-trigger
      collapsible
      :value="collapsed"
      @on-change="SET_COLLAPSED"
      :collapsed-width="collapsedWidth"
      :width="unCollapsedWidth"
      class="sider-wrapper">
      <side-menu :is-collapsed="collapsed" ref="sideMenu">
        <div 
          @click="goTo"
          class="sider-logo-wrapper">
          <img 
            v-show="collapsed"
            width=48
            height=42
            src="@/assets/img/pic_text-logo.png" 
            alt="海联捷讯">
          <img 
            v-show="!collapsed"
            width="100%"
            src="@/assets/img/pic_logo.png" 
            alt="海联捷讯">		
        </div>
      </side-menu>
    </Sider>
    <Layout 
      class="layout-right"
      :style="{paddingLeft: `${leftOffset}px`}">
      <Header 
        class="layout-header"
        :style="{width: `calc(100% - ${leftOffset}px)`}">
        <span @click="SET_COLLAPSED" class="head-trigger">
          <i class="icon_collapsed"></i>
        </span>
        <!-- <div class="header-mid"></div> -->
        <HeaderRight />
      </Header>
      <Content>
        <Tabs
          v-show="tabPaneListLen"
          ref="tabs"
          :value="activeTabPane"
          @on-click="onTabClick"
          @on-tab-remove="onTabRemove"
          type="card" 
          closable
          :style="{width: `calc(100% - ${leftOffset}px)`}"
          class="tab-fix">
          <TabPane 
            v-for="tab of tabPaneList" 
            :key="tab.path"
            :label="tab.label"
            :name="tab.path" />
        </Tabs>
        <router-view class="main-view"></router-view>
      </Content>
      <!-- <Footer>footer</Footer> -->
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './side-menu/side-menu.vue'
import HeaderRight from './header-right'

import {
  mapState,
  mapMutations,
  mapGetters
} from 'vuex'
import { 
  toolOmit
} from '_admin/libs/tool'

export default {
  components: {
    SideMenu,
    HeaderRight
  },
  computed: {
    ...mapState(['tabPaneList', 'activeTabPane', 'collapsed', 'collapsedWidth', 'unCollapsedWidth']),
    ...mapGetters(['leftOffset', 'tabPaneListLen'])
  },
  watch: {
    $route: {
      immediate: true,
      handler (newVal) {
        this.SET_CUR_ROUTE(toolOmit(newVal, ['matched']))

        const { path, meta: { title = [] } } = newVal
        const isBlankPage = path === '/'
        !isBlankPage && this.SET_ACTIVE_TAB_PANE(path)
        if (!isBlankPage && !this.tabPaneList.find(tab => tab.path === path)) {
          this.ADD_TAB_PANE_ITEM({
            label: title.slice(-1)[0],
            path
          })
        }
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_COLLAPSED', 
      'SET_CUR_ROUTE', 
      'SET_ACTIVE_TAB_PANE',
      'ADD_TAB_PANE_ITEM',
      'REMOVE_TAB_PANE_ITEM'
    ]),
    onTabClick (path) {
      if (this.activeTabPane === path || path === '/') return
      this.$router.push(path)
    },
    onTabRemove (path) {
      const index = this.tabPaneList.findIndex(item => path === item.path)
      this.REMOVE_TAB_PANE_ITEM(index)
      if (this.tabPaneListLen) {
        const { activeKey } = this.$refs.tabs
        if (this.$route.path !== activeKey) {
          this.SET_ACTIVE_TAB_PANE(activeKey)
          this.$router.push(activeKey)
        }
      } else {
        this.$router.replace('/')
        this.SET_ACTIVE_TAB_PANE('')
        this.$refs.sideMenu.openNames = []
      }
    },

    goTo () {
      window.open('/')
    }
  }
}
</script>
<style lang="scss">
@import './index.scss';
</style>
