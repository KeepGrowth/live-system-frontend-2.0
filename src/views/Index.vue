<template>
  <div
    class="min-h-screen bg-slate-950 text-cyan-50 font-sans selection:bg-fuchsia-500 selection:text-white overflow-x-hidden">


    <!-- 2. 图片轮播 -->
    <section class="relative mx-auto h-[500px] overflow-hidden  ">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 z-10">
      </div>

      <!-- 模拟轮播图片 (使用占位图) -->
      <div
        class="absolute inset-0 bg-[url('https://placehold.co/1920x600/1e1b4b/06b6d4?text=BeYourself')] bg-cover bg-center opacity-60 animate-pulse-slow">
        <swiper-component :images="programImagesList" />
        <swiper-component :images="goalImagesList" />
      </div>

      <!-- 内容层 -->
      <div class="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
        <h2
          class=" glitch-text text-5xl md:text-7xl font-black italic tracking-tighter mb-4 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
          浮生 <span class="text-fuchsia-500 drop-shadow-[0_0_10px_rgba(192,38,211,0.8)] " data-text="录事">录事</span>
        </h2>
        <p
          class="font-mono text-cyan-200 w-[100ch] max-w-full bg-slate-900/80 p-4 border-l-2 border-fuchsia-500 overflow-hidden whitespace-nowrap">

          <!-- 内部文字：负责动画效果 -->
          <span class="glitch-text inline-block animate-typewriter border-r-2 border-cyan-200 pr-1">
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
          累计<span class="text-cyan-400">达成</span>
        </h2>
        <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了!</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="item in statCardList" :key="item">
          <!-- 核心指标卡片 -->
          <indicator-card
            :title="item.title"
            :subtitle="item.subtitle"
            :value="item.value"
            :target-value="item.targetValue"
            :delta="item.delta"
            :unit="item.unit"
            :is-positive="item.isPositive"
          />
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
        <!-- 分页组件 -->
        <div class="">
          <el-pagination
            class="mt-8 flex justify-center" v-if="goalList.length > 0"
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[5, 10, 15, 20]"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="fetchGoalData"
            @current-change="fetchGoalData"
          />
        </div>
      </div>


      <swiper-component :images="goalImagesList" class="mb-5" v-if="goalImagesList.length>0" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 卡片循环 -->
        <div v-for="goal in goalList" :key="goal.id" v-if="goalList.length>0">
          <card-component
            :id="goal.id"
            :title="goal.goalName"
            :excerpt="goal.description"
            :image-src="goal.imageUrls[0]?.imageUrl || 'https://placehold.co/1920x600/1e1b4b/06b6d4?text=BeYourself' "
            :category="goal.goalStatus"
            :author-name="'完成时间：' + goal.finishDate"
            :author-avatar="userStore.userInfo?.avatar || ''"
            :date="'创建时间：' + goal.startDate"
            read-time="查看详情"
            type="goal"
          />
        </div>
        <el-empty style="margin: 0 auto" v-else description="咱没有完成的可展示目标，快去作战室加油奋斗吧。" />

      </div>

    </section>


    <!-- 项目列表卡片 -->
    <section class="container mx-auto px-6 py-20">
      <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
        <h2 class="text-3xl font-bold text-white">
          项目<span class="text-cyan-400">走马灯</span>
        </h2>
        <span class="font-mono text-xs text-slate-500 mb-1">:: 值得你骄傲的成就</span>
        <!-- 分页组件 -->
        <div class="">
          <el-pagination
            class="mt-8 flex justify-center" v-if="goalList.length > 0"
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[5, 10, 15, 20]"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="programTotal"
            @size-change="fetchProgramData"
            @current-change="fetchProgramData"
          />
        </div>
      </div>
      <swiper-component class="mb-5" :images="programImagesList" v-if="programImagesList.length>0" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 项目卡片循环 -->
        <div v-for="program in programList" :key="program.id" v-if="programList.length>0">
          <card-component
            :id="program.id"
            :title="program.programName"
            :excerpt="program.programDesc"
            :image-src="program.imageUrls[0]?.imageUrl || 'https://placehold.co/1920x600/1e1b4b/06b6d4?text=BeYourself'"
            :category="program.programStatus"
            :author-name="'完成时间：'+program.estimateFinishTime"
            :author-avatar="userStore.userInfo?.avatar || ''"
            :date="'立项时间：'+program.estimateStartTime"
            read-time="查看详情"
            type="program"
          />
        </div>
        <el-empty style="margin: 0 auto" v-else description="咱没有完成的可展示项目，快去作战室加油奋斗吧。" />
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
import useUserStore from '@/stores/user.ts'
import { onMounted, ref } from 'vue'
import formatTime from '@/utils/date.js'
import useGoalStore from '@/stores/goal/goal.js'
import IndicatorCard from '@/components/IndicatorCard.vue'
import ProgramPage from '@/views/program/ProgramPage.vue'
import useDashboardStore from '@/stores/dashboard.js'
import { ArrowDown, Setting, SwitchButton, User } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useOkrStore from '@/stores/okr/okr.js'
import NavBar from '@/components/bar/NavBar.vue'
// 状态管理
const programStore = useProgramStore()
const goalStore = useGoalStore()
const userStore = useUserStore()


