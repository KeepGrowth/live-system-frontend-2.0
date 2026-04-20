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
      <swiper-component class="mb-5" v-if="swiperImagesList.length > 0" :images="swiperImagesList" />
      <!--财务-->
      <section
        class=" w-full md:px-8 -mt-10 relative z-30 mt-10"
        v-if="todoOkrs && todoOkrs.length > 0 && isFinanceReviewOpen"
      >
        <!-- 标题区域 -->
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
        <span
          class="text-cyan-400 text-shadow-lg text-shadow-cyan-400/50 glitch-text"
          data-text="财务"
        >
          财务
        </span>
          </h2>
          <span class="font-mono text-xs text-slate-300 mb-1">:: 财务复盘</span>
        </div>
        <!--图表区域-->
        <div class="mb-19 grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- 左侧大图 -->
          <div class="lg:col-span-1 space-y-6">
            <console-chart :title="'目标进度'" :value="87" />
          </div>

          <div class="lg:col-span-1 space-y-6">
            <pie-chart :title="'目标分类饼图'" />
          </div>

          <div class="lg:col-span-2 space-y-6">
            <pie-chart :title="'完成情况'" />
          </div>

        </div>
        <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <line-chart
              :title="'完成率曲线'"
            />
          </div>
          <div class="lg:col-span-4 space-y-6">
            <bar-chart
              :title="'消费时间目标分布条'"
            />
          </div>


        </div>

      </section>
      <!--目标-->
      <section
        class="w-full md:px-8 -mt-10 relative z-30 mt-10"
        v-if="todoOkrs && todoOkrs.length > 0"
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
        <!-- 比例分配：2:5:5 (即 1/6, ~40%, ~40%) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

          <!-- 左侧大图 (Console Chart) - 占 2 列 -->
          <div class="lg:col-span-2 h-full">
            <!-- 添加 h-full 和 min-h 确保高度拉伸 -->
            <div class="h-full min-h-[300px]">
              <console-chart :title="'目标进度'" :value="87" />
            </div>
          </div>

          <!-- 中间饼图 (目标分类) - 占 5 列 -->
          <div class="lg:col-span-5 h-full">
            <div class="h-full min-h-[300px]">
              <pie-chart :title="'目标分类饼图'" />
            </div>
          </div>

          <!-- 右侧饼图 (完成情况) - 占 5 列 -->
          <div class="lg:col-span-5 h-full">
            <div class="h-full min-h-[300px]">
              <pie-chart :title="'完成情况'" />
            </div>
          </div>
        </div>

        <!-- 图表区域 - 第二行：使用 12 列栅格系统 -->
        <!-- 比例分配：4:8 (即 1/3, 2/3) -->
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
              <bar-chart :title="'消费时间目标分布条'" />
            </div>
          </div>

        </div>
      </section>
      <!--项目-->
      <section
        class=" w-full md:px-8 -mt-10 relative z-30 mt-10"
        v-if="todoOkrs && todoOkrs.length > 0"
      >
        <!-- 标题区域 -->
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
        <span
          class="text-cyan-400 text-shadow-lg text-shadow-cyan-400/50 glitch-text"
          data-text="项目"
        >
          项目
        </span>
          </h2>
          <span class="font-mono text-xs text-slate-300 mb-1">:: 年度项目复盘</span>
        </div>
        <div class="mb-19 grid grid-cols-1 md:grid-cols-6 gap-6">
          <div class="lg:col-span-1 space-y-6">
            <indicator-card />
          </div>
        </div>
        <!--图表区域-->
        <div class="mb-19 grid grid-cols-1 md:grid-cols-6 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <console-chart :title="'项目进度'" :value="87" />
          </div>

          <div class="lg:col-span-3 space-y-6">
            <pie-chart :title="'完成情况'" />
          </div>


        </div>
        <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <line-chart
              :title="'完成率曲线'"
            />
          </div>
          <div class="lg:col-span-4 space-y-6">
            <bar-chart
              :title="'消费时间目标分布条'"
            />
          </div>


        </div>
      </section>
      <!--OKR-->
      <section
        class=" w-full md:px-8 -mt-10 relative z-30 mt-10"
        v-if="todoOkrs && todoOkrs.length > 0"
      >
        <!-- 标题区域 -->
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
        <span
          class="text-red-400 text-shadow-lg text-shadow-red-400/50 glitch-text"
          data-text="OKR"
        >
          OKR
        </span>
          </h2>
          <span class="font-mono text-xs text-slate-300 mb-1">:: 关键达成节点复盘</span>
        </div>
        <div class="mb-19 grid grid-cols-1 md:grid-cols-6 gap-6">
          <div class="lg:col-span-1 space-y-6">
            <indicator-card />
          </div>
        </div>
        <!--图表区域-->
        <div class="mb-19 grid grid-cols-1 md:grid-cols-6 gap-6">

          <div class="lg:col-span-2 space-y-6">
            <console-chart :title="'项目进度'" :value="87" />
          </div>

          <div class="lg:col-span-3 space-y-6">
            <pie-chart :title="'完成情况'" />
          </div>


        </div>
        <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <line-chart
              :title="'完成率曲线'"
            />
          </div>
          <div class="lg:col-span-4 space-y-6">
            <bar-chart
              :title="'消费时间目标分布条'"
            />
          </div>


        </div>

      </section>
      <!--Todo复盘-->
      <section
        class=" w-full md:px-8 -mt-10 relative z-30 mt-10"
        v-if="todoOkrs && todoOkrs.length > 0"
      >
        <!-- 标题区域 -->
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
        <span
          class="text-red-400 text-shadow-lg text-shadow-red-400/50 glitch-text"
          data-text="Todo"
        >
          Todo
        </span>
          </h2>
          <span class="font-mono text-xs text-slate-300 mb-1">:: 待办清单复盘</span>
        </div>
        <div class="mb-19 grid grid-cols-1 md:grid-cols-6 gap-6">
          <div class="lg:col-span-1 space-y-6 h-full">
            <indicator-card
              :title="'累计Todo'"
            />
          </div>
          <div class="lg:col-span-1 space-y-6 h-full">
            <indicator-card
              :title="'平均满意度'"
            />
          </div>
        </div>
        <!--图表区域-->
        <div class="mb-19 grid grid-cols-1 md:grid-cols-6 gap-6">
          <div class="lg:col-span-2 space-y-6 h-full">
            <pie-chart
              :title="'完成情况'"
            />
          </div>
          <div class="lg:col-span-4 space-y-6 h-full">
            <line-chart
              class="h-full"
              :title="'完成率曲线'"
            />
          </div>
        </div>
        <div class="mb-19 grid grid-cols-1 md:grid-cols-6 gap-6">

          <div class="lg:col-span-4 space-y-6 h-full">
            <line-chart
              :title="'专注时间分布'"
            />
          </div>
          <div class="lg:col-span-2 space-y-6 h-full">
            <word-cloud-chart
              class="h-full"
              :title="'重要性分布'"
            />
          </div>



        </div>
        <div class="mb-19 grid grid-cols-1 md:grid-cols-6 gap-6">
          <div class="lg:col-span-4 space-y-6 h-full">
            <bar-chart
              class="h-full"
              :title="'重要性分布'"
            />
          </div>
          <div class="lg:col-span-2 space-y-6 h-full">
            <bar-chart
              class="h-full"
              :title="'专注时间分布'"
            />
          </div>

        </div>
        <div class="mb-19 grid grid-cols-1 md:grid-cols-6 gap-6">


        </div>

      </section>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
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

