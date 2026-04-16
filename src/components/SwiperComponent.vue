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
        class="scroll-track flex gap-6 w-max"
        :class="{ 'animate-scroll': !isPaused }"
      >
        <!-- 原始列表 -->
        <div
          v-for="(item, index) in images"
          :key="index"
          class="cyber-card group relative flex-shrink-0 w-64 h-40 overflow-hidden border border-slate-700 bg-slate-800/50 cursor-pointer"
        >
          <!-- 图片 -->
          <image
            :src="item.url"
            :alt="item.title"
            class="w-full h-full max-h-60 object-cover  transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
          />

          <!-- 悬停覆盖层 -->
          <div
            class="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>

          <!-- 文字信息 -->
          <div
            class="absolute bottom-0 left-0 w-full p-3 bg-slate-900/80 border-t border-cyan-500/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p class="text-cyan-300 text-xs font-mono tracking-wider">关联用户ID: {{ item.id }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联项目ID: {{ item.programId }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联目标ID:{{ item.goalId }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联待办ID:{{ item.todoId }}</p>
          </div>

          <!-- 装饰性角标 -->
          <div class="absolute top-2 right-2 w-2 h-2 bg-fuchsia-500"></div>
        </div>

        <!-- 重复列表 (用于无缝循环) -->
        <div
          v-for="(item, index) in images"
          :key="`dup-${index}`"
          class="cyber-card group relative flex-shrink-0 w-64 h-40 overflow-hidden border border-slate-700 bg-slate-800/50"
        >
          <img
            :src="item.url"
            :alt="item.title"
            class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
          />
          <div
            class="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
          <div
            class="absolute bottom-0 left-0 w-full p-3 bg-slate-900/80 border-t border-cyan-500/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p class="text-cyan-300 text-xs font-mono tracking-wider">ID: {{ item.id }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">{{ item.title }}</p>
          </div>
          <div class="absolute top-2 right-2 w-2 h-2 bg-fuchsia-500"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 状态控制
const isPaused = ref(false)
const props = defineProps({
  images: {
    type: Array,
    default: () => [
      { id: '001', title: 'NEON_CITY', url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&q=80' },
      {
        id: '002',
        title: 'CYBER_PUNK',
        url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=500&q=80'
      },
      {
        id: '003',
        title: 'CYBER_PUNK',
        url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=500&q=80'
      },
      {
        id: '004',
        title: 'CYBER_PUNK',
        url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=500&q=80'
      },
      {
        id: '005',
        title: 'CYBER_PUNK',
        url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=500&q=80'
      }
    ]
  }
})

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
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 25s linear infinite;
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
