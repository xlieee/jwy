export default {
  state: {
    userInfo: {},
    token   : localStorage.getItem('token')
  },
  mutations: {
    SET_USER_INFO (state, payload = {}) {
      state.userInfo = payload
    },
    CLEAR_TOKEN (state) {
      state.token = ''
      localStorage.removeItem('token')
    }
  }
}