<template>
  <!-- 模态框背景 -->
  <div v-if="isOpen"
       class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto">
    <!-- 模态框容器 -->
    <div
      class="relative w-full max-w-4xl m-4 border-2 border-cyan-500 bg-black text-cyan-500 font-mono shadow-[0_0_30px_rgba(6,182,212,0.3)]">

      <!-- 顶部装饰条 -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500"></div>

      <!-- 关闭按钮 -->
      <button @click="closeModal" class="absolute top-4 right-4 text-cyan-500 hover:text-fuchsia-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-linejoin="bevel" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- 内容区域 -->
      <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- 左侧：头像与基础信息 -->
        <div class="col-span-1 flex flex-col items-center space-y-6 border-r border-cyan-900/50 pr-4 md:pr-8">
          <div class="relative group">
            <!-- 头像外框装饰 -->
            <div
              class="absolute -inset-1 bg-gradient-to-br from-cyan-500 to-fuchsia-500 opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
            <img
              :src="user.avatar || 'https://via.placeholder.com/150'"
              alt="Avatar"
              class="relative w-32 h-32 border-2 border-black object-cover"
            />
            <!-- 状态指示器 -->
            <div class="absolute bottom-2 right-2 flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-black"></span>
            </div>
          </div>

          <div class="text-center space-y-2">
            <h2
              class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 tracking-widest uppercase glitch-text"
              :data-text="user.username">
              {{ user.username }}
            </h2>
            <p class="text-sm text-fuchsia-500 tracking-[0.2em]">ID: {{ String(user.id) }}</p>
          </div>

          <!-- 签名 -->
          <div class="w-full mt-4 p-4 border border-cyan-900/50 bg-cyan-950/10 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
            <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>
            <p class="text-xs text-cyan-300 italic">"{{ user.signature || '这个人很懒，什么都没有留下....' }}"</p>
          </div>
        </div>

        <!-- 右侧：详细字段 -->
        <div class="col-span-1 md:col-span-2 space-y-6">

          <!-- 网格布局展示字段 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- 邮箱 -->
            <DetailItem label="EMAIL" :value="user.email"
                        icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        user="" />

            <!-- 生日 -->
            <DetailItem label="BIRTHDAY" :value="formatDate(user.birthday)"
                        icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        user="" />

            <!-- 职业 -->
            <DetailItem label="OCCUPATION" :value="user.occupation"
                        icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />

            <!-- 行业 -->
            <DetailItem label="INDUSTRY" :value="user.industry"
                        icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />

            <!-- 城市 -->
            <DetailItem label="CITY" :value="user.city"
                        icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />

            <!-- 性别 -->
            <div class="flex flex-col">
              <span class="text-xs text-fuchsia-500 mb-1 flex items-center">
                <span class="w-2 h-2 bg-fuchsia-500 mr-2 animate-pulse"></span> 性别
              </span>
              <div class="border border-cyan-900 bg-black/50 px-4 py-2 text-cyan-100">
                {{ formatGender(user.gender) }}
              </div>
            </div>

          </div>

          <!-- 状态描述 (全宽) -->
          <div class="mt-6">
            <span class="text-xs text-fuchsia-500 mb-1 block">statusDesc</span>
            <div
              class="w-full h-24 border border-cyan-900 bg-cyan-950/10 p-3 text-sm text-cyan-200 overflow-y-auto custom-scrollbar">
              {{ user.statusDesc || '正常使用' }}
            </div>
          </div>

        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="h-1 w-full bg-cyan-900/30 relative overflow-hidden">
        <div class="absolute top-0 left-0 h-full w-1/3 bg-cyan-500/50 animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// 定义 Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    required: true
  }
})

// 定义 Emits
const emit = defineEmits(['update:modelValue'])

// 控制模态框显示
const isOpen = computed(() => props.modelValue)
// 关闭模态框
const closeModal = () => {
  emit('update:modelValue', false)
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return 'UNKNOWN_DATE'
  return new Date(dateString).toLocaleDateString('en-CA') // YYYY-MM-DD
}

// 格式化性别
const formatGender = (val) => {
  if (val === 1) return 'MALE'
  if (val === 0) return 'FEMALE'
  return 'UNKNOWN'
}
</script>

<style scoped>

/* UserModal.vue 样式部分 */
.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999; /* 必须高于背景遮罩层 */
  /* ...其他样式 */
}

/* 简单的故障文字效果 */
.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
}

.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 #00fff9;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% {
    clip: rect(30px, 9999px, 10px, 0);
  }
  5% {
    clip: rect(10px, 9999px, 80px, 0);
  }
  10% {
    clip: rect(80px, 9999px, 20px, 0);
  }
  15% {
    clip: rect(5px, 9999px, 90px, 0);
  }
  20% {
    clip: rect(20px, 9999px, 60px, 0);
  }
  100% {
    clip: rect(40px, 9999px, 70px, 0);
  }
}

@keyframes glitch-anim2 {
  0% {
    clip: rect(60px, 9999px, 20px, 0);
  }
  5% {
    clip: rect(20px, 9999px, 90px, 0);
  }
  10% {
    clip: rect(90px, 9999px, 10px, 0);
  }
  15% {
    clip: rect(10px, 9999px, 50px, 0);
  }
  20% {
    clip: rect(50px, 9999px, 30px, 0);
  }
  100% {
    clip: rect(10px, 9999px, 80px, 0);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(300%);
  }
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #083344;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #06b6d4;
}
</style>

<!-- 子组件：DetailItem -->
<script>
export default {
  components: {
    DetailItem: {
      props: ['label', 'value', 'icon'],
      template: `
        <div class="flex flex-col group">
          <span class="text-xs text-fuchsia-500 mb-1 flex items-center group-hover:text-white transition-colors">
            <svg v-if="icon" class="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="square" stroke-linejoin="bevel" stroke-width="2" :d="icon" />
            </svg>
            {{ label }}
          </span>
          <div
            class="border-b border-cyan-800 pb-1 text-cyan-100 group-hover:border-cyan-400 transition-colors break-all">
            {{ value || 'N/A' }}
          </div>
        </div>
      `
    }
  }
}
</script>
