<template>
  <!-- 卡片容器 -->
  <div class="max-w-sm w-full group cursor-pointer" @click="goToDetail">
    <div
      class="relative p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
    >
      <!-- 内层 div 负责卡片背景和内容 -->
      <div class="relative bg-gray-900 rounded-2xl overflow-hidden h-full flex flex-col">
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
            class="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-purple-400 transition-colors duration-300">
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
            <div class="flex items-center text-gray-400 group-hover:text-white transition-colors">
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
