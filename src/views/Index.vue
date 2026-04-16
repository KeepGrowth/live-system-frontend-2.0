<template>
  <div
    class="min-h-screen bg-slate-950 text-cyan-50 font-sans selection:bg-fuchsia-500 selection:text-white overflow-x-hidden">

    <!-- 1. 导航栏 -->
    <nav
      class="sticky top-0 z-50 w-full border-b border-cyan-500/30 bg-slate-900/80 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center gap-2 group cursor-pointer" @click="goToBackend">
          <div
            class="w-8 h-8 bg-fuchsia-600 skew-x-[-12deg] flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(192,38,211,0.8)] transition-all duration-300">
            <span class="text-white font-bold text-xl skew-x-[12deg]">S</span>
          </div>
          <span
            class="text-2xl font-black tracking-wider italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            浮生<span class="text-white">录事</span>
          </span>
        </div>

        <!-- 菜单 -->
        <div class="hidden md:flex gap-8 font-mono text-sm tracking-widest">
          <a href="#"
             class="hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(192,38,211,0.8)] transition-all">首页</a>
          <a href="#"
             class="hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(192,38,211,0.8)] transition-all">事业</a>
          <a href="#"
             class="hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(192,38,211,0.8)] transition-all">生活</a>
          <a href="#"
             class="hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(192,38,211,0.8)] transition-all">财务</a>
          <a href="#"
             class="hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(192,38,211,0.8)] transition-all">数据</a>
        </div>

        <!-- 登录按钮 -->
        <button
          @click="goToBackend"
          class="cursor-pointer relative px-6 py-2 bg-cyan-900/30 border border-cyan-500 text-cyan-400 font-mono text-sm hover:bg-cyan-500 hover:text-slate-900 transition-all duration-300 clip-path-button group">
          管理后台
        </button>
        <!-- 登录按钮 -->
      </div>
    </nav>

    <!-- 2. 图片轮播 -->
    <section class="relative w-full h-[500px] overflow-hidden border-b border-fuchsia-500/30">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 z-10">
      </div>

      <!-- 模拟轮播图片 (使用占位图) -->
      <div
        class="absolute inset-0 bg-[url('https://placehold.co/1920x600/1e1b4b/06b6d4?text=BeYourself')] bg-cover bg-center opacity-60 animate-pulse-slow">
        <swiper-component />
        <swiper-component />
      </div>

      <!-- 内容层 -->
      <div class="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
        <h2
          class="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
          浮生 <span class="text-fuchsia-500 drop-shadow-[0_0_10px_rgba(192,38,211,0.8)]">录事</span>
        </h2>
        <p
          class="font-mono text-cyan-200 w-[100ch] max-w-full bg-slate-900/80 p-4 border-l-2 border-fuchsia-500 overflow-hidden whitespace-nowrap">

          <!-- 内部文字：负责动画效果 -->
          <span class="inline-block animate-typewriter border-r-2 border-cyan-200 pr-1">
    知不足而奋进，望远山而前行，旅行者，欢迎开始属于你的人生管理系统。
  </span>

        </p>
      </div>

      <!-- 装饰性角落 -->
      <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-30"></div>
      <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fuchsia-400 z-30"></div>
    </section>

    <!-- 统计指标卡片 -->
    <section class="container mx-auto px-6 -mt-10 relative z-30">
      <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
        <h2 class="text-3xl font-bold text-white">
          你已<span class="text-cyan-400">达成</span>
        </h2>
        <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 卡片 1 -->
        <div
          class="bg-slate-900/90 border border-cyan-500/50 p-6 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div
            class="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-cyan-500/20"></div>
          <h3 class="text-cyan-400 font-mono text-sm mb-1">累计目标</h3>
          <div class="text-4xl font-bold text-white mb-2">8,902,114</div>
          <div class="text-xs text-fuchsia-400 flex items-center gap-1">
            <span>⭐ 12%</span> 达成率
          </div>
        </div>

        <!-- 卡片 2 -->
        <div
          class="bg-slate-900/90 border border-fuchsia-500/50 p-6 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div
            class="absolute top-0 right-0 w-16 h-16 bg-fuchsia-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-fuchsia-500/20"></div>
          <h3 class="text-fuchsia-400 font-mono text-sm mb-1">累计项目</h3>
          <div class="text-4xl font-bold text-white mb-2">45,231</div>
          <div class="text-xs text-cyan-400 flex items-center gap-1">
            <span>⭐ 12%</span> 达成率
          </div>
        </div>

        <!-- 卡片 3 -->
        <div
          class="bg-slate-900/90 border border-cyan-500/50 p-6 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div
            class="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-cyan-500/20"></div>
          <h3 class="text-cyan-400 font-mono text-sm mb-1">累计OKR</h3>
          <div class="text-4xl font-bold text-white mb-2">124 TB/s</div>
          <div class="text-xs text-fuchsia-400 flex items-center gap-1">
            <span>⭐ 12%</span> 达成率
          </div>
        </div>

        <!-- 卡片 3 -->
        <div
          class="bg-slate-900/90 border border-cyan-500/50 p-6 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div
            class="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-cyan-500/20"></div>
          <h3 class="text-cyan-400 font-mono text-sm mb-1">累计Todo</h3>
          <div class="text-4xl font-bold text-white mb-2">124 TB/s</div>
          <div class="text-xs text-fuchsia-400 flex items-center gap-1">
            <span>⭐ 12%</span> 完成率
          </div>
        </div>
        <!-- 卡片 3 -->
        <div
          class="bg-slate-900/90 border border-cyan-500/50 p-6 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div
            class="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-cyan-500/20"></div>
          <h3 class="text-cyan-400 font-mono text-sm mb-1">累计支出</h3>
          <div class="text-4xl font-bold text-white mb-2">124 TB/s</div>
          <div class="text-xs text-fuchsia-400 flex items-center gap-1">
            <span>⭐ 12%</span> 完成率
          </div>
        </div>
        <!-- 卡片 3 -->
        <div
          class="bg-slate-900/90 border border-cyan-500/50 p-6 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div
            class="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-cyan-500/20"></div>
          <h3 class="text-cyan-400 font-mono text-sm mb-1">累计收入</h3>
          <div class="text-4xl font-bold text-white mb-2">124 TB/s</div>
          <div class="text-xs text-fuchsia-400 flex items-center gap-1">
            <span>⭐ 12%</span> 完成率
          </div>
        </div>
      </div>
    </section>

    <!-- 目标列表卡片 -->
    <section class="container mx-auto px-6 py-20">
      <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
        <h2 class="text-3xl font-bold text-white">
          目标<span class="text-cyan-400">走马灯</span>
        </h2>
        <span class="font-mono text-xs text-slate-500 mb-1">:: 你费尽心力完成的目标</span>
      </div>
      <swiper-component />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 项目卡片循环 -->
        <div v-for="program in programList.slice(0,10)" :key="program.id">
          <card-component
            :id="program.id"
            :title="program.programName"
            :excerpt="program.programDesc"
            :image-src="program.attachmentPath"
            :category="program.programStatus"
            :author-name="'用户'+userStore.userInfo.username"
            :author-avatar="userStore.userInfo.avatar"
            :date="formatTime(program.createTime)"
            read-time="查看详情"
            type="goal"
          />
        </div>
      </div>
    </section>

    <!-- 项目列表卡片 -->
    <section class="container mx-auto px-6 py-20">
      <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
        <h2 class="text-3xl font-bold text-white">
          项目<span class="text-cyan-400">走马灯</span>
        </h2>
        <span class="font-mono text-xs text-slate-500 mb-1">:: 值得你骄傲的成就</span>
      </div>
      <swiper-component/>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 项目卡片循环 -->
        <div v-for="program in programList.slice(0,10)" :key="program.id">
          <card-component
            :id="program.id"
            :title="program.programName"
            :excerpt="program.programDesc"
            :image-src="program.attachmentPath"
            :category="program.programStatus"
            :author-name="'用户'+userStore.userInfo.username"
            :author-avatar="userStore.userInfo.avatar"
            :date="formatTime(program.createTime)"
            read-time="查看详情"
            type="program"
          />
        </div>
      </div>


    </section>

    <!-- 底部装饰 -->
    <footer class="border-t border-slate-800 bg-slate-950 py-8 text-center">
      <p class="font-mono text-xs text-slate-600">
        © 2026-4-16日搭建，与我联系:zjun2002@outlook.com
      </p>
    </footer>

  </div>
