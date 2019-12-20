import Vue from 'vue'
import Router from 'vue-router'
import ViewUI from 'view-design'

import routes from './routes'

Vue.use(Router)

const router = new Router({
  mode          : 'history',
  base          : process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start()
  next()
})
router.afterEach(() => {
  ViewUI.LoadingBar.finish()
  window.scrollTo(0, 0)
})
export default router
