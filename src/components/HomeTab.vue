<template>
  <!--
    整体背景：
    - bg-slate-950: 极深的蓝灰色背景
    - min-h-screen: 占满全屏
    - text-cyan-50: 默认文字颜色为淡青色
    - font-mono: 使用等宽字体增加代码感/科技感
    - overflow-hidden: 防止出现滚动条（由内部滚动）
  -->
  <div class="cyber-container bg-slate-950 min-h-screen text-cyan-50 font-mono selection:bg-fuchsia-500 selection:text-white overflow-hidden relative">

    <!-- 背景网格装饰 (纯视觉效果) -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

    <!-- 顶部导航 -->
    <!-- border-b: 底部霓虹边框 -->
    <el-header class="cyber-header h-16 border-b border-cyan-500/50 bg-slate-900/80 backdrop-blur-md flex items-center z-10 relative shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      <el-menu
        :default-active="activeIndex"
        class="cyber-top-menu w-full !bg-transparent !border-none h-full flex items-center"
        mode="horizontal"
        :ellipsis="false"
        @select="redirect_to"
      >
        <el-menu-item index="goal" class="brand-item !px-6 group">
          <el-icon class="cyber-icon text-cyan-400 group-hover:text-fuchsia-400 transition-colors duration-300">
            <HomeFilled />
          </el-icon>
          <h1 class="cyber-title text-xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
            浮生录事
          </h1>
        </el-menu-item>

        <!-- 常用选项 -->
        <el-sub-menu class="cyber-sub hover:bg-cyan-900/20 rounded transition-all">
          <template #title>
            <span class="text-cyan-100 group-hover:text-white drop-shadow-md">常用选项</span>
          </template>
          <el-menu-item @click="openWeightDialog({})" class="!bg-slate-800 !text-cyan-300 hover:!bg-fuchsia-600 hover:!text-white border-l-2 border-cyan-500">
            更新体重
          </el-menu-item>
        </el-sub-menu>

        <!-- 用户信息 -->
        <el-sub-menu index="person" class="cyber-sub ml-auto hover:bg-cyan-900/20 rounded transition-all">
          <template #title>
            <span class="text-fuchsia-400 font-bold tracking-wider">{{ userStore.userInfo.username }}</span>
          </template>
          <el-menu-item index="2-1" class="!bg-slate-800 !text-cyan-300 hover:!bg-fuchsia-600 hover:!text-white border-l-2 border-fuchsia-500">个人中心</el-menu-item>
          <el-menu-item index="2-2" class="!bg-slate-800 !text-red-400 hover:!bg-red-600 hover:!text-white border-l-2 border-red-500">退出登录</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>

    <el-row class="cyber-row flex-1 overflow-hidden relative z-10">
      <!-- 侧边栏 -->
      <!-- 动态宽度处理：Tailwind 处理 el-col 的样式覆盖 -->
      <el-col :span="isCollapse?1:3" class="cyber-sidebar-col border-r border-cyan-500/30 bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
        <el-menu
          default-active="Work"
          class="cyber-side-menu !border-r-0 h-full !bg-transparent"
          :collapse="isCollapse"
          @select="redirect_to"
        >
          <!-- 事业 -->
          <el-sub-menu index="Work">
            <template #title>
              <el-icon class="cyber-icon text-yellow-400"><Coin /></el-icon>
              <span class="text-yellow-100 drop-shadow-[0_0_3px_rgba(250,204,21,0.8)]">事业</span>
            </template>
            <el-menu-item index="goal" class="!text-cyan-200 hover:!bg-cyan-900/40 hover:!text-white">目标管理</el-menu-item>
            <el-menu-item index="program" class="!text-cyan-200 hover:!bg-cyan-900/40 hover:!text-white">项目管理</el-menu-item>
            <el-menu-item index="okr" class="!text-cyan-200 hover:!bg-cyan-900/40 hover:!text-white">OKR管理</el-menu-item>
            <el-menu-item index="todo" class="!text-cyan-200 hover:!bg-cyan-900/40 hover:!text-white">Todo管理</el-menu-item>
            <el-menu-item index="project" class="!text-cyan-200 hover:!bg-cyan-900/40 hover:!text-white">IT项目管理</el-menu-item>
          </el-sub-menu>

          <!-- 收支 -->
          <el-sub-menu index="Finance">
            <template #title>
              <el-icon class="cyber-icon text-green-400"><List /></el-icon>
              <span class="text-green-100 drop-shadow-[0_0_3px_rgba(74,222,128,0.8)]">收支</span>
            </template>
            <el-menu-item index="2-1" class="!text-cyan-200 hover:!bg-green-900/40 hover:!text-white">支出管理</el-menu-item>
            <el-menu-item index="2-2" class="!text-cyan-200 hover:!bg-green-900/40 hover:!text-white">收入管理</el-menu-item>
          </el-sub-menu>

          <!-- 生活 -->
          <el-sub-menu index="Live">
            <template #title>
              <el-icon class="cyber-icon text-fuchsia-400"><ColdDrink /></el-icon>
              <span class="text-fuchsia-100 drop-shadow-[0_0_3px_rgba(232,121,249,0.8)]">生活</span>
            </template>
            <el-menu-item index="2-1" class="!text-cyan-200 hover:!bg-fuchsia-900/40 hover:!text-white">阅读管理</el-menu-item>
            <el-menu-item index="2-2" class="!text-cyan-200 hover:!bg-fuchsia-900/40 hover:!text-white">日记管理</el-menu-item>
            <el-menu-item index="weight" class="!text-cyan-200 hover:!bg-fuchsia-900/40 hover:!text-white">体重管理</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-col>

      <!-- 主内容区 -->
      <el-col :span="isCollapse?23:21" class="cyber-main-col p-4 overflow-y-auto custom-scrollbar">
        <!-- 内容面板：带切角边框效果 -->
        <div class="cyber-content-view min-h-full bg-slate-900/40 border border-cyan-500/30 rounded-sm relative p-1">
          <!-- 装饰角标 -->
          <div class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
          <div class="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400"></div>
          <div class="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400"></div>
          <div class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>

          <router-view class="h-full"></router-view>
        </div>
      </el-col>
    </el-row>

    <!-- 悬浮控制按钮 -->
    <div class="cyber-fab-container absolute bottom-8 right-8 z-50">
      <el-button
        class="cyber-fab-btn !bg-slate-900 !border-cyan-500 !text-cyan-400 hover:!bg-cyan-500 hover:!text-slate-900 hover:!shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300 !rounded-full !w-12 !h-12 !border-2"
        @click="isCollapse = !isCollapse"
      >
        <template #icon>
          <el-icon class="!text-lg"><ArrowLeft v-if="!isCollapse" /><ArrowRight v-else /></el-icon>
        </template>
      </el-button>
    </div>

    <!-- 保持原有的组件引用 -->
    <weight-dialog v-model="dialogVisible" @update:dialog-visible="handleDialogChange" :weight-form="weightForm" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, ArrowRight, Coin, ColdDrink, HomeFilled, List } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import WeightDialog from '@/views/weight/component/WeightDialog.vue'

