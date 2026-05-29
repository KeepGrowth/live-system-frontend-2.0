import { createRouter, createWebHistory } from 'vue-router'
import useUserStore from '@/stores/user.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 数据首页
      path: '/index',
      name: 'index',
      component: () => import('@/views/Index.vue'),
      meta: { title: '浮生录事-首页' }
    },
    // 登录页面
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
      meta: { title: '浮生录事-登录注册' }
    },
    // 项目作战室
    {
      path: '/program',
      name: 'ProgramPage',
      component: () => import('@/views/program/ProgramPage.vue'),
      meta: { title: '浮生录事-项目档案' }
    },
    // 项目详情页
    {
      path: '/program/:id',
      name: 'ProgramDetail',
      props: true,
      component: () => import('@/views/program/ProgramDetail.vue'),
      meta: { title: '浮生录事-项目详情' }
    },
    // 待办作战室
    {
      path: '/todo',
      name: 'TodoPage',
      component: () => import('@/views/todo/TodoPage.vue'),
      meta: { title: '浮生录事-待办中心' }
    },
    // 目标作战室
    {
      path: '/goal',
      name: 'GoalPage',
      component: () => import('@/views/goal/GoalPage.vue'),
      meta: { title: '浮生录事-目标档案' }
    },
    // 目标详情页
    {
      path: '/goal/:id',
      name: 'GoalDetail',
      props: true,
      component: () => import('@/views/goal/GoalDetail.vue'),
      meta: { title: '浮生录事-目标详情' }
    },
    // OKR作战室
    {
      path: '/okr',
      name: 'OkrPage',
      component: () => import('@/views/okr/OkrPage.vue'),
      meta: { title: '浮生录事-OKR档案' }
    },
    // 复盘作战室
    {
      path: '/review',
      name: 'ReviewPage',
      component: () => import('@/views/review/ReviewPage.vue'),
      meta: { title: '浮生录事-复盘作战室' }
    },
    // 财务作战室
    {
      path: '/finance',
      name: 'FinancePage',
      component: () => import('@/views/finance/FinancePage.vue'),
      meta: { title: '浮生录事-财务作战室' }
    },
    // 个人中心
    {
      path: '/profile',
      name: 'UserCenter',
      component: () => import('@/views/user/UserCenter.vue'),
      meta: { title: '浮生录事-个人中心' }
    }

  ]
})

// 全局守卫
router.beforeEach((to, from) => {
  const userStore = useUserStore()
  const hasToken = !!userStore.token
  // 如果路由中有 meta.title 就使用，否则使用默认标题
  document.title = to.meta.title || '浮生录事'
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
