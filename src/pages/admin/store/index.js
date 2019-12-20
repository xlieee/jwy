import Vue from 'vue'
import Vuex from 'vuex'
import common from './common'
import user from './user'
import tree from './modules/tree'

import siteCommon from '@/store'

Vue.use(Vuex)

export default new Vuex.Store({
  ...common,
  modules: {
    tree,
    user,
    siteCommon
  }
})
