<template>
  <div
    class="min-h-screen w-full flex items-center justify-center relative text-white font-sans selection:bg-purple-500 selection:text-white overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div
        class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div
        class="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div
        class="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      <!-- 噪点纹理叠加 -->
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30"></div>
    </div>
    <!-- 主容器 -->
    <div
      class="glass-panel w-full max-w-5xl h-[600px] rounded-2xl flex overflow-hidden relative m-4 transition-all duration-500 hover:shadow-purple-500/20 hover:shadow-2xl">

      <!-- 左侧：品牌与文案区 -->
      <div class="w-1/2 relative hidden md:flex flex-col justify-between p-12 z-20 overflow-hidden group">
        <!-- 装饰性渐变背景 -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-slate-900/90 z-0 transition-transform duration-700 group-hover:scale-105"></div>

        <!-- 装饰线条 -->
        <div
          class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-50"></div>

        <!-- 内容 -->
        <div class="relative z-10">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <i class="text-purple-300 text-xl">浮</i>
            </div>
            <h1
              class="text-2xl font-serif tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
              浮生录事
            </h1>
          </div>
          <h2 class="text-4xl font-serif font-bold leading-tight mb-4">
            掌控时间<br>
            <span class="text-purple-300">重塑生命</span>
          </h2>
          <p class="text-slate-300 text-sm leading-relaxed max-w-xs">
            在这里找回你人生的掌控感，记录所有花费的时间，直到你不断的成为一个又一个自己想成为的人。
          </p>
        </div>

        <!-- 底部装饰 -->
        <div class="relative z-10 flex space-x-2">
          <div class="w-12 h-1 rounded-full bg-purple-500"></div>
          <div class="w-4 h-1 rounded-full bg-white/20"></div>
          <div class="w-4 h-1 rounded-full bg-white/20"></div>
        </div>

        <!-- 背景文字水印 -->
        <div
          class="absolute -bottom-10 -right-10 text-[120px] font-serif font-bold text-white/5 select-none pointer-events-none">
          浮生
        </div>
      </div>

      <!-- 右侧：表单切换区 -->
      <div class="w-full md:w-1/2 relative z-20 bg-slate-900/50 flex flex-col justify-center p-10 md:p-12">

        <!-- 切换按钮 (Tabs) -->
        <div class="absolute top-8 right-8 flex space-x-4 text-sm font-medium">
          <button
            @click="switchTab('login')"
            :class="activeTab === 'login' ? 'text-white border-purple-500' : 'text-slate-400 border-transparent hover:text-white'"
            class="border-b-2 pb-1 transition-colors outline-none"
          >
            登录
          </button>
          <button
            @click="switchTab('register')"
            :class="activeTab === 'register' ? 'text-white border-purple-500' : 'text-slate-400 border-transparent hover:text-white'"
            class="border-b-2 pb-1 transition-colors outline-none"
          >
            注册
          </button>
        </div>

        <!-- 容器：用于包裹两个表单 -->
        <div class="relative w-full h-[400px] overflow-hidden mt-8">

          <!-- 登录表单 -->
          <form
            class="absolute top-0 left-0 w-full h-full flex flex-col justify-center transition-all duration-500 ease-in-out transform"
            :class="activeTab === 'login' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'"
          >
            <h3 class="text-2xl font-bold mb-6 text-white">欢迎回来</h3>

            <div class="space-y-5">
              <div class="group">
                <label class="block text-xs text-slate-400 mb-1 ml-1">用户名</label>
                <div class="relative">
                  <el-input
                    v-model="loginForm.username"
                    placeholder="请输入你的用户名"
                    class="dark-mode-input"
                  />
                </div>
              </div>

              <div class="group">
                <label class="block text-xs text-slate-400 mb-1 ml-1">密码</label>
                <div class="relative">
                  <el-input
                    v-model="loginForm.password"
                    type="password"
                    :show-password="true"
                    placeholder="••••••••"
                    class="dark-mode-input"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-4">
              <a href="#" class="text-xs text-slate-400 hover:text-purple-300 transition-colors">忘记密码？</a>
            </div>

            <button type="button"
                    @click="login"
                    class=" cursor-pointer mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/30 transform transition hover:-translate-y-0.5 active:scale-95">
              进入系统
            </button>
          </form>

          <!-- 注册表单 -->
          <form
            class="absolute top-0 left-0 w-full h-full flex flex-col justify-center transition-all duration-500 ease-in-out transform"
            :class="activeTab === 'register' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'"
          >
            <h3 class="text-2xl font-bold mb-6 text-white">开启旅程</h3>

            <div class="space-y-4">
              <div class="group">
                <label class="block text-xs text-slate-400 mb-1 ml-1">设置账号</label>
                <div class="relative">
                  <el-input
                    v-model="registerForm.username"
                    placeholder="请输入用户名"
                    class="dark-mode-input"
                  />
                </div>
              </div>

              <div class="group">
                <label class="block text-xs text-slate-400 mb-1 ml-1">电子邮箱</label>
                <div class="relative flex">
                  <el-input
                    v-model="registerForm.email"
                    class="dark-mode-input"
                    placeholder="请输入电子邮箱"
                    type="email"
                  />
                  <el-button
                    class="ml-2"
                    type="success"
                    @click="sendCode"
                    v-if="isSend===false"
                  >
                    发送验证码
                  </el-button>
                  <el-button
                    class="ml-2"
                    v-else
                    type="warning"
                    v-prevent-re-click="30000"
                  >点击重新发送
                  </el-button>

                </div>
              </div>
              <div class="group" v-if="isSend===true">
                <label class="block text-xs text-slate-400 mb-1 ml-1">请输入验证码</label>
                <div class="relative">
                  <el-input
                    v-model="registerForm.code"
                    class="dark-mode-input"
                  />
                </div>
              </div>
              <div class="group">
                <label class="block text-xs text-slate-400 mb-1 ml-1">设置密码</label>
                <div class="relative">
                  <el-input
                    v-model="registerForm.password"
                    show-password
                    placeholder="请输入密码"
                    type="password"
                    class="dark-mode-input"
                  />
                </div>
              </div>

              <button
                @click="register"
                class="cursor-pointer mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transform transition hover:-translate-y-0.5 active:scale-95">
                立即注册
              </button>
            </div>
          </form>

        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import useUserStore from '@/stores/user.js'
