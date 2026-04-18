<template>


  <!-- 卡片网格 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="goalTask in goalList"
      :key="goalTask.id"
      class="group relative bg-slate-900/80 border border-slate-700 p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-sm"
      :class="getStatusColor(goalTask.goalStatus)"
    >
      <!-- 装饰角标 -->
      <div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500 opacity-50"></div>
      <div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-fuchsia-500 opacity-50"></div>

      <!-- 状态标签 -->
      <div class="flex justify-between items-start mb-4">
          <span
            class="text-[10px] uppercase border px-2 py-0.5 rounded-none tracking-wider"
            :class="getStatusLabel(goalTask.goalStatus).color"
          >
            {{ getStatusLabel(goalTask.goalStatus).text }}
          </span>
        <span class="text-xs text-slate-500 font-bold">ID: {{ goalTask.id }}</span>
      </div>

      <!-- 标题 -->
      <h3
        class="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1"
        :title="goalTask.goalName"
      >
        {{ goalTask.goalName }}
      </h3>

      <!-- 目标简述 -->
      <p
        class="text-sm text-slate-400 mb-4 line-clamp-2 h-10 border-l-2 border-slate-800 pl-2 group-hover:border-cyan-500/30 transition-colors"
      >
        {{ goalTask.description || '无详细描述' }}
      </p>

      <!-- 数据网格 -->
      <div class="grid grid-cols-2 gap-2 text-xs mb-6 font-mono">
        <div class="flex flex-col">
          <span class="text-slate-600 text-[10px] uppercase">开始</span>
          <span class="text-fuchsia-400">{{ goalTask.startDate || 'N/A' }}</span>
        </div>
        <div class="flex flex-col text-right">
          <span class="text-slate-600 text-[10px] uppercase">结束</span>
          <span class="text-cyan-400">{{ goalTask.endDate || '等待完成' }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-slate-600 text-[10px] uppercase">满意度评分</span>
          <span class="text-emerald-400">{{ goalTask.satisfactionScore || '暂无' }}</span>
        </div>
        <div class="flex flex-col text-right">
          <span class="text-slate-600 text-[10px] uppercase">关联项目数</span>
          <span class="text-emerald-400">{{ goalTask.programList?.length || 0 }}</span>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="flex justify-between items-center border-t border-slate-800 pt-4 mt-2">
        <div class="text-[10px] text-slate-600">
          目标分类: <span class="text-slate-400">{{ goalTask.goalCategory?.categoryName || '--' }}</span>
        </div>
        <div class="flex gap-2">
          <button
            @click="goToDetail(goalTask.id)"
            class="cursor-pointer text-xs bg-slate-800 hover:bg-green-900 hover:text-cyan-400 border border-transparent hover:border-cyan-500 px-3 py-1 transition-all"
          >
            详情
          </button>
          <button
            @click="handleEdit(goalTask)"
            class="cursor-pointer text-xs bg-slate-800 hover:bg-cyan-900 hover:text-cyan-400 border border-transparent hover:border-cyan-500 px-3 py-1 transition-all"
          >
            编辑
          </button>
          <button
            @click="handleDelete(goalTask.id)"
            v-if="!goalTask.programList || goalTask.programList.length === 0"
            class="cursor-pointer text-xs bg-slate-800 hover:bg-red-900/50 hover:text-red-400 border border-transparent hover:border-red-500 px-3 py-1 transition-all"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessageBox } from 'element-plus'

// Props 定义
const props = defineProps({
  goalList: {
    type: Array,
    default: () => []
  }
})

// Emits 定义
const emit = defineEmits(['edit', 'delete'])

// 状态颜色映射
const getStatusColor = (status) => {
  // 这里可以根据具体状态返回不同的边框或阴影颜色
  // 默认返回空，或者根据需求添加逻辑，例如：
  // if (status === 'CRITICAL') return 'border-l-4 border-l-red-500';
  return ''
}

