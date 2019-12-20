import {
  fetchDictByName,
  fetchDictByNameTree
} from '@/api'
const $width = document.documentElement.clientWidth
const unCollapsedWidth = $width < 1370 ? 220 : $width < 1600 ? 240 : 256
export default {
  state: {
    collapsedWidth: 80,
    unCollapsedWidth,
    
    collapsed: JSON.parse(localStorage.getItem('collapsed')) || false,
    curRoute : {},

    activeTabPane: '',
    tabPaneList  : [],

    policeTypeList : [],
    areaList       : [],
    srmSubclassList: []
    // srmCloudAppSubclassList:[],
    // srmDaasSubclassList:[]
  },
  getters: {
    leftOffset ({ collapsed, collapsedWidth, unCollapsedWidth }) {
      return collapsed ? collapsedWidth : unCollapsedWidth
    },
    tabPaneListLen ({ tabPaneList }) {
      return tabPaneList.length
    }
  },
  mutations: {
    SET_COLLAPSED (state) {
      state.collapsed = !state.collapsed
      localStorage.setItem('collapsed', state.collapsed)
    },

    SET_CUR_ROUTE (state, payload = {}) {
      state.curRoute = payload
    },
    
    SET_ACTIVE_TAB_PANE (state, fullPath = '') {
      state.activeTabPane = fullPath
    },
    
    SET_TAB_PANE_LIST (state, list = []) {
      state.tabPaneList = list
    },
    ADD_TAB_PANE_ITEM (state, payload = {}) {
      state.tabPaneList.push(payload)
    },
    REMOVE_TAB_PANE_ITEM (state, index) {
      state.tabPaneList.splice(index, 1)
    },

    SET_DICT (state, { field, list }) {
      state[field] = list
    }
  },
  actions: {
    fetchDictByName ({ commit, state }, name, callback) {
      let field = `${name}List`
      if (name.includes('Subclass') && name != 'srmSubclass') {
        field = 'srmSubclassList'
      } else {
        if (state[field].length) return
      }
      const isDaas = name.toLowerCase().includes('daas')
      const fetchFn = isDaas ? fetchDictByNameTree : fetchDictByName 
      fetchFn(name).then(res => {
        const { code, data } = res
        if (code === 0) {
          let _data = []
          if (isDaas) {
            _data = data.map(function self (item) {
              const { children, id, name } = item
              let _children = []
              if (children.length) {
                _children = children.map(self)
              }
              return {
                value   : id,
                label   : name,
                children: _children
              }
            })
          } else {
            _data = data.map(item => ({ id: item.id, name: item.name }))
          }
          commit('SET_DICT', { field, list: _data })
          callback && callback()
        }
      })
    }
  }
}