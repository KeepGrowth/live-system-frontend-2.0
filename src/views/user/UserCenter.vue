<template>
  <div
    class="min-h-screen bg-slate-950 text-slate-200 font-rajdhani selection:bg-cyan-500 selection:text-black overflow-hidden relative">
    <!-- 背景装饰元素 -->
    <div
      class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400 z-50"></div>
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
      <div
        class="absolute top-[-10%] right-[-5%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px]"></div>
      <div
        class="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[100px]"></div>
    </div>

    <!-- 主容器 -->
    <main class="container mx-auto px-4 py-12 relative z-10 max-w-7xl">
      <!-- 顶部导航模拟 -->
      <header class="flex justify-between items-center mb-12 border-b border-slate-800 pb-4">
        <h1
          class="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 tracking-widest uppercase glitch-text"
          data-text="用户中心">
          用户中心
        </h1>
        <div class="flex items-center space-x-2 text-xs font-mono text-cyan-500/70">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <span>系统用户 :: ID: {{ user?.id?.toString().padStart(6, '0') }}</span>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- 左侧：头像与核心状态 -->
        <section class="lg:col-span-4 space-y-6">
          <!-- 头像卡片 -->
          <div class="relative group">
            <div
              class="absolute -inset-0.5 bg-gradient-to-br from-cyan-500 to-fuchsia-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div class="relative bg-slate-900 rounded-lg p-6 flex flex-col items-center border border-slate-800">
              <div class="relative w-32 h-32 mb-4">
                <div
                  class="absolute inset-0 border-2 border-cyan-500/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div
                  class="absolute inset-2 border border-fuchsia-500/50 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                <img :src="user.avatar" alt="Avatar"
                     class="cursor-pointer w-full h-full rounded-full object-cover border-4 border-slate-900 relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500">
              </div>
              <h2 class="text-2xl font-bold font-orbitron text-white uppercase tracking-wider">{{ user.nickname }}</h2>
              <p class="text-cyan-400 text-sm font-mono mt-1">@ {{ user.username }}</p>

              <div class="mt-6 w-full grid grid-cols-2 gap-2 text-xs font-mono">
                <div class="bg-slate-950/50 p-2 border border-slate-800 text-center">
                  <span class="block text-slate-500">系统角色</span>
                  <span class="text-yellow-400 font-bold">{{ formatRole(user.role) }}</span>
                </div>
                <div class="bg-slate-950/50 p-2 border border-slate-800 text-center">
                  <span class="block text-slate-500">账号状态</span>
                  <span :class="user.status === 1 ? 'text-emerald-400' : 'text-red-400'">
                    {{ user.status === 1 ? '正常' : '冻结' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 签名与状态描述 -->
          <div class="bg-slate-900/50 border-l-2 border-fuchsia-500 p-4 backdrop-blur-sm">
            <h3 class="text-xs font-bold text-fuchsia-400 uppercase mb-2 tracking-widest">账号状态</h3>
            <p class="text-sm text-slate-300 font-light leading-relaxed">
              {{ user.statusDesc || '账号正常使用' }}
            </p>
          </div>

          <div class="bg-slate-900/50 border-l-2 border-cyan-500 p-4 backdrop-blur-sm">
            <h3 class="text-xs font-bold text-cyan-400 uppercase mb-2 tracking-widest">个性签名</h3>
            <p class="text-sm text-slate-300 font-mono italic opacity-80">
              "{{ user.signature || '这个用户什么都没有留下...' }}"
            </p>
          </div>
        </section>

        <!-- 右侧：详细数据面板 -->
        <section class="lg:col-span-8">
          <div class="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl relative">
            <!-- 装饰性扫描线 -->
            <div
              class="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-20"></div>

            <div class="p-8 relative z-10">
              <div class="flex items-center mb-8 border-b border-slate-800 pb-2">
                <div class="w-2 h-6 bg-cyan-500 mr-3 skew-x-[-20deg]"></div>
                <h3 class="text-xl font-orbitron font-bold text-white uppercase tracking-widest">用户资料</h3>
              </div>

              <el-form :model="user" label-position="top" class="custom-dark-form">
                <!-- 基础信息 -->
                <el-row :gutter="32">
                  <el-col :xs="24" :md="12">
                    <el-form-item label="用户账号">
                      <el-input v-model="user.username" :prefix-icon="User" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="昵称">
                      <el-input v-model="user.nickname" :prefix-icon="Postcard" placeholder="请输入您的昵称" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="真实姓名">
                      <el-input v-model="user.realname" :prefix-icon="Postcard" placeholder="请填入您的真实姓名" />
                    </el-form-item>
                  </el-col>

                  <el-col :xs="24" :md="12">
                    <el-form-item label="邮箱">
                      <el-input v-model="user.email" :prefix-icon="Message" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="出生年月">
                      <el-date-picker
                        v-model="user.birthday"
                        type="date"
                        placeholder="选择您的出生年月"
                        style="width: 100%"
                        value-format="YYYY-MM-DD"
                        :prefix-icon="Calendar"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :xs="24" :md="12">
                    <el-form-item label="职业">
                      <el-input v-model="user.occupation" :prefix-icon="Suitcase" placeholder="程序员？还是？..." />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="行业">
                      <el-input v-model="user.industry" :prefix-icon="OfficeBuilding" placeholder="您处于什么行业？" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="个性签名">
                      <el-input v-model="user.signature" placeholder="请输入您的个性签名" />
                    </el-form-item>
                  </el-col>

                  <el-col :xs="24" :md="12">
                    <el-form-item :label="'城市:'+user.city">
                      <el-cascader
                        filterable
                        v-model="user.city"
                        :options="regionOptions"
                        :props="cascaderProps"
                        placeholder="点击更改省市区"
                        :prefix-icon="Location"
                        clearable
                        @change="handleRegionChange"
                      />
                    </el-form-item>
                  </el-col>

                  <!-- 性别选择 -->
                  <el-col :xs="24" :md="12">
                    <!-- 性别选择 -->
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                        <Icon name="gender" class="mr-2 text-fuchsia-500" />
                        性别
                      </label>
                      <div class="flex bg-slate-950 border border-slate-800 rounded p-1">
                        <button
                          type="button"
                          class="cursor-pointer"
                          @click="user.gender = 1"
                          :class="['flex-1 py-1 text-sm font-bold transition-all duration-300', user.gender === 1 ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(8,145,178,0.6)]' : 'text-slate-500 hover:text-slate-300']"
                        >
                          男
                        </button>
                        <button
                          type="button"
                          class="cursor-pointer"
                          @click="user.gender = 2"
                          :class="['flex-1 py-1 text-sm font-bold transition-all duration-300', user.gender === 2 ? 'bg-fuchsia-600 text-white shadow-[0_0_10px_rgba(192,38,211,0.6)]' : 'text-slate-500 hover:text-slate-300']"
                        >
                          女
                        </button>
                        <button
                          type="button"
                          class="cursor-pointer"
                          @click="user.gender = 0"
                          :class="['flex-1 py-1 text-sm font-bold transition-all duration-300', user.gender === 0 ? 'bg-fuchsia-600 text-white shadow-[0_0_10px_rgba(192,38,211,0.6)]' : 'text-slate-500 hover:text-slate-300']"
                        >
                          不展示
                        </button>
                      </div>
                    </div>
                  </el-col>

                  <!-- 提交按钮 -->
                  <el-col :span="24">
                    <div class="submit-wrapper">
                      <el-button type="warning" @click="pwdModalOpen=true">修改密码</el-button>
                      <el-button type="primary" @click="updateUser">提交更改</el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 底部时间戳 -->
            <div
              class="bg-slate-950 p-2 px-6 border-t border-slate-800 flex justify-between text-[10px] font-mono text-slate-600 uppercase">
              <span>注册于: {{ user.createTimeStr }}</span>
              <span>更近一次更新: {{ user.updateTimeStr }}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
    <!-- 赛博朋克修改密码模态框 -->
    <pwd-modal
      v-model="pwdModalOpen"
      @submit="updatePwd"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { OfficeBuilding, Postcard, Suitcase, User } from '@element-plus/icons-vue'
import { Calendar, Message } from '@icon-park/vue-next'
import { regionData, codeToText } from 'element-china-area-data'
import useUserStore from '@/stores/user.ts'
import { ElNotification } from 'element-plus'
import PwdModal from '@/views/user/component/PwdModal.vue'


const user = ref({})

// 辅助函数
const formatRole = (role) => {
  switch (role) {
    case 0:
      return 'USER'
    case 1:
      return 'ADMIN'
    case 2:
      return 'MODERATOR'
    default:
      return 'UNKNOWN'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return dateString.replace(' ', ' / ')
}

// ------------------------------------城市选择器------------------------------------
// 将数据赋值给级联选择器的 options
const regionOptions = ref(regionData)

// 配置级联选择器的属性
const cascaderProps = {
  expandTrigger: 'hover', // 鼠标悬停展开下级
  checkStrictly: false,   // 必须选到末级（区县），如果只想选到市可以设为 true
  emitPath: true         // 返回完整的各级菜单值组成的数组
}

// 处理选择变化
const handleRegionChange = (value) => {
  console.log('选中的编码数组:', value)
  if (value && value.length === 3) {
    // 使用 codeToText 将编码转换为中文名称
    const [provinceCode, cityCode, districtCode] = value
    const provinceName = codeToText[provinceCode]
    const cityName = codeToText[cityCode]
    const districtName = codeToText[districtCode]
    console.log(`您选择了：${provinceName} ${cityName} ${districtName}`)
    user.value.city = cityName
  }
}
// ------------------------------------生命周期------------------------------------
onMounted(() => {
  user.value = userStore.userInfo
})

// ------------------------------------CRUD------------------------------------
const userStore = useUserStore()
// 更新资料
const updateUser = async () => {
  const res = await userStore.updateUser(user.value)
  if (res.data.code === 200) {
    ElNotification.success({
      title: '成功',
      message: res.data.msg
    })
  } else {
    ElNotification.error({
      title: '失败',
      message: res.data.msg
    })
  }
}

// 打开修改密码模态框
const pwdModalOpen = ref(false)

// 修改密码
const updatePwd = async (pwdForm) => {
  const res = await userStore.updatePwd(pwdForm.oldPassword, pwdForm.newPassword)
  if (res.data.code === 200) {
    ElNotification.success({
      title: '成功',
      message: res.data.msg
    })
  } else {
    ElNotification.error({
      title: '失败',
      message: res.data.msg
    })
  }
}

// 更新头像
const updateAvatar = async () => {

}
</script>

<style scoped>
/* 自定义字体 */
.font-orbitron {
  font-family: 'Orbitron', sans-serif;
}

.font-rajdhani {
  font-family: 'Rajdhani', sans-serif;
}

/* 斜切按钮 */
.clip-path-slant {
  clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
}

/* 简单的故障文字效果 */
.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch-text::before {
  color: #f0f;
  z-index: -1;
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}

.glitch-text::after {
  color: #0ff;
  z-index: -2;
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% {
    clip-path: inset(20% 0 80% 0);
    transform: translate(-2px, 1px);
  }
  20% {
    clip-path: inset(60% 0 10% 0);
    transform: translate(2px, -1px);
  }
  40% {
    clip-path: inset(40% 0 50% 0);
    transform: translate(-2px, 2px);
  }
  60% {
    clip-path: inset(80% 0 5% 0);
    transform: translate(2px, -2px);
  }
  80% {
    clip-path: inset(10% 0 70% 0);
    transform: translate(-1px, 1px);
  }
  100% {
    clip-path: inset(30% 0 20% 0);
    transform: translate(1px, -1px);
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip-path: inset(10% 0 60% 0);
    transform: translate(2px, -1px);
  }
  20% {
    clip-path: inset(80% 0 5% 0);
    transform: translate(-2px, 2px);
  }
  40% {
    clip-path: inset(30% 0 20% 0);
    transform: translate(2px, 1px);
  }
  60% {
    clip-path: inset(15% 0 80% 0);
    transform: translate(-1px, -2px);
  }
  80% {
    clip-path: inset(55% 0 10% 0);
    transform: translate(1px, 2px);
  }
  100% {
    clip-path: inset(40% 0 30% 0);
    transform: translate(-2px, 1px);
  }
}
</style>