// 状态标签映射
const getStatusLabel = (status) => {
  const map = {
    1: { text: '进行中', color: 'border-yellow-500/30 text-yellow-400 bg-yellow-950/30' },
    0: { text: '待开始', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/30' },
    2: { text: '已完成', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/30' },
    3: { text: '已放弃', color: 'border-red-500/30 text-red-400 bg-red-950/30' }
  }
  return map[status] || { text: status || '未知', color: 'border-slate-500/30 text-slate-400' }
}

// 处理编辑
const handleEdit = (goal) => {
  emit('edit', goal)
}

// 处理删除
const handleDelete = (id) => {

  emit('delete', id)

}
</script>

<style scoped>
/* 补充原代码中引用的自定义效果样式 */
.text-shadow-lg {
  text-shadow: 0 4px 12px rgba(250, 204, 21, 0.5);
}

.glitch-text {
  position: relative;
  display: inline-block;
}

/* 简单的故障文字动画模拟 */
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
  color: #0ff;
  z-index: -1;
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}

.glitch-text::after {
  color: #f0f;
  z-index: -2;
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% {
    clip-path: inset(20% 0 80% 0);
    transform: translate(-2px, 0);
  }
  20% {
    clip-path: inset(60% 0 10% 0);
    transform: translate(2px, 0);
  }
  40% {
    clip-path: inset(40% 0 50% 0);
    transform: translate(-2px, 0);
  }
  60% {
    clip-path: inset(80% 0 5% 0);
    transform: translate(2px, 0);
  }
  80% {
    clip-path: inset(10% 0 70% 0);
    transform: translate(-2px, 0);
  }
  100% {
    clip-path: inset(30% 0 50% 0);
    transform: translate(2px, 0);
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip-path: inset(10% 0 60% 0);
    transform: translate(2px, 0);
  }
  20% {
    clip-path: inset(80% 0 5% 0);
    transform: translate(-2px, 0);
  }
  40% {
    clip-path: inset(30% 0 20% 0);
    transform: translate(2px, 0);
  }
  60% {
    clip-path: inset(10% 0 80% 0);
    transform: translate(-2px, 0);
  }
  80% {
    clip-path: inset(50% 0 30% 0);
    transform: translate(2px, 0);
  }
  100% {
    clip-path: inset(70% 0 10% 0);
    transform: translate(-2px, 0);
  }
}
</style>
<style scoped>
/* =========================================
   1. 故障文字特效 (Glitch Text)
   ========================================= */
.glitch-text {
  position: relative;
  display: inline-block;
  color: #facc15; /* 对应 text-yellow-400 */
}

/* 创建两个伪元素用于错位 */
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

/* 红色层 - 向左偏移 */
.glitch-text::before {
  color: #ff003c;
  z-index: -1;
  animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
}

/* 青色层 - 向右偏移 */
.glitch-text::after {
  color: #00f0ff;
  z-index: -2;
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

/* 故障动画关键帧 */
@keyframes glitch-anim-1 {
  0% {
    clip-path: inset(20% 0 80% 0);
    transform: translate(-2px, 0);
  }
  20% {
    clip-path: inset(60% 0 10% 0);
    transform: translate(2px, 0);
  }
  40% {
    clip-path: inset(40% 0 50% 0);
    transform: translate(-2px, 0);
  }
  60% {
    clip-path: inset(80% 0 5% 0);
    transform: translate(2px, 0);
  }
  80% {
    clip-path: inset(10% 0 70% 0);
    transform: translate(-2px, 0);
  }
  100% {
    clip-path: inset(30% 0 50% 0);
    transform: translate(2px, 0);
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip-path: inset(10% 0 60% 0);
    transform: translate(2px, 0);
  }
  20% {
    clip-path: inset(80% 0 5% 0);
    transform: translate(-2px, 0);
  }
  40% {
    clip-path: inset(30% 0 20% 0);
    transform: translate(2px, 0);
  }
  60% {
    clip-path: inset(10% 0 80% 0);
    transform: translate(-2px, 0);
  }
  80% {
    clip-path: inset(50% 0 30% 0);
    transform: translate(2px, 0);
  }
  100% {
    clip-path: inset(70% 0 10% 0);
    transform: translate(-2px, 0);
  }
}

/* =========================================
   2. 卡片全息扫描效果 (Hologram Scan)
   ========================================= */
/* 选中包含 group 的父级元素进行悬停监听 */
.group {
  position: relative;
  overflow: hidden; /* 确保光效不溢出 */
}

/* 扫描线光束 */
.group::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(34, 211, 238, 0.1), /* 微弱青色光 */ transparent
  );
  transform: skewX(-25deg);
  transition: all 0.6s ease-in-out;
  z-index: 10;
  pointer-events: none;
}

/* 悬停时触发扫描 */
.group:hover::before {
  left: 150%;
  transition: all 0.8s ease-in-out;
}

/* 底部光晕渐变 */
.group::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, #22d3ee, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.group:hover::after {
  opacity: 0.5;
  animation: pulse-glow 2s infinite;
}

/* =========================================
   3. 动态背景网格 (Cyber Grid)
   ========================================= */
/* 给容器添加微弱的背景网格，增加科技感 */
section {
  background-image: linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)),
  linear-gradient(0deg, rgba(30, 41, 59, 0.3) 1px, transparent 1px),
  linear-gradient(90deg, rgba(30, 41, 59, 0.3) 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px, 40px 40px;
  background-position: center center;
  /* 添加轻微的噪点质感 */
  filter: contrast(1.2);
}

/* =========================================
   4. 霓虹脉冲动画 (Neon Pulse)
   ========================================= */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.3;
    box-shadow: 0 0 10px rgba(34, 211, 238, 0.2);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.6);
  }
}

/* =========================================
   5. 卡片入场动画 (Staggered Entrance)
   ========================================= */
/* 假设卡片是按顺序渲染的，给它们添加上浮效果 */
.grid > div {
  animation: slide-up-fade 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

/* 依次延迟每个卡片的出现时间 */
.grid > div:nth-child(1) {
  animation-delay: 0.1s;
}

.grid > div:nth-child(2) {
  animation-delay: 0.2s;
}

.grid > div:nth-child(3) {
  animation-delay: 0.3s;
}

.grid > div:nth-child(4) {
  animation-delay: 0.4s;
}

/* 更多卡片以此类推... */

@keyframes slide-up-fade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
