<template>
  <div
    class="min-h-screen w-full bg-slate-950 text-slate-200 font-mono selection:bg-cyan-500 selection:text-black relative">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 z-0 opacity-20"
         style="background-image: linear-gradient(0deg, transparent 24%, #22d3ee 25%, #22d3ee 26%, transparent 27%, transparent), linear-gradient(90deg, transparent 24%, #e879f9 25%, #e879f9 26%, transparent 27%, transparent); background-size: 50px 50px;"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950"></div>

    <div class="relative z-10 w-full space-y-6 px-4 md:px-8">
      <!-- 头部区域 -->
      <header class="mb-10 border-b-2 border-cyan-500 pb-6 flex flex-col lg:flex-row justify-between items-end gap-6">

        <!-- 左侧：标题 -->
        <div class="w-full lg:w-auto">
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] glitch-text"
            data-text="项目档案室">
            项目档案室
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
            v-model="queryParams.startYear"
            type="year"
            value-format="YYYY"
            unlink-panels
          />
          <span>至</span>
          <el-date-picker
            prefix-icon="none"
            v-model="queryParams.endYear"
            type="year"
            value-format="YYYY"
            unlink-panels
          />
          <el-cascader
            clearable
            filterable
            placeholder="按照目标分组"
            :options="goalOptions"
            v-model="queryParams.goalId"
            :props="{ emitPath: false }"
          >
          </el-cascader>
          <div class="flex items-center gap-2">
            <el-select
              placeholder="状态"
              style="width: 100px"
              v-model="queryParams.programStatus"
              clearable
            >
              <el-option :value="0" label="待完成"></el-option>
              <el-option :value="1" label="进行中"></el-option>
              <el-option :value="2" label="已完成"></el-option>
              <el-option :value="3" label="已放弃"></el-option>
            </el-select>
          </div>
        </div>


        <!-- 右侧：新建按钮 -->
        <div class="w-full lg:w-auto flex justify-end">
          <button @click="openModal()"
                  class="cursor-pointer group relative px-6 py-3 bg-cyan-950/30 border border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all duration-300 clip-path-slant w-full sm:w-auto">
            <span
              class="cursor-pointer absolute w-0 h-0 top-0 left-0 bg-cyan-400 group-hover:w-full group-hover:h-full transition-all duration-300 -z-10"></span>
            + 新建项目
          </button>
        </div>

      </header>
      <swiper-component class="mb-5" v-if="swiperImagesList.length > 0" :images="swiperImagesList" />
      <div>
        <el-pagination
          class="mt-8 flex justify-center" v-if="programList?.length > 0"
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[30,40,50,60]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="fetchProgramData"
          @current-change="fetchProgramData"
        />
      </div>
      <!-- 任务列表网格 -->
      <!--待开始-->
      <section
        class="container mx-auto px-6 -mt-10 relative z-30 mt-10"
        v-if="todoPrograms && todoPrograms.length > 0"
      >
        <!-- 标题区域 -->
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
        <span
          class="text-cyan-400 text-shadow-lg text-shadow-cyan-400/50 glitch-text"
          data-text="待开始"
        >
          待开始
        </span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 加油</span>
        </div>
        <program-card
          :program-list="todoPrograms"
          @edit="openModal"
          @delete="deleteProgram"
        />
      </section>
      <!--进行中-->
      <section
        class="container mx-auto px-6 -mt-10 relative z-30 mt-10"
        v-if="runningPrograms && runningPrograms.length > 0"
      >
        <!-- 标题区域 -->
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
        <span
          class="text-yellow-400 text-shadow-lg text-shadow-yellow-400/50 glitch-text"
          data-text="进行中"
        >
          进行中
        </span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 加油</span>
        </div>
        <program-card
          :program-list="runningPrograms"
          @edit="openModal"
          @delete="deleteProgram"
        />
      </section>

      <!--已完成-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10" v-if="finishedPrograms.length>0">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-green-400 text-shadow-lg text-shadow-green-400/50 glitch-text"
                  data-text="已完成">已完成</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <program-card
          :program-list="finishedPrograms"
          @edit="openModal"
          @delete="deleteProgram"
        />
      </section>
      <!--已放弃-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10" v-if="giveUpPrograms.length>0">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-red-400 text-shadow-lg text-shadow-red-400/50">已放弃</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <program-card
          :program-list="giveUpPrograms"
          @edit="openModal"
          @delete="deleteProgram"
        />
      </section>
      <el-empty programDesc="暂无项目，新建一个开始你的一年吧。" v-if="programList.length===0" />

    </div>

    <!-- 模态框 (新增/编辑) -->
    <div v-if="isModalOpen"
         class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        class="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] p-1">
        <!-- 模态框装饰线条 -->
        <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 -mt-1 -ml-1"></div>
        <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 -mt-1 -mr-1"></div>
        <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-fuchsia-500 -mb-1 -ml-1"></div>
        <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fuchsia-500 -mb-1 -mr-1"></div>

        <div class="bg-slate-950 p-6 md:p-8 relative overflow-y-auto max-h-[90vh]">
          <h2 class="text-2xl font-bold text-cyan-400 mb-6 uppercase tracking-widest border-b border-slate-800 pb-2">
            {{ editMode ? '>> 修改' : '>> 新建' }}
          </h2>

          <form @submit.prevent="saveProgram" class="space-y-4">
            <!-- 第一行：标题与日期 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 项目名称 -->
              <div class="flex flex-col">
                <label class="text-xs text-cyan-500 uppercase font-bold mb-2">项目名称</label>
                <el-input
                  v-model="programForm.programName"
                  type="text"
                  placeholder="输入项目名称..."
                />
              </div>

              <!-- 开始日期 -->
              <div class="flex flex-col" style="margin: 0 auto">
                <label class="text-xs text-fuchsia-500 uppercase font-bold mb-2">预计开始时间</label>
                <!-- 关键点：添加 popper-class 用于定制下拉菜单的黑色主题 -->
                <el-date-picker
                  prefix-icon="none"
                  v-model="programForm.estimateStartTime"
                  type="date"
                  value-format="YYYY-MM-DD"
                  popper-class="dark-date-picker"
                  class="w-full"
                />
              </div>

              <!-- 结束日期 -->
              <div class="flex flex-col">
                <label class="text-xs text-fuchsia-500 uppercase font-bold mb-2">预计结束时间</label>
                <el-date-picker
                  prefix-icon="none"
                  v-model="programForm.estimateFinishTime"
                  type="date"
                  value-format="YYYY-MM-DD"

                  popper-class="dark-date-picker"
                  class="w-full"
                />
              </div>
            </div>

            <!-- 第二行：描述 -->
            <div class="space-y-1">
              <label class="text-xs text-cyan-500 uppercase font-bold">项目描述</label>
              <textarea v-model="programForm.programDesc" rows="12"
                        class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                        placeholder="详细描述项目..."></textarea>
            </div>

            <!-- 第三行：参数设置 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase">绑定目标</label>
                <el-cascader
                  filterable
                  clearable
                  v-model="programForm.goalId"
                  :options="goalOptions"
                  :show-all-levels="false"
                  :props="{ emitPath: false }"
                />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase">状态</label>
                <el-select v-model="programForm.programStatus">
                  <el-option :value="0" :label="'待开始'"></el-option>
                  <el-option :value="1" :label="'进行中'"></el-option>
                  <el-option :value="2" :label="'完成'"></el-option>
                  <el-option :value="3" :label="'放弃'"></el-option>
                </el-select>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase">满意度</label>
                <el-rate v-model.number="programForm.satisfactionScore"></el-rate>
              </div>

            </div>

            <!-- 按钮 -->
            <div class="pt-4 flex justify-end gap-4">
              <button type="button" @click="isModalOpen = false"
                      class="cursor-pointer px-6 py-2 border border-slate-600 text-slate-400 hover:text-white hover:border-white transition-colors uppercase text-sm font-bold">
                取消
              </button>
              <button
                type="submit"
                class="cursor-pointer px-6 py-2 bg-cyan-600 text-black hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all uppercase text-sm font-black tracking-wider clip-path-slant">
                提交
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import useUserStore from '@/stores/user.js'
import TodoCard from '@/views/todo/component/TodoCard.vue'
import SwiperComponent from '@/components/SwiperComponent.vue'
import useProgramStore from '@/stores/program/program.js'
import { dayjs, ElMessageBox, ElNotification } from 'element-plus'
import isoWeek from 'dayjs/plugin/isoWeek'
import useOkrStore from '@/stores/okr/okr.js'
import ProgramCard from '@/views/program/component/ProgramCard.vue'
import useGoalStore from '@/stores/goal/goal.js'