dayjs.extend(isoWeek)
const userStore = useUserStore()
// 模拟当前用户名称
const currentUser = userStore.userInfo.username


// 模态框状态
const isModalOpen = ref(false)
const editMode = ref(false)

// 表单数据模型
const defaultForm = {}

const okrForm = ref({
  id: null
})

// 打开模态框
const openModal = (okr = null) => {
  if (okr) {
    editMode.value = true
    okrForm.value = okr
  } else {
    editMode.value = false
    okrForm.value = {
      startYear: new Date()
    }
    okrForm.userId = currentUser // 确保User ID正确
  }
  isModalOpen.value = true
}

// (新增/修改)
const programStore = useProgramStore()
const saveOkr = async () => {
  if (editMode.value) {
    // 更新
    const res = await okrStore.updateOkr(okrForm.value)
    if (res.data.code === 200) {
      ElNotification.success({
        title: '成功',
        message: res.data.msg
      })
      await fetchOkrData()
      isModalOpen.value = false
    } else {
      ElNotification.error({
        title: '更新todo失败',
        message: res.data.msg
      })
    }
  } else {
    // 模拟新增
    const res = await okrStore.addOkr(okrForm.value)
    if (res.data.code === 200) {
      ElNotification.success({
        title: '成功',
        message: res.data.msg
      })
      isModalOpen.value = false
      await fetchOkrData()
    } else {
      ElNotification.error({
        title: '失败',
        message: res.data.msg
      })
    }
  }
  isModalOpen.value = false
}

