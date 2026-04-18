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
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联项目ID: {{ item.programId }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联目标ID:{{ item.goalId }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联待办ID:{{ item.todoId }}</p>
          </div>

          <!-- 装饰性角标 -->
          <div class="absolute top-2 right-2 w-2 h-2 bg-fuchsia-500"></div>
        </div>

        <!-- 重复列表 (用于无缝循环) -->
        <div
          v-if="images.length<24"
          v-for="(item, index) in backupImages"
          :key="`dup-${index}`"
          class="cyber-card group relative flex-shrink-0 w-64 h-40 overflow-hidden border border-slate-700 bg-slate-800/50"
        >
          <img
            :src="item.imageUrl"
            :alt="item.createTimeStr"
            class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
          />
          <div
            class="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
          <div
            class="absolute bottom-0 left-0 w-full p-3 bg-slate-900/80 border-t border-cyan-500/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联项目ID: {{ item.programId }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联目标ID:{{ item.goalId }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联待办ID:{{ item.todoId }}</p>
          </div>
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
  backupImages: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: () => 'program'
  }
})

// 动画滚动效果计算
const trackRef = ref(null)

// 配置：每张卡片显示时长（毫秒）
const CARD_DURATION = 1000
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
/* 赛博朋克字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

.font-mono {
  font-family: 'Orbitron', sans-serif;
}

/* 核心滚动动画 */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    /* 移动 50% 是因为我们复制了一份列表，移动到一半时重置即可实现无缝 */
    transform: translateX(var(--scroll-distance));
  }
}

.animate-scroll {
  animation: scroll 180s linear infinite;
  /* 添加 will-change 优化性能 */
  will-change: transform;
}

/* 装饰性边框角标 */
.cyber-header {
  position: relative;
  margin-bottom: 5px;
  padding-left: 20px;
}

.cyber-title {
  font-size: 1.5rem;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
}

.cyber-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid #f0abfc; /* fuchsia-400 */
  box-shadow: 0 0 8px #f0abfc;
  transition: all 0.3s ease;
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

/* 卡片悬停效果增强 */
.cyber-card {
  box-shadow: 4px 4px 0px rgba(6, 182, 212, 0.2);
  transition: all 0.3s ease;
}

.cyber-card:hover {
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
  border-color: #22d3ee;
  z-index: 10;
}
</style>