</template>

<style scoped>
/* 自定义动画与特殊形状 */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 斜切按钮形状 */
.clip-path-button {
  clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
}


/* 在 style 标签中添加 */
@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* 光标闪烁动画（可选） */
@keyframes blink {
  50% {
    border-color: transparent;
  }
}

/* 应用动画的类 */
.animate-typewriter {
  animation: typewriter 4s steps(24) 1s 1 normal both, blink 0.75s step-end infinite;
  white-space: nowrap; /* 强制不换行 */
  overflow: hidden; /* 隐藏超出宽度的文字 */
  display: inline-block;
}
</style>
<script setup>
import CardComponent from '@/components/CardComponent.vue'
import SwiperComponent from '@/components/SwiperComponent.vue'
import router from '@/router/index.js'
import useProgramStore from '@/stores/program/program.js'
import useUserStore from '@/stores/user.js'
import { onMounted, ref } from 'vue'
import formatTime from '@/utils/date.js'
// 状态管理
const programStore = useProgramStore()
const userStore = useUserStore()

onMounted(async () => {
  await fetchData()
})

// 请求数据
const programList = ref([])
const fetchData = async () => {
  const res = await programStore.getProgramList({})
  if (res.data.code === 200) {
    programList.value = res.data?.data.programList
  }
}
const goToBackend = async () => {
  await router.push({ name: 'home' })
}
</script>


