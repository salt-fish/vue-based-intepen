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
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   redirect: '/documentation/index',
  //   children: [{
  //     path: 'index',
  //     component: _import('documentation/index'),
  //     name: 'documentation',
  //     meta: { title: '文档', icon: 'documentation', noCache: true }
  //   }]
  // }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    meta: { roles: ['admin'] }, // you can set roles in root nav
    children: [{
      path: 'index',
      component: _import('permission/index'),
      name: 'permission',
      meta: {
        title: '权限测试页',
        icon: 'lock',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }]
  },

  {
    path: '/userDetail',
    component: Layout,
    redirect: '/userDetail/index', //  /:id
    meta: {
      roles: ['editor']
    },
    children: [{
      path: 'index', //  /:id
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
      roles: ['editor']
    },
    children: [
      { path: 'chooseNurse', component: _import('services/nurse'), name: 'nurse', meta: { title: '选择护工', roles: ['editor'] }},
      { path: 'chooseService', component: _import('services/serviceLevel'), name: 'service-level', meta: { title: '选择服务档次', roles: ['editor'] }}
    ]
  },

  {
    path: '/relation',
    component: Layout,
    redirect: '/relation/index',
    meta: {
      roles: ['admin']
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
    path: '/management',
    component: Layout,
    redirect: 'noredirect',
    name: 'management',
    meta: {
      title: '人员管理',
      icon: 'component',
      roles: ['admin', 'nurse']
    },
    children: [
      { path: 'managePatient', component: _import('management/patient'), name: 'patient', meta: { title: '老人管理', roles: ['admin', 'nurse'] }},
      { path: 'manageNurse', component: _import('management/nurse'), name: 'nurse', meta: { title: '护士管理', roles: ['admin'] }}
    ]
  },

  {
    path: '/detail',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    meta: {
      roles: ['admin', 'nurse']
    },
    children: [
      { path: 'index_e_:elderId', component: _import('detail/elderDetail'), name: 'elderDetail', meta: { title: '查看老人信息', noCache: true }},
      { path: 'index_n_:nurseId', component: _import('detail/nurseDetail'), name: 'nurseDetail', meta: { title: '查看护工信息', noCache: true }}
    ]
  },

  {
    path: '/inspection',
    component: Layout,
    redirect: '/inspection/index',
    meta: {
      roles: ['admin', 'nurse']
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
    path: '/documentation',
    component: Layout,
    redirect: 'noredirect',
    name: 'documentation',
    meta: {
      title: '健康管理',
      icon: 'documentation',
      roles: ['admin', 'nurse']
    },
    children: [
      { path: 'medicallyExamin', component: _import('documentation/medicallyExamination'), name: 'medicallyExamination', meta: { title: '体检记录', roles: ['admin', 'nurse'] }},
      { path: 'advice', component: _import('documentation/advice'), name: 'advice', meta: { title: '医嘱', roles: ['admin', 'nurse'] }},
      { path: 'medicalRecord', component: _import('documentation/medicalRecord'), name: 'medicalRecord', meta: { title: '病历', roles: ['admin', 'nurse'] }}
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('svg-icons/index'),
      name: 'icons',
      meta: { title: '图标', icon: 'icon', noCache: true }
    }]
  },

  {
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    name: 'component-demo',
    meta: {
      title: '组件',
      icon: 'component'
    },
    children: [
      { path: 'tinymce', component: _import('components-demo/tinymce'), name: 'tinymce-demo', meta: { title: '富文本编辑器' }},
      { path: 'markdown', component: _import('components-demo/markdown'), name: 'markdown-demo', meta: { title: 'Markdown' }},
      { path: 'json-editor', component: _import('components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'JSON编辑器' }},
      { path: 'dnd-list', component: _import('components-demo/dndList'), name: 'dndList-demo', meta: { title: '列表拖拽' }},
      { path: 'splitpane', component: _import('components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'Splitpane' }},
      { path: 'avatar-upload', component: _import('components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: '头像上传' }},
      { path: 'dropzone', component: _import('components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'Dropzone' }},
      { path: 'sticky', component: _import('components-demo/sticky'), name: 'sticky-demo', meta: { title: 'Sticky' }},
      { path: 'count-to', component: _import('components-demo/countTo'), name: 'countTo-demo', meta: { title: 'CountTo' }},
      { path: 'mixin', component: _import('components-demo/mixin'), name: 'componentMixin-demo', meta: { title: '小组件' }},
      { path: 'back-to-top', component: _import('components-demo/backToTop'), name: 'backToTop-demo', meta: { title: '返回顶部' }}
    ]
  },

  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    meta: {
      title: '图表',
      icon: 'chart'
    },
    children: [
      { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboardChart', meta: { title: '键盘图表', noCache: true }},
      { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: '折线图', noCache: true }},
      { path: 'mixchart', component: _import('charts/mixChart'), name: 'mixChart', meta: { title: '混合图表', noCache: true }}
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table/complex-table',
    name: 'example',
    meta: {
      title: '综合实例',
      icon: 'example'
    },
    children: [
      {
        path: '/example/table',
        component: _import('example/table/index'),
        redirect: '/example/table/complex-table',
        name: 'Table',
        meta: {
          title: 'Table',
          icon: 'table'
        },
        children: [
          { path: 'dynamic-table', component: _import('example/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: '动态Table' }},
          { path: 'drag-table', component: _import('example/table/dragTable'), name: 'dragTable', meta: { title: '拖拽Table' }},
          { path: 'inline-edit-table', component: _import('example/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'Table内编辑' }},
          { path: 'tree-table', component: _import('example/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: '树形表格' }},
          { path: 'custom-tree-table', component: _import('example/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: '自定义树表' }},
          { path: 'complex-table', component: _import('example/table/complexTable'), name: 'complexTable', meta: { title: '综合Table' }}
        ]
      },
      { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'tab', meta: { title: 'Tab' }}
    ]
  },

  {
    path: '/form',
    component: Layout,
    redirect: 'noredirect',
    name: 'form',
    meta: {
      title: '表单',
      icon: 'form'
    },
    children: [
      { path: 'create-form', component: _import('form/create'), name: 'createForm', meta: { title: '创建表单', icon: 'table' }},
      { path: 'edit-form', component: _import('form/edit'), name: 'editForm', meta: { title: '编辑表单', icon: 'table' }}
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: '错误页面',
      icon: '404'
    },
    children: [
      { path: '401', component: _import('errorPage/401'), name: 'page401', meta: { title: '401', noCache: true }},
      { path: '404', component: _import('errorPage/404'), name: 'page404', meta: { title: '404', noCache: true }}
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'log', component: _import('errorLog/index'), name: 'errorLog', meta: { title: '错误日志', icon: 'bug' }}]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      { path: 'export-excel', component: _import('excel/exportExcel'), name: 'exportExcel', meta: { title: 'Export Excel' }},
      { path: 'export-selected-excel', component: _import('excel/selectExcel'), name: 'selectExcel', meta: { title: 'Export Selected' }},
      { path: 'upload-excel', component: _import('excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'Upload Excel' }}
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'Zip', icon: 'zip' },
    children: [{ path: 'download', component: _import('zip/index'), name: 'exportZip', meta: { title: 'Export Zip' }}]
  },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'index', component: _import('theme/index'), name: 'theme', meta: { title: '换肤', icon: 'theme' }}]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'index', component: _import('clipboard/index'), name: 'clipboardDemo', meta: { title: 'Clipboard', icon: 'clipboard' }}]
  // },

  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [{ path: 'index', component: _import('i18n-demo/index'), name: 'i18n', meta: { title: '国际化', icon: 'international' }}]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
