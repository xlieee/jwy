import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/theme.less'
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
import '@/style/common.scss'
import './style/common.scss'

import xlModal from './components/modal/index'
Vue.use(xlModal)

const $width = document.documentElement.clientWidth
Vue.prototype.$width = $width
Vue.prototype.$lt = $width < 1360

import enhancePrototype from '@/libs/enhance-prototype'
Vue.use(enhancePrototype)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
