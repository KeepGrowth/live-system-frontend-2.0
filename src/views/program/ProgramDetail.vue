<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 font-mono selection:bg-cyan-500 selection:text-black p-4 md:p-8">
    <!-- 装饰性背景网格 -->
    <div class="fixed inset-0 z-0 opacity-10 pointer-events-none"
         style="background-image: linear-gradient(0deg, transparent 24%, #06b6d4 25%, #06b6d4 26%, transparent 27%, transparent 74%, #06b6d4 75%, #06b6d4 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #06b6d4 25%, #06b6d4 26%, transparent 27%, transparent 74%, #06b6d4 75%, #06b6d4 76%, transparent 77%, transparent); background-size: 50px 50px;">
    </div>

    <!-- 主容器 -->
    <div class="relative z-10 max-w-6xl mx-auto space-y-6">

      <!-- 顶部标题栏 -->
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-cyan-500/50 pb-4 mb-8">
        <div>
          <h2 class="text-cyan-500 text-sm tracking-[0.2em] uppercase mb-1">项目详情</h2>
          <h1 class="text-3xl md:text-4xl font-bold text-white uppercase glitch-text" data-text="project_name">
            {{ program.programName }}
          </h1>
        </div>
        <div class="mt-4 md:mt-0 flex items-center space-x-2">
          <!-- 状态徽章 -->
          <div
            class="px-4 py-1 border border-cyan-500 text-cyan-400 uppercase text-xs tracking-widest relative overflow-hidden group">
            <div
              class="absolute inset-0 w-0 bg-cyan-500 transition-all duration-[250ms] ease-out group-hover:w-full opacity-20"></div>
            <span class="relative z-10">{{ getStatusText(program.programStatus) }}</span>
          </div>
          <span class="text-slate-500 text-xs font-mono">项目ID: {{ program.id }}</span>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- 左侧主要信息 -->
        <div class="lg:col-span-2 space-y-8">
          <!-- 附件区域 -->
          <div v-if="program.attachment_path">
            <h4 class="text-xl  uppercase mb-2 tracking-widest">项目附件集</h4>
            <swiper-component />
          </div>
          <!-- 描述卡片 -->
          <section
            class="bg-slate-900/50 border border-slate-800 p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-fuchsia-500"></div>
            <h3 class="text-xl text-white mb-4 flex items-center">
              <span class="w-2 h-2 bg-fuchsia-500 mr-2 shadow-[0_0_10px_#d946ef]"></span>
              项目概述
            </h3>
            <p class="text-slate-300 leading-relaxed text-justify border-l-2 border-slate-800 pl-4">
              {{ program.programDesc || '暂无相关项目概述' }}
            </p>
          </section>

          <!-- 关键指标网格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 满意度 -->
            <div class="bg-slate-900/80 p-5 border border-slate-800 relative">
              <div class="flex justify-between items-end mb-2">
                <span class="text-slate-500 text-xs uppercase">项目满意度</span>
                <span class="text-2xl font-bold text-fuchsia-400">{{ program.satisfactionScore }}<span
                  class="text-sm text-slate-600">/100</span></span>
              </div>
              <div class="w-full bg-slate-800 h-1">
                <div class="bg-fuchsia-500 h-full shadow-[0_0_10px_#d946ef]"
                     :style="{ width: program.satisfactionScore + '%' }"></div>
              </div>
            </div>

            <!-- 关联目标 -->
            <div class="bg-slate-900/80 p-5 border border-slate-800 flex flex-col justify-center cursor-pointer">
              <span class="text-slate-500 text-xs uppercase mb-1">项目关联目标</span>
              <div class="flex items-center text-cyan-300">
                <svg class="w-4 h-4 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                <span class="font-bold tracking-wider">目标ID-{{ program.goalId }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- 右侧时间轴/元数据 -->
        <div class="lg:col-span-1">
          <!-- 用户ID展示 -->
          <div class="mt-6 mb-4 p-4 border border-slate-800 bg-slate-900/30 flex justify-between items-center">
            <span class="text-xs text-slate-200 uppercase">项目发起人</span>
            <span
              class="cursor-pointer font-mono text-sm text-slate-300 border-b border-dotted border-slate-600 hover:text-cyan-400 transition-colors">
               USER-{{ program.userId }}
             </span>
          </div>
          <div class="bg-slate-900 border border-slate-800 p-6 relative">
            <!-- 装饰角标 -->
            <div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500"></div>
            <div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-fuchsia-500"></div>

            <h3 class="text-lg text-white mb-6 border-b border-slate-800 pb-2 flex justify-between">
              <span>时间线梳理</span>
              <svg class="w-4 h-4 text-slate-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </h3>

            <ul
              class="space-y-6 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">

              <!-- Start Time -->
              <li class="relative pl-8">
                <span class="absolute -left-1 top-1.5 flex h-3 w-3">
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
                <p class="text-xs text-slate-500 uppercase">项目开始时间</p>
                <p class="text-sm text-cyan-100 font-medium">{{ formatDate(program.estimateStartTime) }}</p>
              </li>

              <!-- 项目时间线 -->
              <li class="cursor-pointer relative pl-8" v-for="(item,index) in program.okrList" :key="item.id">
                <span class="absolute -left-1 top-1.5 flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" v-if="index === program.okrList.length - 1"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 border border-slate-500 bg-slate-900"></span>
                </span>
                <p class="text-xs text-slate-500 uppercase">{{ item.krName }}</p>
                <p class="text-sm text-cyan-100 font-medium">{{ formatDate(item.createTime) }}</p>
              </li>

            </ul>
          </div>


        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import SwiperComponent from '@/components/SwiperComponent.vue'
import useProgramStore from '@/stores/program/program.js'
import { ElNotification } from 'element-plus'

const props = defineProps({
  id: {
    type: String, // 路由参数通常是字符串，如果需要数字可以转换一下
    required: true
  }
})

// 模拟从数据库获取的数据
const program = ref()

// 状态文本映射
const getStatusText = (status) => {
  switch (status) {
    case 0:
      return '待完成'
    case 1:
      return '进行中'
    case 2:
      return '已完成'
    case 3:
      return '已放弃'
    default:
      return 'Unknown'
  }
}

// 日期格式化
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-CA') // YYYY-MM-DD
}

const programStore = useProgramStore()
const fetchProgramDetail = async () => {
  const res = await programStore.getProgramDetail(props.id)
  if (res.data.code === 200) {
    program.value = res.data.data
  } else {
    ElNotification.error({
      title: '详情获取失败',
      message: res.data.msg
    })
  }
}

// 初始化加载数据
onBeforeMount(async () => {
  await fetchProgramDetail()
})

// 时间格式化
const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleString('en-GB', { hour12: false })
}
</script>

<style scoped>
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
  background: #020617; /* 与背景色相同 */
}

.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 #d946ef; /* 洋红 */
  clip: rect(24px, 500px, 90px, 0);
  animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 #06b6d4; /* 青色 */
  clip: rect(85px, 500px, 140px, 0);
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% {
    clip: rect(42px, 9999px, 44px, 0);
  }
  5% {
    clip: rect(12px, 9999px, 50px, 0);
  }
  10% {
    clip: rect(80px, 9999px, 90px, 0);
  }
  100% {
    clip: rect(20px, 9999px, 100px, 0);
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip: rect(10px, 9999px, 60px, 0);
  }
  5% {
    clip: rect(50px, 9999px, 80px, 0);
  }
  10% {
    clip: rect(20px, 9999px, 30px, 0);
  }
  100% {
    clip: rect(60px, 9999px, 120px, 0);
  }
}
</style>