// 筛选条件
const queryParams = ref({
  page: 1,
  pageSize: 10,
  status:2
})

// 请求数据
const programList = ref([])
const programImagesList = ref([])
const goalList = ref([])
const goalImagesList = ref([])
const total = ref(0)
const programTotal = ref(0)
const statCardList = ref([])

//项目请求
const fetchProgramData = async () => {
  const res = await programStore.getProgramList(queryParams.value)
  if (res.data.code === 200) {
    programList.value = res.data?.data.programList
    programTotal.value = res.data.data.total
    programImagesList.value = programList.value?.flatMap(item => item.imageUrls) || []
  }
}

// 目标请求
const fetchGoalData = async () => {
  const res = await goalStore.getGoalList(queryParams.value)
  if (res.data.code === 200) {
    goalList.value = res.data.data.goalList
    total.value = res.data.data.total
    goalImagesList.value = goalList.value?.flatMap(item => item.imageUrls) || []
  }
}
const fetchData = async () => {
  await fetchProgramData()
  await fetchGoalData()
  await getStatCard()
}


// 指标卡请求
const dashBoardStore = useDashboardStore()
const getStatCard = async () => {
  const res = await dashBoardStore.getDashboardList()
  if (res.data.code === 200) {
    statCardList.value = res.data.data
  }
}



// okr级联选项方法
const okrStore = useOkrStore()
const getOkrOptions = async ()=>{
  await okrStore.getOptions()
}

onMounted(async () => {
  await fetchData()
  await getOkrOptions()
})
</script>


<style scoped>
/* 基础设置：确保父容器有相对定位，文字保持白色 */
.glitch-text {
  position: relative;
  display: inline-block;
  color: #ffffff;
  font-weight: 900; /* 加粗字体让效果更明显 */
}

/* 创建两个伪元素用于制作故障层 */
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text); /* 关键：获取 HTML 中的文本内容 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #1a1a1a; /* 背景色，用于遮盖原本文字 */
  opacity: 0.8;
}

/* 故障层 1：青色偏移 */
.glitch-text::before {
  color: #00ffff; /* 青色 */
  z-index: -1;
  /* 动画：播放名为 glitch-anim-1 的关键帧，时长 3s，无限循环 */
  animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
}

/* 故障层 2：红色/粉色偏移 */
.glitch-text::after {
  color: #ff00ff; /* 洋红色 */
  z-index: -2;
  /* 动画：播放名为 glitch-anim-2 的关键帧 */
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

/* --- 关键帧动画定义 --- */

/* 动画 1：主要控制剪切路径和横向位移 */
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
    transform: translate(-1px, 0);
  }
  100% {
    clip-path: inset(30% 0 20% 0);
    transform: translate(1px, 0);
  }
}

/* 动画 2：主要控制反向剪切和更剧烈的抖动 */
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
    transform: translate(-1px, 0);
  }
  80% {
    clip-path: inset(50% 0 30% 0);
    transform: translate(1px, 0);
  }
  100% {
    clip-path: inset(70% 0 10% 0);
    transform: translate(-2px, 0);
  }
}
</style>

