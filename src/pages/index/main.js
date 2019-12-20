import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import '@/style/common.scss'
import './plugins/theme.less'
import '@/assets/font/font.css'
import ViewUI from 'view-design'
Vue.use(ViewUI, {
  transfer: false,
  size    : 'large',
  menu    : {
    arrow    : 'md-arrow-dropdown',
    arrowSize: 20
  },
  select: {
    arrow: 'md-arrow-dropdown'
  }
})

import * as filters from './filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
import './style/index.scss'

import enhancePrototype from '@/libs/enhance-prototype'
Vue.use(enhancePrototype)

Vue.config.productionTip = false

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')