import { ElNotification } from 'element-plus'
import router from '@/router/index.js'

// 用户状态管理
const userStore = useUserStore()

// 状态管理
const activeTab = ref('login')

// 切换逻辑
const switchTab = (tab) => {
  activeTab.value = tab
}

// 登录注册逻辑
const loginForm = ref({
  username: '',
  password: ''
})
const registerForm = ref({
  username: '',
  password: '',
  email: ''
})
// 点击登录进入系统方法
const login = async () => {
  const res = await userStore.login(loginForm.value)
  console.log(res.data)
  if (res.data.code === 200) {
    ElNotification.success({
      goalName: res.data.msg,
      message: '即将跳转到首页'
    })
    await router.push({ name: 'index' })
  } else {
    ElNotification.error({
      goalName: '状态码：' + res.data.code,
      message: res.data.msg
    })
  }
}

// 注册方法
const register = async () => {
  // 发送验证码→核对→注册成功
  const res = await userStore.register(registerForm.value)
  if (res.data.code === 200) {
    ElNotification.success({
      message: res.data.msg
    })
    await router.push({ name: 'index' })
  } else {
    ElNotification.error({
      message: res.data.msg
    })
  }
}
// 邮箱注册方法
const isSend = ref(false)
const sendCode = async () => {
  isSend.value = true
  const res = await userStore.sendCode(registerForm.value)
  if (res.data.code === 200) {
    ElNotification.success({
      goalName: res.data.msg,
      message: '请输入验证码后点击注册'
    })
  } else {
    ElNotification.error({
      goalName: '状态码：' + res.data.code,
      message: res.data.msg
    })
  }
}
</script>

<style scoped>
/* 引入字体 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Inter:wght@300;400;600&display=swap');

/* 基础设置 */
body {
  background-color: #0f172a;
  overflow: hidden;
}

/* 玻璃拟态增强 */
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.input-field:focus {
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
}

/* 动画定义 */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

</style>
