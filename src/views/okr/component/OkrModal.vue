<template>
  <!-- 遮罩层：使用 backdrop-blur 增加背景模糊感 -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto"
    @click="closeModal"
  >
    <!-- 模态框容器 -->
    <div
      class="relative w-full max-w-2xl m-4 rounded-lg border border-cyan-500/30 bg-slate-900 p-1 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
      @click.stop
    >
      <!-- 装饰性边角 (可选，增加赛博感) -->
      <div class="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-cyan-400"></div>
      <div class="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-fuchsia-400"></div>
      <div class="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-fuchsia-400"></div>
      <div class="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-cyan-400"></div>

      <!-- 内容区域 -->
      <div class="relative overflow-hidden rounded bg-slate-950 p-6">
        <!-- 背景网格纹理 (模拟全息投影感) -->
        <div
          class="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <!-- 头部 -->
        <div class="relative mb-6 flex justify-between items-start border-b border-cyan-900/50 pb-4">
          <div>
            <h2
              class="font-mono text-2xl font-bold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
              OKR 详情 #{{ data.id }}
            </h2>
            <p class="mt-1 font-mono text-xs text-fuchsia-400">PROGRAM ID: {{ data.programId }}</p>
          </div>
          <button
            @click="closeModal"
            class="group relative h-8 w-8 rounded border border-slate-700 text-slate-400 transition-colors hover:border-fuchsia-500 hover:text-fuchsia-500 hover:shadow-[0_0_10px_rgba(232,121,249,0.5)]"
          >
            <span class="absolute inset-0 flex items-center justify-center text-xl leading-none">×</span>
          </button>
        </div>

        <!-- 详情网格 -->
        <div class="relative grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- 目标名称 (Goal Name) -->
          <div class="col-span-2 group">
            <label
              class="mb-1 block font-mono text-xs uppercase tracking-wider text-slate-500 group-hover:text-cyan-400 transition-colors">
              关键结果标题
            </label>
            <div
              class="rounded border border-slate-800 bg-slate-900/50 p-3 font-mono text-sm text-cyan-100 shadow-inner">
              {{ data.krName || '未命名目标' }}
            </div>
          </div>

          <!-- 状态 (Status) -->
          <div>
            <label class="mb-1 block font-mono text-xs uppercase tracking-wider text-slate-500">状态 (Status)</label>
            <div class="flex items-center">
              <span
                :class="[
                  'rounded px-2 py-1 font-mono text-xs font-bold uppercase tracking-wider shadow-sm',
                  statusConfig[data.status].class
                ]"
              >
                <span class="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse"></span>
                {{ statusConfig[data.status].label }}
              </span>
            </div>
          </div>

          <!-- 用户 ID (User ID) -->
          <div>
            <label class="mb-1 block font-mono text-xs uppercase tracking-wider text-slate-500">
              负责人
            </label>
            <div class="flex items-center font-mono text-sm text-slate-300">
              <svg class="mr-2 h-4 w-4 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              UID-{{ data.userId }}
            </div>
          </div>

          <!-- 关键结果描述 (KR Desc) -->
          <div class="col-span-2">
            <label class="mb-1 block font-mono text-xs uppercase tracking-wider text-slate-500">
              详细描述
            </label>
            <div
              class="min-h-[80px] rounded border border-slate-800 bg-slate-900/30 p-3 font-mono text-sm leading-relaxed text-slate-400 overflow-hidden whitespace-nowrap text-ellipsis">
              {{ data.krDesc || '无详细描述信息。' }}
            </div>
          </div>

          <!-- 时间戳 -->
          <div>
            <label class="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-600">创建时间</label>
            <div class="font-mono text-xs text-slate-500">{{ formatDate(data.createTimeStr) }}</div>
          </div>
          <div>
            <label class="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-600">最后更新</label>
            <div class="font-mono text-xs text-slate-500">{{ formatDate(data.updateTimeStr) }}</div>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="relative mt-8 flex justify-end border-t border-slate-800 pt-4">
          <button
            @click="handleViewDetail"
            class="cursor-pointer group relative inline-flex items-center justify-center overflow-hidden rounded-none bg-cyan-950 px-6 py-2 font-mono text-sm font-bold uppercase text-cyan-400 transition-all hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
          >
            <span class="relative z-10 flex items-center">
              <svg class="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              查看详情
            </span>
            <!-- 扫描线动画装饰 -->
            <div
              class="absolute inset-0 -translate-y-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent transition-transform duration-700 group-hover:translate-y-full"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 定义 Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 对应数据库结构的对象
  data: {
    type: Object,
    default: () => ({
      id: 0,
      userId: 0,
      programId: 0,
      goalId: 0,
      krName: '',
      krDesc: '',
      status: 0,
      createTime: '',
      updateTime: ''
    })
  }
})

// 定义 Emits
const emit = defineEmits(['update:modelValue', 'view-detail'])

// 控制模态框显示
const isOpen = ref(props.modelValue)

// 监听 v-model 变化
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal
  }
)

// 关闭模态框
const closeModal = () => {
  emit('update:modelValue', false)
}

// 模拟查看详情逻辑
const handleViewDetail = () => {
  emit('view-detail', props.data)
  // 这里可以添加路由跳转逻辑
}

// 格式化日期 (简单实现)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('zh-CN', {
    hour12: false
  })
}

// 状态映射配置
const statusConfig = {
  0: { label: '未开始', class: 'bg-slate-800 text-slate-400 border border-slate-600' },
  1: {
    label: '进行中',
    class: 'bg-cyan-950 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
  },
  2: { label: '已完成', class: 'bg-emerald-950 text-emerald-400 border border-emerald-500/50' },
  3: { label: '已延期', class: 'bg-rose-950 text-rose-400 border border-rose-500/50 animate-pulse' }
}
</script>

<style scoped>
/* 自定义滚动条以匹配赛博风格 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #020617;
}

::-webkit-scrollbar-thumb {
  background: #083344;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #06b6d4;
}
</style>
