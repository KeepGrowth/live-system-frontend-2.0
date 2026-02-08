import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElMessage } from 'element-plus'

const useUserStore = defineStore('user', () => {
  // 用户认证token
  const token = ref('')
  // 用户信息
  const userInfo = ref({})

  // 用户登录方法
  const login = async (loginForm) => {
    const res = await api.post('/user/login', loginForm)
    token.value = res.data.data.token
    userInfo.value = res.data.data.userInfo
    return res
  }

  // 用户注册方法
  const register = async (registerForm) => {
    const res = await api.post('/user/register', registerForm)
    token.value = res.data.data.token
    return res
  }

  // 修改用户方法
  const updateUser = async (updateForm) => {
    const res = await api.post('/user/update', updateForm)
    return res
  }

  // 删除用户方法
  const deleteUser = async (userId) => {
    const res = await api.delete('/user/delete', {
      params: { userId }
    })
  }

  // 暴露给外部
  return {
    token,
    userInfo,
    login,
    register,
    updateUser,
    deleteUser
  }

}, {
  persist: true
})

export default useUserStore
