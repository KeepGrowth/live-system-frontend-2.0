<script setup lang="ts">

import { Setting, SwitchButton, User } from '@element-plus/icons-vue'
import router from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'
import useUserStore from '@/stores/user'

const goToBackend = async () => {
  await router.push({ name: 'home' })
}
// 头像下拉对应方法
// 处理下拉菜单点击事件
const userStore = useUserStore()
const handleCommand = async (command: string) => {
  if (command === 'profile') {
    // 跳转到个人中心
    await router.push('/profile')
  } else if (command === 'settings') {
    // 跳转到设置页面
    await router.push('/settings')
  } else if (command === 'logout') {
    ElMessageBox.confirm(
      '您将退出登录，继续吗?',
      '注意',
      {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(async () => {
        ElMessage({
          type: 'success',
          message: '退出登录成功！'
        })
        // 处理退出登录
        await userStore.logout()
        await router.push('/login')
      })
      .catch(() => {
      })

  }
}
</script>

<template>
  <div>
    <nav
      class="sticky top-0 z-50 w-full border-b border-cyan-500/30 bg-slate-900/80 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">

        <!-- Logo (保持不变) -->
        <div class="flex items-center gap-2 group cursor-pointer" @click="goToBackend">
          <div
            class="w-8 h-8 bg-fuchsia-600 skew-x-[-12deg] flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(192,38,211,0.8)] transition-all duration-300">
            <span class="text-white font-bold text-xl skew-x-[12deg]">T</span>
          </div>
          <span
            class="text-2xl font-black tracking-wider italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
        浮生<span class="text-white glitch-text" data-text="'录事'">录事</span>
      </span>
        </div>

        <!-- 菜单区域 -->
        <div class="hidden md:flex gap-8 font-mono text-sm tracking-widest items-center">

          <!-- 1. 首页 (独立) -->
          <a href="/index"
             class="hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(192,38,211,0.8)] transition-all">
            首页
          </a>

          <!-- 2. 下拉菜单容器 -->
          <!-- group: 用于控制悬停状态 -->
          <!-- relative: 用于定位下拉列表 -->
          <div class="relative group">
            <!-- 触发按钮 -->
            <button
              class="cursor-pointer flex items-center gap-1 text-slate-300 hover:text-fuchsia-400 transition-all focus:outline-none">
              <span>事业</span>
              <!-- 小箭头图标，增加视觉提示 -->
              <svg class="w-3 h-3 transform group-hover:rotate-180 transition-transform duration-200" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- 下拉列表内容 -->
            <!-- 默认隐藏 (opacity-0 invisible)，悬停时显示 (group-hover:opacity-100 group-hover:visible) -->
            <div
              class="absolute left-0 mt-2 w-40 bg-slate-900/95 border border-cyan-500/30 rounded-md shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-xl overflow-hidden invisible opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
              <div class="py-1">
                <router-link to="/todo"
                             class="block px-4 py-2 text-sm text-slate-300 hover:bg-cyan-900/30 hover:text-fuchsia-400 transition-colors">
                  Todo
                </router-link>
                <router-link to="/okr"
                             class="block px-4 py-2 text-sm text-slate-300 hover:bg-cyan-900/30 hover:text-fuchsia-400 transition-colors">
                  OKR
                </router-link>
                <router-link to="/program"
                             class="block px-4 py-2 text-sm text-slate-300 hover:bg-cyan-900/30 hover:text-fuchsia-400 transition-colors">
                  项目
                </router-link>
                <router-link to="/goal"
                             class="block px-4 py-2 text-sm text-slate-300 hover:bg-cyan-900/30 hover:text-fuchsia-400 transition-colors">
                  目标
                </router-link>
                <router-link to="/review"
                             class="block px-4 py-2 text-sm text-slate-300 hover:bg-cyan-900/30 hover:text-fuchsia-400 transition-colors">
                  复盘
                </router-link>
              </div>
            </div>
          </div>
          <div class="relative group">
            <!-- 触发按钮 -->
            <button
              class="cursor-pointer flex items-center gap-1 text-slate-300 hover:text-fuchsia-400 transition-all focus:outline-none">
              <span>财务</span>
              <!-- 小箭头图标，增加视觉提示 -->
              <svg class="w-3 h-3 transform group-hover:rotate-180 transition-transform duration-200" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- 下拉列表内容 -->
            <!-- 默认隐藏 (opacity-0 invisible)，悬停时显示 (group-hover:opacity-100 group-hover:visible) -->
            <div
              class="absolute left-0 mt-2 w-40 bg-slate-900/95 border border-cyan-500/30 rounded-md shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-xl overflow-hidden invisible opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
              <div class="py-1">
                <router-link to="/finance"
                             class="block px-4 py-2 text-sm text-slate-300 hover:bg-cyan-900/30 hover:text-fuchsia-400 transition-colors">
                  收入与支出
                </router-link>
              </div>
            </div>
          </div>
          <div class="relative group">
            <!-- 触发按钮 -->
            <button
              class="cursor-pointer flex items-center gap-1 text-slate-300 hover:text-fuchsia-400 transition-all focus:outline-none">
              <span>圈子（开发中）</span>
              <!-- 小箭头图标，增加视觉提示 -->
              <svg class="w-3 h-3 transform group-hover:rotate-180 transition-transform duration-200" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- 下拉列表内容 -->
            <!-- 默认隐藏 (opacity-0 invisible)，悬停时显示 (group-hover:opacity-100 group-hover:visible) -->
            <div
              class="absolute left-0 mt-2 w-40 bg-slate-900/95 border border-cyan-500/30 rounded-md shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-xl overflow-hidden invisible opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
              <div class="py-1">
                <router-link to="#"
                             class="block px-4 py-2 text-sm text-slate-300 hover:bg-cyan-900/30 hover:text-fuchsia-400 transition-colors">
                  论坛
                </router-link>
              </div>
            </div>
          </div>

        </div>

        <!-- 登录按钮 (保持不变) -->
        <div class="user-profile-container">
          <el-dropdown trigger="click" @command="handleCommand" class="cursor-pointer">
            <div class="user-avatar-wrapper">
              <!-- 用户头像 -->
              <el-avatar
                :size="36"
                :src="userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                class="mr-2"
              />
            </div>

            <!-- 下拉菜单内容 -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon>
                    <User />
                  </el-icon>
                  <span>个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon>
                    <SwitchButton />
                  </el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

      </div>
    </nav>
  </div>

</template>

<style scoped>

</style>