// 删除任务
const deleteProgram = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除此任务吗？', '提示', {
      type: 'warning'
    })
    const res = await programStore.delProgram(id)
    if (res.data.code === 200) {
      ElNotification.success('删除成功')
      await fetchOkrData()
    } else {
      ElNotification.error(res.data.msg)
    }


  } catch (error) {

  }

}

// 辅助函数：状态样式
const getStatusColor = (status) => {
  switch (status) {
    case 0:
      return 'border-l-4 border-l-gray-400' // 待开始
    case 1:
      return 'border-l-4 border-l-yellow-400' // 完成
    case 2:
      return 'border-l-4 border-l-emerald-500 opacity-75' // 放弃
    default:
      return 'border-l-4 border-l-cyan-500' // 待办
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 0:
      return { text: '待完成', color: 'border-gray-500/50 text-yellow-500 bg-gray-500/10' }
    case 1:
      return { text: '进行中', color: 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' }
    case 2:
      return { text: '已完成', color: 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' }
    case 3:
      return { text: '已放弃', color: 'border-red-500/50 text-red-500 bg-red-500/10' }
    default:
      return { text: '待开始', color: 'border-cyan-500/50 text-cyan-500 bg-cyan-500/10' }
  }
}

// 条件筛选的选择方法
// 定义当前选中的类型，默认可以是 'today'
const activeType = ref('today')

// 定义基础样式（所有按钮共有的样式）
const baseClass = 'cursor-pointer px-3 py-1.5 text-xs font-bold rounded transition-all duration-300'

// 定义高亮样式（选中时的样式）
const activeClass = 'text-cyan-900 bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] hover:scale-105'

// 定义默认样式（未选中时的样式）
const inactiveClass = 'text-cyan-400 border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-500/20 hover:border-cyan-400'

// 计算属性
const todoOkrs = computed(() => {
  return okrList.value.filter(item => item.status === 0)
})

const finishedOkrs = computed(() => {
  return okrList.value.filter(item => item.status === 1)
})
const giveUpOkrs = computed(() => {
  return okrList.value.filter(item => item.status === 2)
})
// 滑动轮播图计算属性
const swiperImagesList = computed(() => {
  return finishedOkrs.value
    .map(item => item.imageUrls ? item.imageUrls : [])
    .flat()
})

// 获取数据/监听数据
const okrList = ref([]) // 任务列表数据
// 默认今年的数据
const yearRange = ref([String(new Date().getFullYear()), String(new Date().getFullYear())])
const queryParams = ref({
  startYear: yearRange[0],
  endYear: yearRange[1]
})
const total = ref(0)
const okrStore = useOkrStore()
const fetchOkrData = async () => {
  const res = await okrStore.getOkrList(queryParams.value)
  if (res.data.code === 200) {
    okrList.value = res.data.data.okrList
    total.value = res.data.data.total
  }
}
// 监听数据
watch(yearRange, async (newVal, old) => {
  queryParams.value.startYear = yearRange.value[0].getFullYear().toString()
  queryParams.value.endYear = yearRange.value[1].getFullYear().toString()
  console.log(queryParams.value)

  await fetchOkrData()
}, { deep: true })

// 级联选项
let programOptions = ref([])
const fetchProgramOptions = async () => {
  const res = await programStore.getOptions()
  if (res.data.code === 200) {
    programOptions.value = res.data.data
  } else {
    ElNotification.error({
        title: '级联选项获取失败',
        message: res.data.msg
      }
    )
  }
}

// 财务复盘板块展示开关
const isFinanceReviewOpen = ref(false)


onMounted(async () => {
  await fetchOkrData()
  await fetchProgramOptions()
})

// 年份日期快捷选项
const shortcuts = [
  {
    text: '最近1年',
    value: [new Date(), new Date()]
  },
  {
    text: '最近3年',
    value: () => {
      const end = new Date()
      const start = new Date(
        new Date().setFullYear(new Date().getFullYear() - 3)
      )
      return [start, end]
    }
  },
  {
    text: '最近5年',
    value: () => {
      const start = new Date()
      const end = new Date(
        new Date().setFullYear(new Date().getFullYear() - 5)
      )
      return [start, end]
    }
  }
]
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
