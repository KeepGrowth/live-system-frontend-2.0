<template>
  <div
    class="min-h-screen w-full bg-slate-950 text-slate-200 font-mono selection:bg-cyan-500 selection:text-black relative">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 z-0 opacity-20"
         style="background-image: linear-gradient(0deg, transparent 24%, #22d3ee 25%, #22d3ee 26%, transparent 27%, transparent), linear-gradient(90deg, transparent 24%, #e879f9 25%, #e879f9 26%, transparent 27%, transparent); background-size: 50px 50px;"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950"></div>

    <div class="relative z-10 w-full md:px-8 space-y-6 px-4 ">
      <!-- 头部区域 -->
      <header class="mb-10 border-b-2 border-cyan-500 pb-6 flex flex-col lg:flex-row justify-between items-end gap-6">

        <!-- 左侧：标题 -->
        <div class="w-full lg:w-auto">
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] glitch-text"
            data-text="复盘作战室">
            复盘作战室
          </h1>
          <p class="text-cyan-500/70 text-xs md:text-sm mt-2 font-mono">
            系统用户: <span class="text-cyan-300">在线中</span> // UserName: {{ currentUser }}
          </p>
        </div>

        <!-- 中间：筛选组件 (新增) -->
        <div
          class="w-full lg:w-auto flex flex-col sm:flex-row gap-3 items-center bg-slate-900/50 p-3 rounded-lg border border-cyan-900/50 backdrop-blur-sm">
          选择时间范围
          <!-- 分割线 (仅桌面端显示) -->
          <div class="hidden sm:block w-px h-6 bg-cyan-800"></div>
          <!-- 日期范围输入 -->
          <el-date-picker
            prefix-icon="none"
            v-model="yearRange"
            type="yearrange"
            unlink-panels
            start-placeholder="开始"
            end-placeholder="结束"
            :shortcuts="shortcuts"
          />
        </div>

        <!-- 右侧：新建按钮 -->
        <div class="w-full lg:w-auto flex items-center justify-end gap-3">
          <span class="text-sm font-medium"
                :class="isFinanceReviewOpen?'text-gray-100':'text-gray-500'"

          >财务复盘</span>
          <el-switch
            v-model="isFinanceReviewOpen"
            :active-action-icon="View"
            :inactive-action-icon="Hide"
          />
        </div>

      </header>
      <!--目标-->
      <section
        class="w-full md:px-8 -mt-10 relative z-30 mt-10"

      >
        <!-- 标题区域 -->
        <div class="flex items-end gap-4 mb-8 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
      <span
        class="text-cyan-400 text-shadow-lg text-shadow-cyan-400/50 glitch-text"
        data-text="目标"
      >
        目标
      </span>
          </h2>
          <span class="font-mono text-xs text-slate-300 mb-1">:: 年度目标复盘</span>
        </div>

        <!-- 图表区域 - 第一行：使用 12 列栅格系统统一规划 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

          <!-- 左侧大图 (Console Chart) - 占 2 列 -->
          <div class="lg:col-span-2 h-full">
            <!-- 添加 h-full 和 min-h 确保高度拉伸 -->
            <div class="h-full min-h-[300px]">
              <console-chart :title="'目标进度'" :value="goalReviewData.goalCompletion" />
            </div>
          </div>

          <!-- 中间饼图 (目标分类) - 占 5 列 -->
          <div class="lg:col-span-5 h-full">
            <div class="h-full min-h-[300px]">
              <pie-chart
                :title="'目标安排情况'"
                :data="goalReviewData.goalCatePie"
              />
            </div>
          </div>

          <!-- 右侧饼图 (完成情况) - 占 5 列 -->
          <div class="lg:col-span-5 h-full">
            <div class="h-full min-h-[300px]">
              <pie-chart
                :title="'完成情况'"
                :data="goalReviewData.goalCompletionList"
              />
            </div>
          </div>
        </div>

        <!-- 图表区域 - 第二行：使用 12 列栅格系统 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <!-- 曲线图 - 占 4 列 -->
          <div class="lg:col-span-4 h-full">
            <div class="h-full min-h-[300px]">
              <line-chart :title="'完成率曲线'" />
            </div>
          </div>

          <!-- 条形图 - 占 8 列 -->
          <div class="lg:col-span-8 h-full">
            <div class="h-full min-h-[300px]">
              <bar-chart
                :title="'目标专注时间分布'"
                :chart-data="goalReviewData.consumeTimeDistribution"
              />
            </div>
          </div>

        </div>
      </section>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue'
