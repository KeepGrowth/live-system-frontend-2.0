<template>
  <div
    class="group relative overflow-hidden rounded-lg border border-cyan-500/30 bg-slate-900 p-6 text-slate-200 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:-translate-y-1"
  >
    <!-- 装饰性背景元素 -->
    <div
      class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-fuchsia-600/20 blur-2xl transition-opacity group-hover:opacity-75"></div>
    <div class="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-600/10 blur-2xl"></div>

    <!-- 顶部 Header: 日期与 ID -->
    <div
      class="relative z-10 mb-4 flex justify-between border-b border-slate-700/50 pb-2 font-mono text-xs tracking-widest text-cyan-500/80">
      <div class="flex items-center gap-2">
        <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
        ID: {{ id }}
      </div>
      <div class="flex items-center gap-1 text-fuchsia-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formattedDate }}
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- 左侧：分类信息 -->
      <div class="space-y-3">
        <div class="flex flex-col">
          <span class="mb-1 text-[10px] uppercase text-slate-500">一级分类</span>
          <span class="rounded bg-cyan-950/50 px-2 py-1 text-sm font-bold text-cyan-300 shadow-inner">
            {{ firstCateName || '无' }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="mb-1 text-[10px] uppercase text-slate-500">二级分类</span>
          <span class="font-mono text-xs text-slate-400">
            {{ secondCateName || '无' }}
          </span>
        </div>
      </div>

      <!-- 右侧：金额 (视觉重心) -->
      <div class="flex flex-col items-start justify-center md:items-end md:border-l md:border-slate-700/50 md:pl-4">
        <span class="mb-1 text-[10px] uppercase text-slate-500">收入金额</span>
        <div
          class="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          {{ formattedAmount }}￥
        </div>
      </div>
    </div>

    <!-- 底部：备注与操作 -->
    <div class="relative z-10 mt-6 flex items-end justify-between">
      <div class="max-w-[70%] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-400 italic">
        <span class="text-fuchsia-500/70">#备注:</span> {{ note || '没有相关备注' }}
      </div>

      <!-- 模拟操作按钮 -->
      <div class="flex gap-2">
        <button
          class="cursor-pointer rounded border border-cyan-500/30 bg-cyan-950/20 px-3 py-1 text-xs font-mono text-cyan-300 transition-colors hover:bg-cyan-500 hover:text-slate-900">
          编辑
        </button>
      </div>
    </div>

    <!-- 装饰性切角 -->
    <div class="absolute right-0 top-0 h-4 w-4 border-r border-t border-cyan-500/50"></div>
    <div class="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-fuchsia-500/50"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 定义 Props，对应图片中的字段
const props = defineProps({
  id: { type: [Number, String], required: true },
  user_id: { type: [Number, String], required: true },
  first_cate_id: { type: [Number, String], required: false },
  second_cate_id: { type: [Number, String], default: null },
  amount: { type: [Number, String], required: true },
  income_date: { type: String, required: true }, // 格式 YYYY-MM-DD
  note: { type: String, default: '' },
  create_time: { type: String, default: '' },
  update_time: { type: String, default: '' },

  // 额外的显示名称 Props (实际开发中可能通过字典映射)
  firstCateName: { type: String, default: 'General' },
  secondCateName: { type: String, default: '' }
})

// 格式化金额：保留两位小数，添加千分位
const formattedAmount = computed(() => {
  const num = parseFloat(props.amount)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

// 格式化日期：简单的 YYYY-MM-DD 展示，实际可使用 dayjs/date-fns
const formattedDate = computed(() => {
  return props.income_date
})
</script>

<style scoped>
/* 如果需要更复杂的赛博朋克字体，可以在这里引入 */
/* @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap'); */
</style>