dayjs.extend(isoWeek)
const userStore = useUserStore()
// 模拟当前用户名称
const currentUser = userStore.userInfo.username


// 模态框状态
const isModalOpen = ref(false)
const editMode = ref(false)


const programForm = ref({
  id: null
})

// 打开模态框
const openModal = (program = null) => {
  if (program) {
    editMode.value = true
    programForm.value = program
  } else {
    editMode.value = false
    programForm.value = {
      startYear: new Date(),
      programStatus: 0
    }
    programForm.userId = currentUser // 确保User ID正确
  }
  isModalOpen.value = true
}

// (新增/修改)项目
const saveProgram = async () => {
  if (editMode.value) {
    // 更新
    const res = await programStore.updateProgram(programForm.value)
    if (res.data.code === 200) {
      ElNotification.success({
        title: '成功',
        message: res.data.msg
      })
      await fetchProgramData()
      isModalOpen.value = false
    } else {
      ElNotification.error({
        title: '更新todo失败',
        message: res.data.msg
      })
    }
  } else {
    // 模拟新增
    const res = await programStore.addProgram(programForm.value)
    if (res.data.code === 200) {
      ElNotification.success({
        title: '成功',
        message: res.data.msg
      })
      isModalOpen.value = false
      await fetchProgramData()
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
      await fetchProgramData()
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
      return 'border-l-4 border-l-yellow-400' // 进行中
    case 2:
      return 'border-l-4 border-l-emerald-500 opacity-75' // 完成
    case 3:
      return 'border-l-4 border-l-red-500 opacity-50 grayscale' // 放弃
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
const todoPrograms = computed(() => {
  return programList?.value.filter(item => item.programStatus === 0) || []
})

const runningPrograms = computed(() => {
  return programList?.value.filter(item => item.programStatus === 1) || []
})
const finishedPrograms = computed(() => {
  return programList?.value.filter(item => item.programStatus === 2) || []
})
const giveUpPrograms = computed(() => {
  return programList?.value.filter(item => item.programStatus === 3) || []
})
// 滑动轮播图计算属性
const swiperImagesList = computed(() => {
  return finishedPrograms?.value
    .map(item => item.imageUrls ? item.imageUrls : [])
    .flat()
})


// 获取数据/监听数据
const programList = ref([]) // 任务列表数据
// 默认今年的数据
const dateStr = dayjs().format('YYYY')
const queryParams = ref({
  startYear: dateStr,
  endYear: dateStr,
  goalId: null,
  page: 1,
  pageSize: 30,
  programStatus: 2
})
const total = ref(0)
const programStore = useProgramStore()
const fetchProgramData = async () => {
  const res = await programStore.getProgramList(queryParams.value)
  if (res.data.code === 200) {
    programList.value = res.data.data?.programList || []
    total.value = res.data.data.total
  }
}
// 监听数据
watch(queryParams, async (newVal, old) => {
  await fetchProgramData()
}, { deep: true, immediate: true })

// 级联选项
let goalOptions = ref([])
const goalStore = useGoalStore()
const fetchGoalOptions = async () => {
  const res = await goalStore.getOptions()
  if (res.data.code === 200) {
    goalOptions.value = res.data.data
  } else {
    ElNotification.error({
        title: '目标级联选项获取失败',
        message: res.data.msg
      }
    )
  }
}


onMounted(async () => {
  await fetchProgramData()
  await fetchGoalOptions()
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
