<template>
  <!-- 卡片容器 -->
  <div class="max-w-sm w-full group cursor-pointer" @click="goToDetail">
    <div
      class="relative p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
    >
      <!-- 内层 div 负责卡片背景和内容 -->
      <div class="card-neon-glow relative bg-gray-900 rounded-2xl overflow-hidden h-full flex flex-col">
        <!-- 图片区域 -->
        <div class="relative h-48 overflow-hidden">
          <!-- 图片：悬停时放大 -->
          <img
            :src="imageSrc"
            :alt="title"
            class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />

          <!-- 图片上的遮罩层 -->
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>

          <!-- 分类标签 (绝对定位) -->
          <div class="absolute top-4 left-4">
            <span
              class="px-3 py-1 text-xs font-bold text-white bg-black/50 backdrop-blur-md rounded-full border border-white/10">
              {{ category }}
            </span>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="p-6 flex-1 flex flex-col">
          <!-- 标题 -->
          <h2
            class=" glitch-effect cyber-text text-2xl font-bold text-white mb-3 leading-tight group-hover:text-purple-400 transition-colors duration-400">
            {{ title }}
          </h2>

          <!-- 摘要 -->
          <p class="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
            {{ excerpt }}
          </p>

          <!-- 底部：作者与阅读时间 -->
          <div class="mt-auto flex items-center justify-between border-t border-gray-800 pt-4">
            <!-- 作者信息 -->
            <div class="flex items-center space-x-3">
              <img
                :src="authorAvatar"
                :alt="authorName"
                class="w-8 h-8 rounded-full border-2 border-purple-500"
              />
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-gray-200">{{ authorName }}</span>
                <span class="text-[10px] text-gray-500">{{ date }}</span>
              </div>
            </div>

            <!--箭头图标 -->
            <div class="btn-cyber flex items-center text-gray-400 group-hover:text-white transition-colors">
              <span class="text-xs mr-2">查看详情</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义 Props 接收父组件数据
import router from '@/router/index.js'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  imageSrc: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: '技术'
  },
  authorName: {
    type: String,
    default: '未知作者'
  },
  authorAvatar: {
    type: String,
    default: 'https://i.pravatar.cc/150?img=60' // 默认头像
  },
  date: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'program'
  }
})

// 跳转到详情页
const goToDetail = async () => {
  if (props.type === 'program') {
    router.push({
      name: 'ProgramDetail',
      params: { id: props.id }
    })
  }
}
</script>

<style scoped>
/* 赛博朋克核心变量 (可选，用于统一管理颜色) */
:root {
  --cp-pink: #ff2a6d;
  --cp-blue: #0abdc6;
  --cp-purple: #9b59b6;
  --cp-yellow: #f9ca24;
  --cp-black: #1a1a1a;
  --cp-glow: 0 0 10px;
}

/* 1. 基础霓虹字体与背景增强 */
.cyber-text {
  color: var(--cp-blue);
  text-shadow: 0 0 5px var(--cp-blue), 0 0 10px var(--cp-blue);
  font-family: 'Orbitron', sans-serif; /* 强烈建议引入 Orbitron 字体以增强赛博朋克感 */
  letter-spacing: 1px;
}

/* 2. 增强版霓虹渐变背景 (替换原生的 from-pink... 到更锐利的赛博风格) */
.bg-cyber-gradient {
  background: linear-gradient(45deg, #ff2a6d, #0abdc6, #9b59b6);
  background-size: 400% 400%;
  animation: cyberGradientShift 8s ease infinite;
}

@keyframes cyberGradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 3. 霓虹光晕与故障效果 (应用于卡片悬停) */
.card-neon-glow {
  box-shadow: 0 0 15px rgba(10, 189, 198, 0.5), 0 0 30px rgba(255, 42, 109, 0.2);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-neon-glow:hover {
  box-shadow:
    0 0 20px rgba(10, 189, 198, 0.8),
    0 0 40px rgba(255, 42, 109, 0.5),
    0 0 60px rgba(155, 89, 182, 0.3);
  transform: scale(1.02) translateY(-5px);
  text-shadow: 0 0 20px currentColor;
}

/* 4. 故障风 (Glitch) 动画效果 (应用于标题) */
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

@keyframes glitchShadow {
  0% { text-shadow: 0 0 0 var(--cp-pink); }
  20% { text-shadow: -2px 2px var(--cp-pink), 2px -2px var(--cp-blue); }
  40% { text-shadow: 2px -2px var(--cp-pink), -2px 2px var(--cp-blue); }
  60% { text-shadow: -2px -2px var(--cp-pink), 2px 2px var(--cp-blue); }
  80% { text-shadow: 2px 2px var(--cp-pink), -2px -2px var(--cp-blue); }
  100% { text-shadow: 0 0 0 var(--cp-pink); }
}

.glitch-effect:hover {
  color: transparent;
  animation: glitch 0.3s linear infinite,
  glitchShadow 0.3s linear infinite;
}

/* 5. 赛博朋克风格的扫描线 (Scanline) 背景纹理 (可选) */
.bg-scanline {
  background-image: linear-gradient(
    to bottom,
    transparent 49%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 51%
  );
  background-size: 100% 4px; /* 控制扫描线密度 */
  background-blend-mode: overlay;
}

/* 6. 霓虹按钮/交互元素 */
.btn-cyber {
  background: transparent;
  border: 2px solid var(--cp-blue);
  color: var(--cp-blue);
  padding: 10px 20px;
  position: relative;
  overflow: hidden;
  transition: 0.3s;
}

.btn-cyber:hover {
  box-shadow: 0 0 15px var(--cp-blue), 0 0 30px var(--cp-blue);
  transform: scale(1.05);
}

.btn-cyber::before {
  content: '';
  position: absolute;
  top: -2px; left: -2px; right: -2px; bottom: -2px;
  border: 2px solid var(--cp-pink);
  z-index: -1;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}
</style>
