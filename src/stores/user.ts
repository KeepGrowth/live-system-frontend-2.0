import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElMessage } from 'element-plus'
import utils from '@/utils/common.js'

interface UserInfo {
  birthday?: string;
  username: string;
  email?: string;
  gender: number;
  avatar?: string;
  role: number;
  status: number;
  statusDesc?: string;
  signature?: string;
  occupation?: string;
  industry?: string;
  city?: string;
  createTimeStr?: string;
  updateTimeStr?: string;
  nickname?: string;
  realname?: string


  // 其他用户字段，比如 name、id 等，按需添加
}

const useUserStore = defineStore('user', () => {

  // 用户认证token
  const token = ref('')
  // 用户信息
  const userInfo = ref<UserInfo>()

  // 用户登录方法
  const login = async (loginForm) => {
    const res = await api.post('/user/login', loginForm)
    if (res.data.code === 200) {
      token.value = res.data.data.token
      userInfo.value = res.data.data.userInfo
      return res
    }
    return res
  }

  // 用户注册方法
  const register = async (registerForm) => {
    const res = await api.post('/user/register', registerForm)
    if (res.data.code === 200) {
      token.value = res.data.data.token
    }
    return res
  }

  // 修改用户方法
  const updateUser = async (updateForm) => {
    const cleanParams = utils.cleanObject(updateForm)
    const res = await api.put('/user/info', cleanParams)
    return res
  }

  // 删除用户方法
  const deleteUser = async (userId) => {
    const res = await api.delete('/user/delete', {
      params: { userId }
    })
  }
  // 发送邮箱验证码请求
  const sendCode = async (registerForm) => {
    const res = await api.post('/send-email-code', registerForm)
    return res
  }

  // 清除登录状态
  const logout = async () => {
    // 1. 清空响应式变量的值
    token.value = ''
    userInfo.value = {
      username: '',
      gender: null, // 或者 0，取决于你的业务逻辑
      role: null,
      status: null     // 或者 null
    }
    localStorage.removeItem('user')
  }

  // 更新用户密码
  const updatePwd = async (oldPwd, newPwd) => {
    const res = await api.put('/user/pwd', {
      oldPassword: oldPwd,
      newPassword: newPwd
    })
    return res
  }

  // 获取单个用户信息
  const getUserById = async (userId) => {
    const res = await api.get(`/user/detail/${userId}`)
    return res
  }


  // 暴露给外部
  return {
    token,
    userInfo,
    login,
    register,
    updateUser,
    deleteUser,
    sendCode,
    getUserById,
    logout,
    updatePwd
  }

}, {
  persist: true
})

export default useUserStore
