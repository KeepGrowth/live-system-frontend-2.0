<template>
  <div class="cyber-section">
    <!-- 标题区域 -->
    <div class="cyber-header">
      <div class="cyber-corner top-right"></div>
      <div class="cyber-corner bottom-left"></div>
    </div>

    <!-- 滚动视窗 -->
    <div
      class="scroll-viewport relative w-full overflow-hidden py-6"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
    >
      <!-- 遮罩层：左右渐变，增加纵深感 -->
      <div
        class="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
      <div
        class="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

      <!-- 滚动轨道 -->
      <div
        ref="trackRef"
        class="scroll-track flex gap-6 w-max cursor-pointer"
        :class="{ 'animate-scroll': !isPaused }"
        :style="trackStyle"

      >
        <!-- 原始列表 -->
        <div
          v-for="(item, index) in images"
          :key="index"
          class="cyber-card group relative flex-shrink-0 w-64 h-40 overflow-hidden border border-slate-700 bg-slate-800/50 cursor-pointer"
          @click="goToDetail(item)"
        >
          <!-- 图片 -->
          <img
            :src="item.imageUrl"
            :alt="item.createTimeStr"
            class="w-full h-full max-h-60 object-cover  transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
          />

          <!-- 悬停覆盖层 -->
          <div
            class="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>

          <!-- 文字信息 -->
          <div
            class="absolute bottom-0 left-0 w-full p-3 bg-slate-900/80 border-t border-cyan-500/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p class="text-cyan-400 text-sm font-bold font-mono">关联项目ID: {{ item.programId }}</p>
            <p class="text-yellow-400 text-sm font-bold font-mono">关联目标ID:{{ item.goalId }}</p>
            <p class="text-red-400 text-sm font-bold font-mono">关联待办ID:{{ item.todoId }}</p>
          </div>

          <!-- 装饰性角标 -->
          <div class="absolute top-2 right-2 w-2 h-2 bg-fuchsia-500"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import router from '@/router/index.js'

// 状态控制
const isPaused = ref(false)
const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
})

// 动画滚动效果计算
const trackRef = ref(null)

// 配置：每张卡片显示时长（毫秒）
const CARD_DURATION = 3000
// 配置：卡片宽度 (对应 w-64 = 16rem = 256px)
const CARD_WIDTH = 256
// 配置：卡片间距 (对应 gap-6 = 1.5rem = 24px)
const GAP_WIDTH = 24

// 改动点 2: 计算总宽度和动画时长
const trackStyle = computed(() => {
  const count = props.images.length

  // 1. 计算单组列表的总宽度 (宽 + 间距) * 数量
  // 注意：最后一个元素通常不需要间距，但为了计算方便和视觉缓冲，这里简单相加
  const totalWidth = count * (CARD_WIDTH + GAP_WIDTH)

  // 2. 计算动画总时长
  const duration = count * (CARD_DURATION / 1000) // 转换为秒

  return {
    '--scroll-distance': `-${totalWidth}px`, // 移动的距离
    '--scroll-duration': `${duration}s`      // 动画的时间
  }
})


// 点击图片跳转详情界面
const goToDetail = async (imageItem) => {
  // 根据类型不同跳转到不同详情页
  if (props.type === 'program') {
    router.push({
      name: 'ProgramDetail',
      params: { id: imageItem.programId }
    })
  }
}
</script>

<style scoped>
/* 引入赛博朋克核心字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

/* 核心滚动动画 */
/* 使用 CSS 变量接收 JS 计算的值，实现动态无缝滚动 */
@keyframes scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(var(--scroll-distance, -1000px));
  }
}

.animate-scroll {
  animation: scroll var(--scroll-duration, 180s) linear infinite;
  will-change: transform;
}

/* 赛博朋克主题样式 */
:root {
  --cp-neon-pink: #ec4899; /* 故障艺术粉 */
  --cp-neon-cyan: #06b6d4; /* 科技蓝 */
  --cp-dark: #0f172a; /* 深邃黑 */
  --cp-grid: #1e293b; /* 网格背景 */
}

.cyber-section {
  background: linear-gradient(145deg, var(--cp-dark) 0%, #1a1a2e 100%);
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.1);
  position: relative;
  overflow: hidden;
}

/* 添加网格背景纹理 */
.cyber-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(30, 41, 59, 0.5) 1px, transparent 1px),
  linear-gradient(90deg, rgba(30, 41, 59, 0.5) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.3;
}

/* 装饰性标题角标 */
.cyber-header {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 2rem;
  display: inline-block;
}

.cyber-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--cp-neon-pink), var(--cp-neon-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
}

/* 故障艺术角标 */
.cyber-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid;
  border-image: linear-gradient(45deg, var(--cp-neon-pink), var(--cp-neon-cyan)) 1;
  box-shadow: 0 0 8px currentColor;
  transition: all 0.3s ease;
}

.cyber-corner::after {
  content: '';
  position: absolute;
  inset: -2px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

/* 滚动视窗增强 */
.scroll-viewport {
  position: relative;
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 0.375rem;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
  0 2px 4px -1px rgba(6, 182, 212, 0.2);
  overflow: hidden;
}

/* 卡片样式 */
.cyber-card {
  position: relative;
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 0.375rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  transform: translateY(0);
}

.cyber-card:hover {
  transform: translateY(-4px) scale(1.02);
  border-color: var(--cp-neon-cyan);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.4),
  0 0 30px rgba(236, 72, 153, 0.2);
  z-index: 20;
}

/* 卡片内部图片 */
.cyber-card img {
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

.cyber-card:hover img {
  transform: scale(1.15) !important;
  filter: brightness(1.2) contrast(1.1);
}

/* 卡片底部信息栏 */
.cyber-card .p-info {
  font-family: 'Orbitron', monospace;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  padding: 0.5rem 0.75rem;
  background: rgba(15, 23, 42, 0.9);
  border-top: 1px solid rgba(6, 182, 212, 0.5);
  backdrop-filter: blur(2px);
  transform: translateY(100%);
}

.cyber-card:hover .p-info {
  transform: translateY(0);
}

/* 霓虹文字颜色 */
.text-fuchsia-400 {
  color: #ec4899;
}

.text-cyan-400 {
  color: #22d3ee;
}
</style>
