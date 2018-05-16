import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

  {
    path: '/userDetail',
    component: Layout,
    redirect: '/userDetail/index_e_:elderId', //  /:id
    meta: {
      roles: ['userDetail']
    },
    hidden: true,
    children: [{
      path: 'index_e_:elderId', //  /:id
      component: _import('userDetail/index'),
      name: 'userDetail',
      meta: {
        title: '病人信息',
        icon: 'documentation',
        noCache: true
      }
    }]
  },

  {
    path: '/service',
    component: Layout,
    redirect: 'noredirect',
    name: 'services',
    meta: {
      title: '服务',
      icon: 'component',
      roles: ['service']
    },
    children: [
      { path: 'chooseNurse', component: _import('services/nurse'), name: 'nurse', meta: { title: '选择护工', roles: ['service'] }},
      { path: 'chooseService', component: _import('services/serviceLevel'), name: 'service-level', meta: { title: '选择服务档次', roles: ['service'] }}
    ]
  },

  {
    path: '/statistic',
    component: Layout,
    redirect: '/statistic/index',
    meta: {
      roles: ['statistic', 'admin']
    },
    children: [{
      path: 'index',
      component: _import('statisticChart/index'),
      name: 'statisticChart',
      meta: {
        title: '统计信息',
        icon: 'chart',
        noCache: true
      }
    }]
  },

  {
    path: '/inspection',
    component: Layout,
    redirect: '/inspection/index',
    meta: {
      roles: ['admin', 'inspection']
    },
    children: [{
      path: 'index',
      component: _import('inspection/index'),
      name: 'inspection',
      meta: {
        title: '巡查结果',
        icon: 'form',
        noCache: true
      }
    }]
  },

  {
    path: '/management',
    component: Layout,
    redirect: 'noredirect',
    name: 'management',
    meta: {
      title: '人员管理',
      icon: 'component'
    },
    children: [
      { path: 'managePatient', component: _import('management/patient'), name: 'patient', meta: { title: '老人管理', icon: 'component', roles: ['admin', 'elderManagement'] }},
      { path: 'manageNurse', component: _import('management/nurse'), name: 'nurse', meta: { title: '护士管理', icon: 'component', roles: ['admin', 'nurseManagement'] }}
    ]
  },

  {
    path: '/detail',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    meta: {
      roles: ['admin', 'detail']
    },
    children: [
      { path: 'index_e_:elderId', component: _import('detail/elderDetail'), name: 'elderDetail', meta: { title: '查看老人信息', noCache: true }},
      { path: 'index_n_:nurseId', component: _import('detail/nurseDetail'), name: 'nurseDetail', meta: { title: '查看护工信息', noCache: true }}
    ]
  },

  {
    path: '/documentation',
    component: Layout,
    redirect: 'noredirect',
    name: 'documentation',
    meta: {
      title: '健康管理',
      icon: 'documentation'
    },
    children: [
      { path: 'medicallyExamin', component: _import('documentation/medicallyExamination'), name: 'medicallyExamination', meta: { title: '体检记录', roles: ['admin', 'documentation'] }},
      { path: 'advice', component: _import('documentation/advice'), name: 'advice', meta: { title: '医嘱', roles: ['admin', 'documentation'] }},
      { path: 'medicalRecord', component: _import('documentation/medicalRecord'), name: 'medicalRecord', meta: { title: '病历', roles: ['admin', 'documentation'] }}
    ]
  },

  {
    path: '/relation',
    component: Layout,
    redirect: '/relation/index',
    meta: {
      roles: ['admin', 'relation']
    },
    children: [{
      path: 'index',
      component: _import('relation/index'),
      name: 'relation',
      meta: {
        title: '关联家属',
        icon: 'example',
        noCache: true
      }
    }]
  },

  {
    path: '/notification',
    component: Layout,
    redirect: '/notification/index',
    meta: {
      roles: ['admin', 'notification']
    },
    children: [{
      path: 'index',
      component: _import('notification/index'),
      name: 'notification',
      meta: {
        title: '通知列表',
        icon: 'notification',
        noCache: true
      }
    }]
  },

  {
    path: '/permission',
    component: Layout,
    redirect: '/[permission/index',
    name: 'permission',
    meta: {
      roles: ['admin', 'permission']
    },
    children: [{
      path: 'index',
      component: _import('permission/index'),
      name: 'permission',
      meta: {
        title: '权限管理',
        icon: 'lock',
        noCache: true
      }
    }]
  },

  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/index',
    meta: {
      roles: ['admin', 'settings']
    },
    children: [{
      path: 'index',
      component: _import('settings/index'),
      name: 'settings',
      meta: {
        title: '设置',
        icon: 'settings',
        noCache: true
      }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]