import useUserStore from '@/stores/user.js'
import TodoCard from '@/views/todo/component/TodoCard.vue'
import SwiperComponent from '@/components/SwiperComponent.vue'
import useGoalStore from '@/stores/goal/goal.js'
import { dayjs, ElMessageBox, ElNotification } from 'element-plus'
import isoWeek from 'dayjs/plugin/isoWeek'
import GoalCard from '@/views/goal/component/GoalCard.vue'
import useOkrStore from '@/stores/okr/okr.js'
import useProgramStore from '@/stores/program/program.js'
import ProgramCard from '@/views/program/component/ProgramCard.vue'
import OkrCard from '@/views/okr/component/OkrCard.vue'
import { Hide, View } from '@element-plus/icons-vue'
import ConsoleChart from '@/components/chart/ConsoleChart.vue'
import PieChart from '@/components/chart/PieChart.vue'
import LineChart from '@/components/chart/LineChart.vue'
import BarChart from '@/components/chart/BarChart.vue'
import IndicatorCard from '@/components/IndicatorCard.vue'
import WordCloudChart from '@/components/chart/WordCloudChart.vue'
import useReviewStore from '@/stores/review.js'

dayjs.extend(isoWeek)
const userStore = useUserStore()
// 模拟当前用户名称
const currentUser = userStore.userInfo.username

// 获取数据/监听数据
const goalReviewData = ref({
  // 目标进度
  goalCompletion: null,
  // 目标专注时间分布
  consumeTimeDistribution: {
    categories: [],
    series: []
  },
  // 饼图数据
  goalCatePie:[],
  goalCompletionList:[]
})
const goalReviewList = ref([])
const queryParams = ref({})
const reviewStore = useReviewStore()
const fetchGoalReview = async () => {
  const res = await reviewStore.getGoalReview(queryParams.value)
  if (res.data.code === 200) {
    // 条形图数据
    goalReviewData.value.consumeTimeDistribution.categories = res.data.data.consumeTimeDistribution.categories
    goalReviewData.value.consumeTimeDistribution.series = res.data.data.consumeTimeDistribution.series
    // 进度数据
    goalReviewData.value.goalCompletion = res.data.data.goalCompletion

    // 饼图数据
    goalReviewData.value.goalCatePie = res.data.data.goalCateList
    goalReviewData.value.goalCompletionList = res.data.data.goalCompletionList
  }else{
    ElNotification.error({
      title:'失败',
      message:res.data.msg
    })
  }
}

// 财务复盘板块展示开关
const isFinanceReviewOpen = ref(false)

onMounted(async () => {
  await fetchGoalReview()
})

</script>

<style scoped>
/* 赛博朋克斜切角按钮 */
.clip-path-slant {
  clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
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
  opacity: 0.8;
}

.glitch-text::before {
  color: #f0f;
  z-index: -1;
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}

.glitch-text::after {
  color: #0ff;
  z-index: -2;
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% {
    clip-path: inset(20% 0 80% 0);
    transform: translate(-2px, 1px);
  }
  20% {
    clip-path: inset(60% 0 10% 0);
    transform: translate(2px, -1px);
  }
  40% {
    clip-path: inset(40% 0 50% 0);
    transform: translate(-2px, 2px);
  }
  60% {
    clip-path: inset(80% 0 5% 0);
    transform: translate(2px, -2px);
  }
  80% {
    clip-path: inset(10% 0 70% 0);
    transform: translate(-1px, 1px);
  }
  100% {
    clip-path: inset(30% 0 20% 0);
    transform: translate(1px, -1px);
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip-path: inset(10% 0 60% 0);
    transform: translate(2px, -1px);
  }
  20% {
    clip-path: inset(80% 0 5% 0);
    transform: translate(-2px, 2px);
  }
  40% {
    clip-path: inset(30% 0 20% 0);
    transform: translate(2px, 1px);
  }
  60% {
    clip-path: inset(15% 0 80% 0);
    transform: translate(-1px, -2px);
  }
  80% {
    clip-path: inset(50% 0 30% 0);
    transform: translate(1px, 2px);
  }
  100% {
    clip-path: inset(5% 0 90% 0);
    transform: translate(-2px, 1px);
  }
}
</style>
