import Layout from '../components/Layout'
const ROUTES = [
  {
    path     : '/',
    component: Layout,
    children : [
      {
        path: '',
        name: 'index',
        meta: {
          title: '警务云产品'
        },
        component: () => import('../views/Index')
      }, {
        path: 'document',
        name: 'document',
        meta: {
          title: '文档中心'
        },
        component: () => import('../views/Document')
      }, {
        path: 'applicationRegister',
        name: 'applicationRegister',
        meta: {
          title: '应用注册'
        },
        component: () => import('../views/ApplicationRegister')
      }, {
        path: 'servicePublication',
        name: 'servicePublication',
        meta: {
          title: '服务发布'
        },
        component: () => import('../views/ServicePublication')
      }, {
        path: 'workbench',
        name: 'workbench',
        meta: {
          title: '工作台'
        },
        component: () => import('../views/Workbench')
      }, {
        path: 'application',
        name: 'application',
        meta: {
          title: '一键申请'
        },
        component: () => import('../views/Application')
      }, {
        path: 'Login',
        name: 'Login',
        meta: {
          title: '登录'
        },
        component: () => import('../views/Login')
      }, {
        path: 'newsList',
        name: 'newsList',
        meta: {
          title: '新闻列表'
        },
        component: () => import('../views/NewsList')
      }, {
        path: 'newsDetail/:id',
        name: 'newsDetail',
        meta: {
          title: '新闻详情'
        },
        component: () => import('../views/NewsDetail')
      }, {
        path: 'searchList',
        name: 'searchList',
        meta: {
          title: '搜索列表'
        },
        component: () => import('../views/Document/SearchList')
      }, {
        path: 'shoppingCart',
        name: 'shoppingCart',
        meta: {
          title: '购物车'
        },
        component: () => import('../views/ShoppingCart')
      }, {
        path: 'indexMore/:type',
        name: 'indexMore',
        meta: {
          title: '应用二级页面'
        },
        component: () => import('../views/IndexMore')
      }, {
        path: 'indexDetail/:id',
        name: 'indexDetail',
        meta: {
          title: '应用详情页面'
        },
        component: () => import('../views/IndexDetail')
      }, {
        path: 'productDoc/:id',
        name: 'productDoc',
        meta: {
          title: '产品文档页面'
        },
        component: () => import('../views/ProductDoc')
      }
    ]
  }
]

export default [
  ...ROUTES,
  {
    path    : '/(home|index)',
    redirect: '/'
  }
]
