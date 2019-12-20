import {
  fetchAllOrgList
} from '../../api/common'

export default {
  namespaced: true,

  state: {
    allOrgList: []
  },
  mutations: {
    SET_ALL_ORG_LIST (state, list) {
      state.allOrgList = list || []
    }
  },

  actions: {
    fetchAllOrgList ({ commit, state/* dispatch  */ }, params = {}) {
      if (state.allOrgList.length) return
      return fetchAllOrgList(params).then(res => {
        const { code, data } = res
        if (code === 0) {
          commit('SET_ALL_ORG_LIST', data)
          return data
        } else {
          return []
        }
      })
    }
  }
}