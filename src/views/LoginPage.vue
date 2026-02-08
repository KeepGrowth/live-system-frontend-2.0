<script setup>
import { ref, onMounted } from 'vue'
import useUserStore from '@/stores/user.js'
import { ElMessage, ElNotification } from 'element-plus'
import router from '@/router/index.js'
// 登录表单内容
const loginForm = ref({})

// 注册表单内容
const registerForm = ref({})

// 获取用户状态Pinia对象
const userStore = useUserStore()

// 登录注册状态切换
const isRegister = ref(false)

// 登录注册状态切换方法
const switchFunc = () => {
  isRegister.value = !isRegister.value
}

console.log('登录成功')
// 登录成功后跳转到home页面
const login = async (loginForm) => {
  try {
    const res = await userStore.login(loginForm)
    ElNotification({
      title: '登陆成功~',
      message: '欢迎回来~',
      type: 'success'
    })
    router.push({ name: 'home' })
  } catch (e) {
    ElNotification({
      title: '认证不通过~',
      message: '用户名或密码错误',
      type: 'error'
    })
  }


}
// 注册成功后，直接跳转到home界面
const register = async (registerForm) => {
  const res = await userStore.register(registerForm)
  ElNotification.success('注册成功，跳转到功能页~')
  await router.push({ name: 'home' })
}
</script>

<template>
  <el-row>
    <!--左侧系统封面-->
    <el-col :span="12" class="logo-container">
      <div class="logo-title">人生管理系统</div>
      <div class="logo-desc">
        喝醉了，她的梦，晚安。
      </div>
    </el-col>
    <!--右侧登录表单-->
    <el-col :span="12" class="form-container">
      <transition name="fade">
        <!--登录表单-->
        <el-col
          v-if="isRegister===false"
          class="user-form-container">
          <div class="form-title">请登录</div>
          <el-form :model="loginForm" label-width="auto">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginForm.password" />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="login-btn"
                @click="login(loginForm)"
              >登录
              </el-button>
            </el-form-item>
            <el-form-item style="display: flex;justify-content: flex-end">
              <el-button type="primary"
                         link
                         style="margin-top: 1rem"
                         @click="switchFunc"
              >还没有账号？去注册→
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!--注册表单-->
        <el-col
          class="user-form-container"
          v-else>
          <div class="form-title">请注册</div>
          <el-form :model="registerForm" label-width="auto">
            <el-form-item label="用户名">
              <el-input v-model="registerForm.username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="registerForm.password" />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="login-btn"
                @click="register(registerForm)"
              >注册
              </el-button>
            </el-form-item>
            <el-form-item style="display: flex;justify-content: flex-end">
              <el-button
                type="primary"
                link
                style="margin-top: 1rem"
                @click="isRegister=false"
              >已有账号？去登录→
              </el-button>
            </el-form-item>
          </el-form>

        </el-col>
      </transition>

    </el-col>
  </el-row>
</template>
<!--系统封面样式-->
<style scoped>
/* 封面样式 */
.logo-container {
  height: 100vh; /* 改为视口高度，适配所有屏幕 */
  width: 55%;
  /* 渐变背景，更有科技感 */
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 1%;
}

/* 装饰性圆形背景（可选，增加层次感） */
.logo-container::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1%;
  top: 100px;
  left: -150px;
}

.logo-container::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  bottom: 150px;
  right: -100px;
}

/* 系统标题 */
.logo-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1; /* 确保文字在装饰元素上方 */
}

/* 系统描述 */
.logo-desc {
  font-size: 18px;
  opacity: 0.9;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}
</style>

<style scoped>
/* 登陆表单样式 */
.form-container {
  height: 100vh; /* 使用视口高度，适配所有屏幕 */
  width: 30%;
  padding-left: 10vh;
  padding-right: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa; /* 柔和背景色 */
  border-left: 1px solid #e4e7ed; /* 左侧分割线 */
}

.user-form-container {
  padding: 10vh;
  background-color: #ffffff; /* 白色表单背景 */
  border-radius: 12px; /* 圆角 */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); /* 柔和阴影 */
}

/* 表单标题样式 */
.form-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 30px;
}

/* 表单输入框样式 */
.el-form-item {
  margin-bottom: 24px;
}

.el-input__wrapper {
  height: 44px;
  border-radius: 6px;
  box-shadow: none;
  border: 1px solid #dcdfe6;
}

.el-input__wrapper:hover {
  border-color: #c0c4cc;
}

.el-input__wrapper.is-focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

/* 登录按钮容器（关键：让按钮居中） */
.user-form-container .el-form-item:last-child {
  display: flex;
  justify-content: center;
}

/* 登录按钮样式 */
.login-btn {
  width: 30%;
  margin-left: 20vh;
  height: 44px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
}

</style>

<!--动画切换过度样式-->
<style scoped>
/* 过渡动画：淡入淡出（最常用） */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease; /* 过渡时长+缓动函数 */
}

.fade-enter-from { /* 进入前的初始状态 */
  opacity: 0;
}

.fade-leave-to { /* 离开后的最终状态 */
  opacity: 0;
}
</style>
