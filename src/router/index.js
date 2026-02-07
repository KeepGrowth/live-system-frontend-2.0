import { createRouter, createWebHistory } from 'vue-router'
import HomeTab from '@/components/HomeTab.vue'
import LoginPage from '@/views/LoginPage.vue'
import ProjectPage from '@/views/project/ProjectPage.vue'
import ProjectCate from '@/views/project/ProjectCate.vue'
import ProjectReview from '@/views/project/ProjectReview.vue'
import CustomerPage from '@/views/customer/CustomerPage.vue'
import CustomerCate from '@/views/customer/CustomerCate.vue'
import CustomerReview from '@/views/customer/CustomerReview.vue'
import GoalPage from '@/views/goal/GoalPage.vue'
import GoalCate from '@/views/goal/GoalCate.vue'
import GoalReview from '@/views/goal/GoalReview.vue'
import ExpensePage from '@/views/finance/ExpensePage.vue'
import ExpenseCate from '@/views/finance/ExpenseCate.vue'
import ExpenseReview from '@/views/finance/ExpenseReview.vue'
import IncomeReview from '@/views/finance/income/IncomeReview.vue'
import IncomeCate from '@/views/finance/income/IncomeCate.vue'
import ProgramPage from '@/views/program/ProgramPage.vue'
import ProgramCate from '@/views/program/ProgramCate.vue'
import ProgramReview from '@/views/program/ProgramReview.vue'
import UserPage from '@/views/user/UserPage.vue'
import UserCate from '@/views/user/UserCate.vue'
import UserReview from '@/views/user/UserReview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: HomeTab
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/home',
      name: 'home',
      component: HomeTab,
      children: [
        // IT项目管理路由
        {
          path: 'project',
          name: 'project',
          component: ProjectTab,
          children: [
            {
              path: 'info',
              name: 'ProjectPage',
              component: ProjectPage
            },
            {
              path: 'cate',
              name: 'ProjectCate',
              component: ProjectCate
            },
            {
              path: 'review',
              name: 'ProjectReview',
              component: ProjectReview
            }
          ]
        },
        // 客户信息管理路由
        {
          path: 'customer',
          name: 'customer',
          component: CustomerTab,
          children: [
            {
              path: 'info',
              name: 'CustomerPage',
              component: CustomerPage
            },
            {
              path: 'cate',
              name: 'CustomerCate',
              component: CustomerCate
            },
            {
              path: 'review',
              name: 'CustomerReview',
              component: CustomerReview
            }
          ]
        },
        // 目标信息管理路由
        {
          path: 'goal',
          name: 'GoalTab',
          component: GoalTab,
          children: [
            {
              path: 'info',
              name: 'GoalPage',
              component: GoalPage
            },
            {
              path: 'cate',
              name: 'GoalCate',
              component: GoalCate
            },
            {
              path: 'review',
              name: 'GoalReview',
              component: GoalReview
            }
          ]
        },
        // 支出信息管理路由
        {
          path: 'expense',
          name: 'ExpenseTab',
          component: ExpenseTab,
          children: [
            {
              path: 'info',
              name: 'ExpensePage',
              component: ExpensePage
            },
            {
              path: 'cate',
              name: 'ExpenseCate',
              component: ExpenseCate
            },
            {
              path: 'review',
              name: 'ExpenseReview',
              component: ExpenseReview
            }
          ]
        },
        // 收入信息管理路由
        {
          path: 'expense',
          name: 'IncomeTab',
          component: IncomeTab,
          children: [
            {
              path: 'info',
              name: 'IncomePage',
              component: IncomePage
            },
            {
              path: 'cate',
              name: 'IncomeCate',
              component: IncomeCate
            },
            {
              path: 'review',
              name: 'IncomeReview',
              component: IncomeReview
            }
          ]
        },
        // 项目信息管理路由
        {
          path: 'program',
          name: 'ProgramTab',
          component: ProgramTab,
          children: [
            {
              path: 'info',
              name: 'ProgramPage',
              component: ProgramPage
            },
            {
              path: 'cate',
              name: 'ProgramCate',
              component: ProgramCate
            },
            {
              path: 'review',
              name: 'ProgramReview',
              component: ProgramReview
            }
          ]
        },
        // 用户管理路由
        {
          path: 'user',
          name: 'UserTab',
          component: UserTab,
          children: [
            {
              path: 'info',
              name: 'UserPage',
              component: UserPage
            },
            {
              path: 'cate',
              name: 'UserCate',
              component: UserCate
            },
            {
              path: 'review',
              name: 'UserReview',
              component: UserReview
            }
          ]
        }
        // OKR管理路由
      ]
    }

  ]
})

export default router
