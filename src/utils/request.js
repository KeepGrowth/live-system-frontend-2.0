import axios from 'axios'
import router from '@/router/index.js'
import { ElNotification } from 'element-plus'

// 生产环境和开发环境请求不同API。
const baseURL =
  import.meta.env.DEV
    ? 'http://localhost:8080/api' // 开发环境
    : 'https://859707243.xyz:21355/api' // 生产环境

// const baseURL = process.env.NODE_ENV === 'development'
//   ? 'https://859707243.xyz:21355/api'  // 开发环境-本地地址
//   : 'https://859707243.xyz:21355/api' // 生产环境-线上地址（替换成你的真实地址）


// 1. 创建axios实例（只做基础配置，不在headers中写死Token）
const instance = axios.create({
  baseURL: baseURL,
  timeout: 100000,
  withCredentials: true
})

// 2. 添加请求拦截器，每次请求前动态注入最新Token
instance.interceptors.request.use(
  async (config) => {
    // 动态导入，避免初始化时就加载
    const useUserStore = (await import('@/stores/user')).default
    const userStore = useUserStore()
    let token = userStore.token
    if (token) {
      // 严格遵循 Flask-JWT-Extended 要求的格式
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 3. 添加响应拦截器，统一处理 401 错误
instance.interceptors.response.use(
  (response) => {
    // 如果响应成功（状态码在 2xx 范围内），直接返回响应
    return response
  },
  async (error) => {
    // 检查是否有响应对象，以及状态码是否为 401
    if (error.response && error.response.status === 401) {
      // --- 在这里处理 401 错误 ---
      ElNotification.error('登录已过期，请重新登录。')

      // 1. 清除本地存储的用户信息和 Token
      const useUserStore = (await import('@/stores/user')).default
      const userStore = useUserStore()
      await userStore.logout() // 假设你的 store 中有 logout action 来清除状态

      // 2. 跳转到登录页
      // 可以带上当前路由作为重定向参数，登录后跳回
      await router.push({
        path: '/login',
        query: { redirect: router.currentRoute.value.fullPath }
      })
    }
    // 将错误继续向下传递，让发起请求的地方也能捕获到
    return Promise.reject(error)
  }
)

// 导出配置完成的axios实例
export default instance
