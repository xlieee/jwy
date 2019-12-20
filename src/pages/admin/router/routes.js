import BlankPage from '../views/BlankPage.vue'

const MainLayout = () => import('../components/main-layout')

const SysOrg           = () => import('../views/SysManagement/Org')
const SysProcessConfig = () => import('../views/SysManagement/ProcessConfig')
const SysUser          = () => import('../views/SysManagement/User')
const SysRole          = () => import('../views/SysManagement/Role')
const SysTenant        = () => import('../views/SysManagement/Tenant')
const SysDict          = () => import('../views/SysManagement/Dict')
const SysLog           = () => import('../views/SysManagement/Log')

const PlatformNews     = () => import('../views/WebsiteManage/NewsInformation')// 新闻资讯
const PlatformCarousel = () => import('../views/WebsiteManage/NewSlideshow')// 新闻--轮播图
const PlatformDoc      = () => import('../views/WebsiteManage/Classify')//新闻--规范文档管理
const PlatformQuestion = () => import('../views/WebsiteManage/Question')//新闻--常见问题管理

const ServiceSaas = () => import('../views/ServiceManagement/Saas')

const ResourceDaas = () => import('../views/ResourceManagement/Daas')

const routes = [
  {
    path     : '/sys',
    component: MainLayout,
    children : [
      {
        path: '/sys/org',
        name: 'sys-org',
        meta: {
          title: ['系统设置', '组织结构']
        },
        component: SysOrg
      },
      {
        path: '/sys/process-config',
        name: 'sys-process-config',
        meta: {
          title: ['系统设置', '流程配置']
        },
        component: SysProcessConfig
      },
      {
        path: '/sys/user',
        name: 'sys-user',
        meta: {
          title: ['系统设置', '用户管理']
        },
        component: SysUser
      },
      {
        path: '/sys/role',
        name: 'sys-role',
        meta: {
          title: ['系统设置', '用户角色']
        },
        component: SysRole
      },
      {
        path: '/sys/tenant',
        name: 'sys-tenant',
        meta: {
          title: ['系统设置', '租户管理']
        },
        component: SysTenant
      },
      {
        path: '/sys/dict',
        name: 'sys-dict',
        meta: {
          title: ['系统设置', '数据字典']
        },
        component: SysDict
      },
      {
        path: '/sys/log',
        name: 'sys-log',
        meta: {
          title: ['系统设置', '系统日志']
        },
        component: SysLog
      }
    ]
  },
  /*-平台管理-----------------------*/
  {
    path     : '/platform',
    component: MainLayout,
    children : [
      {
        path: '/platform/news',
        name: 'platform-news',
        meta: { 
          title: ['平台管理', '新闻资讯'] 
        },
        component: PlatformNews
      },
      {
        path: '/platform/carousel',
        name: 'platform-carousel',
        meta: { 
          title: ['平台管理', '轮播图管理'] 
        },
        component: PlatformCarousel
      },
      {
        path: '/platform/doc',
        name: 'platform-doc',
        meta: { 
          title: ['平台管理', '规范文档管理'] 
        },
        component: PlatformDoc
      },
      {
        path: '/platform/question',
        name: 'platform-question',
        meta: { 
          title: ['平台管理', '常见问题管理'] 
        },
        component: PlatformQuestion
      }
    ]
  },
  {
    path     : '/service',
    component: MainLayout,
    children : [
      {
        path: '/service/cloud',
        name: 'service-cloud',
        meta: {
          title: ['服务设置', '上云应用管理']
        },
        component: ServiceSaas
      },
      {
        path: '/service/saas',
        name: 'service-saas',
        meta: {
          title: ['服务设置', 'SAAS服务管理']
        },
        component: ServiceSaas
      },
      {
        path: '/service/daas',
        name: 'service-daas',
        meta: {
          title: ['服务设置', 'DAAS服务管理']
        },
        component: ServiceSaas
      },
      {
        path: '/service/paas',
        name: 'service-paas',
        meta: {
          title: ['服务设置', 'PAAS服务管理']
        },
        component: ServiceSaas
      },
      {
        path: '/service/iaas',
        name: 'service-iaas',
        meta: {
          title: ['服务设置', 'IAAS服务管理']
        },
        component: ServiceSaas
      }
    ]
  },
  {
    path     : '/resource',
    component: MainLayout,
    children : [
      {
        path: '/resource/daas',
        name: 'resource-daas',
        meta: {
          title: ['资源管理', 'DAAS资源申请']
        },
        component: ResourceDaas
      },
      {
        path: '/resource/saas',
        name: 'resource-saas',
        meta: {
          title: ['资源管理', 'SAAS资源申请']
        },
        component: ResourceDaas
      },
      {
        path: '/resource/iaas',
        name: 'resource-iaas',
        meta: {
          title: ['资源管理', 'IAAS资源申请']
        },
        component: ResourceDaas
      },
      {
        path: '/resource/paas',
        name: 'resource-paas',
        meta: {
          title: ['资源管理', 'PAAS资源申请']
        },
        component: ResourceDaas
      }
    ]
  }
]

export default {
  routes,
  blankRoute: { 
    path     : '/', 
    component: MainLayout,
    children : [
      {
        path     : '',
        component: BlankPage 
      }
    ]
  },
  redirectRoute: {
    path    : '*',
    redirect: '/'
  }
}