// 用户状态
const userStore = useUserStore()
const activeIndex = ref('goal')
const isCollapse = ref(false)

// 路由跳转
const router = useRouter()
const redirect_to = (index: string) => {
  try {
    router.push({ name: index })
  } catch (err) {
    if ((err as Error).name !== 'NavigationDuplicated') {
      throw err
    }
  }
}

// 体重对话框
const dialogVisible = ref(false)
const weightForm = ref({})

const openWeightDialog = (weightItem:object) => {
  dialogVisible.value = true
  weightForm.value = weightItem
}

const handleDialogChange = (bool:boolean) => {
  dialogVisible.value = bool
}
</script>

<style scoped>
/* 自定义滚动条样式以匹配赛博朋克风格 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #0f172a; /* slate-900 */
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #0891b2; /* cyan-600 */
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #06b6d4; /* cyan-500 */
}

/* 覆盖 Element Plus 菜单的默认样式，使其透明化 */
:deep(.el-menu) {
  background-color: transparent !important;
  border: none !important;
}

:deep(.el-sub-menu__title) {
  color: #a5f3fc !important; /* cyan-200 */
  background-color: transparent !important;
}
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(6, 182, 212, 0.1) !important;
  color: #fff !important;
}

/* 修正侧边栏折叠时的样式 */
:deep(.el-menu--collapse) {
  width: 64px;
}
</style>
