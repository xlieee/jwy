export default {
  state: {
    menuList : [],
    routeList: []
  },
  mutations: {
    SET_MENU_LIST (state, payload) {
      state.menuList = payload
    }, 
    SET_ROUTE_LIST (state, payload) {
      state.routeList = payload
    } 
  }
}