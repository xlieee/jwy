import Vue from 'vue'
import VueRouter from 'vue-router'
import ViewUI from 'view-design'
import store from '../store'
import { fetchUserInfo } from '@/api'
import * as allRoute from './routes'
const { routes, blankRoute, redirectRoute } = allRoute.default

Vue.use(VueRouter)

function getItem (targetPath, routes) {
  for (let i = 0;i < routes.length;i++) {
    const { children, path } = routes[i]
    if (children) {
      getItem(targetPath, children)
    }
    if (targetPath === path) {
      getItem.value = routes[i]
      return 
    }
  }
}
function filterRoutes (fetchRoutes) {
  const collectionTitle = []
  const routeList = fetchRoutes.map(function self (item) {
    const { children, url, name } = item
    let _item = {}
    getItem(url, routes)
    if (getItem.value) {
      _item = getItem.value
    }
    collectionTitle.push(name)
    if (children.length) {
      _item.children = children.map(self)
      const firstItemPath = _item.children[0].path
      _item.children.unshift({ path: '', redirect: firstItemPath })
      _item.children.push({ path: '*', redirect: firstItemPath })
    } else {
      _item.meta = {
        title: collectionTitle.concat()
      }
    }  
    collectionTitle.pop()
    return _item
  })
  const menuList = fetchRoutes.map(function self (item) {
    const { children, url, name, icon } = item
    const _item = {
      name : url,
      label: name
    }
    if (icon) {
      _item.icon = icon
    }
    if (children && children.length) {
      _item.children = children.map(self)
    }
    return _item
  })

  routeList.unshift(blankRoute)
  routeList.push(redirectRoute)
  return {
    menuList,
    routeList
  }
}

const router = new VueRouter({
  mode          : 'history',
  base          : '/admin',
  scrollBehavior: () => ({ y: 0 })
})
router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start()
  if (!store.state.user.routeList.length) {
    fetchUserInfo().then(res => {
      const { 
        msg, /* permissionList */
        id, duty, policeType, policeNumber, 
        phone, realName, idcard, password,
        policeRank, orgList
      } = res
      if (!msg) {
        const userInfo = { 
          id, duty, policeType, policeNumber, 
          phone, realName, idcard, password,
          policeRank,
          orgList: orgList.map(item => ({ id: item.id, name: item.name }))
        }
        store.commit('SET_USER_INFO', userInfo)
        const { menuList, routeList } = filterRoutes(res.permissionList)
        store.commit('SET_MENU_LIST', menuList)
        store.commit('SET_ROUTE_LIST', routeList)
        router.addRoutes(routeList)
        next(to.path)
        
      } else {
        localStorage.removeItem('token')
        ViewUI.LoadingBar.finish()
        ViewUI.Message.error({
          content : `${msg},为您跳转到登录界面`,
          duration: 2,
          onClose : () => {
            window.location.href = `/login?from=${encodeURIComponent(`/admin${to.path}`)}`
          }
        })
      }
      
    })
  } else {
    next()
  }
  
})
router.afterEach(() => {
  ViewUI.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
