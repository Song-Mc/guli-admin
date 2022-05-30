import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/teacher',
    name: 'Dashboard',
    // 当前路由不再页面中显示
    hidden: true
  },

  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/list',
    name: 'Teacher',
    // title:路由显示的标题  icon：图标
    meta: { title: '讲师管理', icon: 'eye' },
    children: [
      {
        path: 'list',
        name: 'TeacherList',
        component: () => import('@/views/teacher/list'),
        meta: { title: '讲师列表', icon: 'table' }
      },
      {
        path: 'save',
        name: 'TeacherSave',
        component: () => import('@/views/teacher/form'),
        meta: { title: '添加讲师', icon: 'form' }
      },
      {
        path: 'edit/:tid', // 访问edit路由路径： /teacher/edit/1   那么就会被当前配置匹配，然后使用id接受1参数
        name: 'TeacherEdit',
        component: () => import('@/views/teacher/form'),
        meta: { title: '编辑讲师', icon: 'form' },
        hidden: true
      }
    ]
  },
  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/list',
    name: 'Subject',
    // title:路由显示的标题  icon：图标
    meta: { title: '课程分类管理', icon: 'eye' },
    children: [
      {
        path: 'list',
        name: 'SubjectList',
        component: () => import('@/views/subject/list'),
        meta: { title: '课程分类列表', icon: 'table' }
      },
      {
        path: 'import',
        name: 'SubjectImport',
        component: () => import('@/views/subject/import'),
        meta: { title: '导入课程分类', icon: 'form' }
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/list',
    name: 'Course',
    // title:路由显示的标题  icon：图标
    meta: { title: '课程管理', icon: 'eye' },
    children: [
      {
        path: 'list',
        name: 'CourseList',
        component: () => import('@/views/course/list'),
        meta: { title: '课程列表', icon: 'table' }
      },
      {
        path: 'form',
        name: 'CourseForm',
        component: () => import('@/views/course/form'),
        meta: { title: '发布课程', icon: 'form' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/create',
    name: 'Statistics',
    meta: { title: '统计分析' },
    children: [
      {
        path: 'create',
        name: 'StatisticsCreate',
        component: () => import('@/views/statistics/create'),
        meta: { title: '生成统计' }
      },
      {
        path: 'chart',
        name: 'StatisticsChart',
        component: () => import('@/views/statistics/chart'),
        meta: { title: '统计图表' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
