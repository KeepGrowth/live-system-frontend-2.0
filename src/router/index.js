import { createRouter, createWebHistory } from 'vue-router'
import HomeTab from '@/components/HomeTab.vue'
import LoginPage from '@/views/LoginPage.vue'


import GoalPage from '@/views/goal/GoalPage.vue'
import GoalCate from '@/views/goal/GoalCate.vue'
import GoalReview from '@/views/goal/GoalReview.vue'
import ExpensePage from '@/views/finance/ExpensePage.vue'
import ExpenseCate from '@/views/finance/ExpenseCate.vue'
import ExpenseReview from '@/views/finance/ExpenseReview.vue'
import IncomeReview from '@/views/finance/income/IncomeReview.vue'
import IncomeCate from '@/views/finance/income/IncomeCate.vue'
import ProgramPage from '@/views/program/ProgramPage.vue'
import ProgramReview from '@/views/program/ProgramReview.vue'
import useUserStore from '@/stores/user.js'
import GoalTab from '@/views/goal/component/GoalTab.vue'
import OkrPage from '@/views/okr/OkrPage.vue'
import OkrTab from '@/views/okr/component/OkrTab.vue'
import TodoTab from '@/views/todo/component/TodoTab.vue'
import TodoPage from '@/views/todo/TodoPage.vue'
import WeightTab from '@/views/weight/component/WeightTab.vue'
import WeightPage from '@/views/weight/WeightPage.vue'
import Index from '@/views/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 数据首页
      path: '/',
      name: 'index',
      component: Index
    },
    // 登录页面
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    // 项目详情页
    {
      path: '/program/:id',
      name: 'ProgramDetail',
      props:true,
      component: () => import('@/views/program/ProgramDetail.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: HomeTab,
      children: [
        // // 项目信息管理路由
        {
          path: 'info',
          name: 'ProgramPage',
          component: ProgramPage
        }
      ]
    }

  ]
})

// 全局守卫
router.beforeEach((to, from) => {
  const userStore = useUserStore()

  // 1. 严谨的白名单判断：精确匹配登录页路径
  const whiteList = ['/login'] // 可以扩展其他无需登录的页面，比如 /register
  if (whiteList.includes(to.path)) {
    // 调试用（可选）：生产环境删除 console.log
    console.log('白名单页面，直接放行：', to.path)
    return true
  }

  // 2. 校验 token：覆盖空字符串、undefined、null 等情况
  const hasToken = !!userStore.token // 转为布尔值，统一判断逻辑
  if (!hasToken) {
    console.log('无token，跳转到登录页')
    return {
      path: '/login',
      query: { redirect: to.fullPath } // 记录原目标路径，登录后可回跳
    }
  }

  // 3. 有有效 token，允许跳转
  return true
})
export default router
