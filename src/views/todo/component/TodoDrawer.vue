<template>
  <!-- 遮罩层 -->
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity"
      @click="$emit('update:modelValue', false)"
    ></div>
  </transition>

  <!-- 抽屉主体 -->
  <transition name="slide">
    <aside
      v-if="modelValue"
      class="fixed right-0 top-0 z-50 h-full w-[40vw] border-l border-cyan-500/30 bg-slate-900 shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-y-auto"
    >
      <!-- 头部 -->
      <div class="sticky top-0 z-10 border-b border-pink-500/50 bg-slate-900/95 p-6 backdrop-blur">
        <h2
          class="font-mono text-2xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
          Todo数据流
          <span class="text-xs text-cyan-500/70 ml-2">SYSTEM_Todo_V2.0</span>
        </h2>
        <button
          @click="$emit('update:modelValue', false)"
          class="absolute right-4 top-6 text-pink-500 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 内容区域 - 时间线 -->
      <div class="relative p-6">
        <!-- 时间线轴线 -->
        <div class="absolute left-8 top-0 h-full w-0.5 bg-slate-700"></div>

        <div v-if="todoList.length === 0" class="text-center py-10 text-slate-500 font-mono">
          [ 无Todo数据 ]
        </div>

        <div
          v-for="(todo, index) in sortedTodos"
          :key="todo.id"
          class="relative mb-10 pl-20 group"
        >
          <!-- 时间线节点 -->
          <div
            class="absolute left-6 top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-slate-900 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>

          <!-- 日志卡片 -->
          <div
            class="relative rounded border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <!-- 装饰角标 -->
            <div class="absolute -right-1 -top-1 h-2 w-2 border-r border-t border-cyan-500"></div>
            <div class="absolute -bottom-1 -left-1 h-2 w-2 border-l border-b border-pink-500"></div>

            <!-- 标题与操作 -->
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-mono text-lg font-bold text-cyan-100 truncate pr-4">
                {{ todo.title || '未命名Todo' }}
              </h3>
              <div class=" flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
<!--                <button @click="handleEdit(todo)"-->
<!--                        class="cursor-pointer text-xs font-bold text-pink-400 hover:text-white hover:underline">-->
<!--                  编辑-->
<!--                </button>-->
<!--                <button @click="handleDelete(todo)"-->
<!--                        class="cursor-pointer text-xs font-bold text-red-400 hover:text-white hover:underline">-->
<!--                  删除-->
<!--                </button>-->
              </div>
            </div>

            <!-- 描述 -->
            <p class="mb-4 text-sm text-slate-400 font-mono leading-relaxed border-l-2 border-slate-700 pl-3">
              {{ todo.todoGoal || '无详细描述' }}
            </p>

            <!-- 数据网格 -->
            <div class="grid grid-cols-2 gap-2 text-xs font-mono">
              <div class="flex justify-between border-b border-slate-700/50 pb-1">
                <span class="text-slate-500">状态:</span>
                <span class="text-pink-300">{{ todo.status || '-' }}</span>
              </div>
              <div class="flex justify-between border-b border-slate-700/50 pb-1 col-span-2">
                <span class="text-slate-500">截止时间</span>
                <span class="text-cyan-300/80">{{ formatDate(todo.deadline) }}</span>
              </div>
            </div>

            <!-- 隐藏字段展示 (可选，用于调试或详细查看) -->
            <div class="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-600 font-mono uppercase">
              <span v-if="todo.okrId" class="bg-slate-950 px-1 py-0.5 rounded">OKR_ID:{{ todo.okrId }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

// 定义 Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  todoList: {
    type: Array,
    default: () => []
  }
})

// 定义 Emits
const emit = defineEmits(['update:modelValue', 'edit', 'delete'])

// 计算属性：按时间倒序排列
const sortedTodos = computed(() => {
  return [...props.todoList].sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
})

// 方法
const handleEdit = (todo) => {
  emit('edit', todo)
}

const handleDelete = (todo) => {
  emit('delete', todo)
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return 'UNKNOWN'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 根据分数改变颜色
const getScoreColor = (score) => {
  if (!score) return 'text-slate-500'
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-cyan-400'
  return 'text-red-400'
}
</script>

<style scoped>
/* 简单的过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
