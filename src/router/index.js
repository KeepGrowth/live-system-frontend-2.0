import { createRouter, createWebHistory } from 'vue-router'
import HomeTab from '@/components/HomeTab.vue'
import ProgramPage from '@/views/program/ProgramPage.vue'
import useUserStore from '@/stores/user.js'
import Index from '@/views/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 数据首页
      path: '/index',
      name: 'index',
      component: () => import('@/views/index.vue')
    },
    // 登录页面
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginPage.vue')
    },
    // 项目作战室
    {
      path: '/program',
      name: 'ProgramPage',
      component: () => import('@/views/program/ProgramPage.vue')
    },
    // 项目详情页
    {
      path: '/program/:id',
      name: 'ProgramDetail',
      props: true,
      component: () => import('@/views/program/ProgramDetail.vue')
    },
    // todo作战室
    {
      path: '/todo',
      name: 'TodoPage',
      component: () => import('@/views/todo/TodoPage.vue')
    },
    // 目标作战室
    {
      path: '/goal',
      name: 'GoalPage',
      component: () => import('@/views/goal/GoalPage.vue')
    },
    // 目标详情页
    {
      path: '/goal/:id',
      name: 'GoalDetail',
      props: true,
      component: () => import('@/views/goal/GoalDetail.vue')
    },
    // OKR作战室
    {
      path: '/okr',
      name: 'OkrPage',
      component: () => import('@/views/okr/OkrPage.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: HomeTab,
      children: [
        // 项目信息管理路由
        // {
        //   path: 'info',
        //   name: 'ProgramPage',
        //   component: ProgramPage
        // }
      ]
    }

  ]
})

// 全局守卫
router.beforeEach((to, from) => {
  const userStore = useUserStore()
  const hasToken = !!userStore.token

  // 如果没有 Token，且访问的不是登录页，则重定向到登录页
  if (!hasToken) {
    if (to.path !== '/') {
      return {
        path: '/',
        query: { redirect: to.fullPath }
      }
    }
    // 如果没有 Token 且就在登录页，则放行（允许登录）
    return true
  }

  // 如果有 Token，且访问的是登录页，则重定向到首页（避免已登录用户看登录页）
  if (hasToken && to.path === '/') {
    return { path: '/index' } // 或者 '/home'，根据你的需求
  }

  // 其他情况放行
  return true
})
export default router
