<template>
  <!-- 背景遮罩 -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto"
    @click="handleClose"
  >
    <!-- 模态框主体 -->
    <div
      class="relative w-full max-w-2xl transform rounded-none border border-cyan-500/50 bg-slate-950 p-1 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)] transition-all"
      @click.stop
    >
      <!-- 赛博朋克装饰角 (Top Left) -->
      <div class="absolute -top-[1px] -left-[1px] h-4 w-4 border-l-2 border-t-2 border-cyan-400"></div>
      <!-- 赛博朋克装饰角 (Top Right) -->
      <div class="absolute -top-[1px] -right-[1px] h-4 w-4 border-r-2 border-t-2 border-cyan-400"></div>
      <!-- 赛博朋克装饰角 (Bottom Left) -->
      <div class="absolute -bottom-[1px] -left-[1px] h-4 w-4 border-l-2 border-b-2 border-cyan-400"></div>
      <!-- 赛博朋克装饰角 (Bottom Right) -->
      <div class="absolute -bottom-[1px] -right-[1px] h-4 w-4 border-r-2 border-b-2 border-cyan-400"></div>

      <!-- 内容区域 -->
      <div class="relative overflow-hidden rounded-sm bg-slate-900/90 p-8">
        <!-- 顶部标题栏 -->
        <div class="mb-6 flex justify-between border-b border-slate-700 pb-4">
          <div>
            <h2 class="font-mono text-2xl font-bold uppercase tracking-widest text-white">
              <span class="text-cyan-400">OKR</span> 详情 // {{ okrData.krName }}
            </h2>
            <p class="mt-1 text-xs font-mono text-slate-500">ID: {{ okrData.id }} | PROG: {{ okrData.programId }}</p>
          </div>

          <button
            @click="handleClose"
            class="group flex h-10 w-10 items-center justify-center rounded-none border border-slate-600 text-slate-400 transition-all hover:border-fuchsia-500 hover:bg-fuchsia-500/10 hover:text-fuchsia-400 hover:shadow-[0_0_15px_rgba(217,70,239,0.4)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 详情网格 -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- 左侧列 -->
          <div class="space-y-5">
            <!-- 用户ID -->
            <div class="cursor-pointer group relative" @click="displayUser(okrData.user.id)">
              <label class="mb-1 block font-mono text-xs uppercase text-cyan-500/80">负责人 ID</label>
              <div
                class="rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-300 shadow-inner group-focus-within:border-cyan-400 group-focus-within:shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                {{ okrData?.user?.nickname }}
              </div>
            </div>
            <div class="group relative">
              <label class="mb-1 block font-mono text-xs uppercase text-cyan-500/80">关联项目</label>
              <div
                class="rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-300 shadow-inner group-focus-within:border-cyan-400 group-focus-within:shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                {{ okrData.programName }}
              </div>
            </div>
            <div class="group relative">
              <label class="mb-1 block font-mono text-xs uppercase text-cyan-500/80">关联目标</label>
              <div
                class="rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-300 shadow-inner group-focus-within:border-cyan-400 group-focus-within:shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                {{ okrData.goalName }}
              </div>
            </div>

            <!-- 状态 -->
            <div class="group relative">
              <label class="mb-1 block font-mono text-xs uppercase text-cyan-500/80">当前状态</label>
              <div class="flex items-center">
                <span
                  :class="[
                    'rounded px-2 py-1 font-mono text-xs font-bold uppercase tracking-wider',
                    getStatusColor(okrData.status)
                  ]"
                >
                  {{ getStatusText(okrData.status) }}
                </span>
                <div class="ml-3 h-1 flex-1 bg-slate-800">
                  <div class="h-full bg-cyan-500" :style="{ width: getProgressWidth(okrData.status) }"></div>
                </div>
              </div>
            </div>

            <!-- 创建时间 -->
            <div class="group relative">
              <label class="mb-1 block font-mono text-xs uppercase text-cyan-500/80">创建时间</label>
              <div
                class="flex items-center rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4 text-slate-600" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatDate(okrData.createTimeStr) }}
              </div>
            </div>
          </div>

          <!-- 右侧列 -->
          <div class="space-y-5">
            <!-- 关键结果名称 -->
            <div class="group relative">
              <label class="mb-1 block font-mono text-xs uppercase text-fuchsia-500/80">关键结果</label>
              <h3
                class="rounded border border-slate-700 bg-slate-950/50 px-3 py-2 text-lg font-bold text-white shadow-[inset_0_0_20px_rgba(217,70,239,0.1)]">
                {{ okrData.krName }}
              </h3>
            </div>

            <!-- 描述 -->
            <div class="group relative">
              <label class="mb-1 block font-mono text-xs uppercase text-fuchsia-500/80">详细描述</label>
              <div
                class="min-h-[100px] rounded border border-slate-700 bg-slate-950/50 p-3 text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                {{ okrData.krDesc || '暂无详细描述' }}
              </div>
            </div>

            <!-- 更新时间 -->
            <div class="text-right">
              <p class="font-mono text-[10px] text-slate-600">LAST UPDATE: {{ formatDate(okrData.updateTimeStr) }}</p>
            </div>
          </div>
        </div>

        <!-- 底部装饰条 -->
        <div
          class="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500"></div>
      </div>
    </div>
    <user-modal
      v-model="userModalOpen"
      :user="okrData.user" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import UserModal from '@/views/user/component/UserModal.vue'
import useUserStore from '@/stores/user.js'

// 定义 Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 对应图片中的字段结构
  data: {
    type: Object,
    default: () => ({
      id: 0,
      userId: 0,
      user: {},
      programId: 0,
      programName: '',
      goalName: '',
      goalId: 0,
      krName: '',
      krDesc: '',
      status: 0,
      createTimeStr: '',
      updateTimeStr: ''
    })
  }
})

// 定义 Emits
const emit = defineEmits(['update:modelValue', 'close'])

// 控制模态框显示
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 用户详情模态框
const userModalOpen = ref(false)
const displayUserInfo = ref({})
const userStore = useUserStore()
const displayUser = async (userId) => {
  userModalOpen.value = true
  const res = await userStore.getUserById(userId)
  displayUserInfo.value = res.data.data
}

// 关闭处理
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

// 格式化日期 (简单模拟)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 状态映射
const getStatusText = (status) => {
  const states = ['未开始', '进行中', '已完成', '已延期', '已归档']
  return states[status] || '未知'
}

const getStatusColor = (status) => {
  switch (status) {
    case 0:
      return 'bg-slate-700 text-slate-300 border border-slate-600'
    case 1:
      return 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
    case 2:
      return 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/50'
    case 3:
      return 'bg-red-900/30 text-red-400 border border-red-500/50 animate-pulse'
    default:
      return 'bg-slate-800 text-slate-400'
  }
}

// 模拟进度条宽度
const getProgressWidth = (status) => {
  if (status === 2) return '100%'
  if (status === 1) return '60%'
  if (status === 3) return '80%'
  return '10%'
}

// 为了模板中使用方便，做一个别名
const okrData = ref(props.data)

watch(
  () => props.data, (newVal) => {
    okrData.value = newVal
  }, {
    deep: true
  }
)
</script>

<style scoped>
/* 添加一点故障文字效果的简单CSS */
h2:hover {
  text-shadow: 2px 0 #f0f, -2px 0 #0ff;
}
</style>
