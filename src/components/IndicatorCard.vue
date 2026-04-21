<template>
  <div class="cyber-card group">
    <!-- 装饰性背景光晕 -->
    <div class="cyber-glow"></div>

    <!-- 扫描线背景效果 -->
    <div class="scanlines"></div>

    <!-- 卡片主体 -->
    <div
      class="relative z-10 flex flex-col h-full p-6 overflow-hidden bg-slate-900/90 border border-cyan-500/30 backdrop-blur-sm">

      <!-- 顶部装饰角标 -->
      <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 -mt-1 -ml-1"></div>
      <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 -mt-1 -mr-1"></div>
      <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 -mb-1 -ml-1"></div>
      <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 -mb-1 -mr-1"></div>

      <!-- 头部信息 -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-cyan-400 text-xl font-bold tracking-widest uppercase font-mono glitch-text"
              :data-text="title">
            {{ title }}
          </h3>
          <p class="text-cyan-700 text-xs mt-1 font-mono">{{ subtitle }}</p>
        </div>
        <!-- 状态指示灯 -->
        <div class="flex items-center space-x-2">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
          </span>
        </div>
      </div>

      <!-- 核心数值区域 -->
      <div class="flex-grow flex flex-col justify-center items-center py-4 relative">
        <!-- 动态背景圆环 -->
        <div
          class="absolute w-32 h-32 border border-dashed border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div
          class="absolute w-24 h-24 border border-dotted border-pink-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

        <div class="text-center z-10">
          <div
            class="text-5xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            {{ displayValue }}
            <span class="text-lg text-cyan-500 align-top ml-1">{{ unit }}</span>
          </div>

          <!-- 进度条 -->
          <div class="w-full h-1 bg-slate-800 mt-4 overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500 ease-out"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 底部数据 -->
      <div class="mt-4 grid grid-cols-2 gap-2 border-t border-cyan-500/20 pt-3" v-if="isPositive">
        <div>
          <span class="text-slate-500 text-xs block font-mono">环比</span>
          <span :class="isPositive ? 'text-green-400' : 'text-red-400'" class="text-sm font-bold font-mono">
            {{ isPositive ? '+' : '' }}{{ delta }}%
          </span>
        </div>
        <div class="text-right">
          <span class="text-slate-500 text-xs block font-mono">同比</span>
          <span :class="isPositive ? 'text-green-400' : 'text-red-400'" class="text-sm font-bold font-mono">
            {{ isPositive ? '+' : '' }}{{ delta }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '累计达成目标'
  },
  subtitle: {
    type: String,
    default: '实时监控指标'
  },
  value: {
    type: Number,
    default: 0
  },
  targetValue: {
    type: Number,
    default: 100
  },
  unit: {
    type: String,
    default: ''
  },
  delta: {
    type: Number,
    default: 12.5
  },
  isPositive: {
    type: Boolean,
  }
})

const displayValue = ref()
const progress = ref(0)

// 计算进度百分比 (假设最大值为 targetValue * 1.2)
const maxVal = props.targetValue
const progressPercent = Math.min((props.value / maxVal) * 100, 100)

// 数字滚动动画
onMounted(() => {
  const duration = 1500 // 动画时长 ms
  const startTimestamp = performance.now()

  const step = (timestamp) => {
    const elapsed = timestamp - startTimestamp
    const rawProgress = Math.min(elapsed / duration, 1)

    // 使用 easeOutQuart 缓动函数
    const ease = 1 - Math.pow(1 - rawProgress, 4)

    const currentVal = Math.floor(ease * props.value)
    displayValue.value = currentVal
    progress.value = ease * progressPercent

    if (rawProgress < 1) {
      requestAnimationFrame(step)
    } else {
      displayValue.value = props.value
      progress.value = progressPercent
    }
  }

  requestAnimationFrame(step)
})
</script>

<style scoped>
/* 引入科技感字体，如果没有可用系统等宽字体代替 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

.font-mono {
  font-family: 'Orbitron', 'Courier New', monospace;
}

/* 赛博卡片容器 */
.cyber-card {
  position: relative;
  transition: all 0.3s ease;
}

/* 悬停时的整体发光效果 */
.cyber-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
}

/* 背景光晕 */
.cyber-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 0;
}

.cyber-card:hover .cyber-glow {
  opacity: 1;
}

/* 扫描线动画 */
.scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.2));
  background-size: 100% 4px;
  opacity: 0.15;
  pointer-events: none;
  z-index: 5;
  animation: scanlineMove 10s linear infinite;
}

@keyframes scanlineMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
}

/* 故障文字效果 (Glitch Text) */
.glitch-text {
  position: relative;
  display: inline-block;
}

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
  animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
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
    clip-path: inset(10% 0 60% 0);
    transform: translate(-2px, 0);
  }
  100% {
    clip-path: inset(30% 0 30% 0);
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
