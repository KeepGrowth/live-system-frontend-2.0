<template>
  <div
    class="min-h-screen w-full bg-slate-950 text-slate-200 font-mono selection:bg-cyan-500 selection:text-black relative">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 z-0 opacity-20"
         style="background-image: linear-gradient(0deg, transparent 24%, #22d3ee 25%, #22d3ee 26%, transparent 27%, transparent), linear-gradient(90deg, transparent 24%, #e879f9 25%, #e879f9 26%, transparent 27%, transparent); background-size: 50px 50px;"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950"></div>

    <div class="relative z-10 container mx-auto p-4 md:p-8">
      <!-- 头部区域 -->
      <header class="mb-10 border-b-2 border-cyan-500 pb-6 flex flex-col lg:flex-row justify-between items-end gap-6">

        <!-- 左侧：标题 -->
        <div class="w-full lg:w-auto">
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] glitch-text"
            data-text="目标档案室">
            目标档案室
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
            value-format="YYYY"
            type="year"
            placeholder="开始年份"
            unlink-panels
          />
          <el-date-picker
            v-model="queryParams.endYear"
            value-format="YYYY"
            type="year"
            unlink-panels
            placeholder="结束年份"
          />
          <div class="flex items-center gap-2">
            <el-select
              placeholder="状态"
              style="width: 100px"
              v-model="queryParams.status"
              clearable
            >
              <el-option :value="0" label="待完成"></el-option>
              <el-option :value="1" label="进行中"></el-option>
              <el-option :value="2" label="已完成"></el-option>
              <el-option :value="3" label="已放弃"></el-option>
            </el-select>
          </div>
          <div class="flex items-center gap-2">
            <el-input
              placeholder="输入目标关键词"
              v-model="queryParams.keyWord"
            />
            <el-button type="primary" @click="fetchGoalData">搜索</el-button>
          </div>
        </div>

        <!-- 右侧：新建按钮 -->
        <div class="w-full lg:w-auto flex justify-end">
          <button @click="openModal()"
                  class="cursor-pointer group relative px-6 py-3 bg-cyan-950/30 border border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all duration-300 clip-path-slant w-full sm:w-auto">
            <span
              class="cursor-pointer absolute w-0 h-0 top-0 left-0 bg-cyan-400 group-hover:w-full group-hover:h-full transition-all duration-300 -z-10"></span>
            + 新建目标
          </button>
        </div>

      </header>
      <!-- 分页组件 -->
      <div>
        <el-pagination
          class="mt-8 flex justify-center" v-if="goalList.length > 0"
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[20,30,40,50,60]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="fetchGoalData"
          @current-change="fetchGoalData"
        />
      </div>
      <!-- 任务列表网格 -->
      <!--待开始-->
      <section
        class="container mx-auto px-6 -mt-10 relative z-30 mt-10"
        v-if="todoGoals.length>0"
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
        <goal-card
          :goal-data="todoGoals"
          @edit="openModal"
          @delete="deleteGoal"
        />
      </section>
      <!--进行中-->
      <section
        class="container mx-auto px-6 -mt-10 relative z-30 mt-10"
        v-if="runningGoals.length>0"
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
        <goal-card
          :goal-data="runningGoals"
          @edit="openModal"
          @delete="deleteGoal"
        />
      </section>

      <!--已完成-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10" v-if="finishedGoals.length>0">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-green-400 text-shadow-lg text-shadow-green-400/50 glitch-text"
                  data-text="已完成">已完成</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <goal-card
          :goal-data="finishedGoals"
          @edit="openModal"
          @delete="deleteGoal"
        />
      </section>
      <!--已放弃-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10" v-if="giveUpGoals.length>0">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-red-400 text-shadow-lg text-shadow-red-400/50">已放弃</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <goal-card
          :goal-data="giveUpGoals"
          @edit="openModal"
          @delete="deleteGoal"
        />
      </section>
      <el-empty description="暂无目标，新建一个开始你的一年吧。" v-if="goalList.length===0" />

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

          <form @submit.prevent="saveGoal" class="space-y-4">
            <!-- 第一行：标题与日期 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 目标名称 -->
              <div class="flex flex-col">
                <label class="text-xs text-cyan-500 uppercase font-bold mb-2">目标名称</label>
                <el-input
                  v-model="goalForm.goalName"
                  type="text"
                  placeholder="输入目标名称..."
                />
              </div>

              <!-- 开始日期 -->
              <div class="flex flex-col" style="margin: 0 auto">
                <label class="text-xs text-fuchsia-500 uppercase font-bold mb-2">开始日期</label>
                <!-- 关键点：添加 popper-class 用于定制下拉菜单的黑色主题 -->
                <el-date-picker
                  prefix-icon="none"
                  v-model="goalForm.startDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  popper-class="dark-date-picker"
                  class="w-full"
                />
              </div>

              <!-- 结束日期 -->
              <div class="flex flex-col">
                <label class="text-xs text-fuchsia-500 uppercase font-bold mb-2">结束日期</label>
                <el-date-picker
                  prefix-icon="none"
                  v-model="goalForm.finishDate"
                  type="date"
                  value-format="YYYY-MM-DD"

                  popper-class="dark-date-picker"
                  class="w-full"
                />
              </div>
            </div>

            <!-- 第二行：描述 -->
            <div class="space-y-1">
              <label class="text-xs text-cyan-500 uppercase font-bold">目标描述</label>
              <textarea v-model="goalForm.description" rows="12"
                        class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                        placeholder="详细描述目标..."></textarea>
            </div>

            <!-- 第三行：参数设置 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase">类别</label>
                <el-select
                  v-model="goalForm.goalCategoryId"
                  placeholder="请选择类别"
                  popper-class="dark-select-popper"
                  class="w-full"
                >
                  <el-option :value="1" label="实践" />
                  <el-option :value="2" label="思维" />
                </el-select>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase">状态</label>
                <el-select v-model="goalForm.goalStatus">
                  <el-option :value="0" :label="'待开始'"></el-option>
                  <el-option :value="1" :label="'进行中'"></el-option>
                  <el-option :value="2" :label="'完成'"></el-option>
                  <el-option :value="3" :label="'放弃'"></el-option>
                </el-select>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase">满意度</label>
                <el-rate v-model.number="goalForm.satisfactionScore"></el-rate>
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
import useUserStore from '@/stores/user.ts'
import TodoCard from '@/views/todo/component/TodoCard.vue'
import SwiperComponent from '@/components/SwiperComponent.vue'
import useGoalStore from '@/stores/goal/goal.js'
import { dayjs, ElMessageBox, ElNotification } from 'element-plus'
import isoWeek from 'dayjs/plugin/isoWeek'
import GoalCard from '@/views/goal/component/GoalCard.vue'

dayjs.extend(isoWeek)
const userStore = useUserStore()
// 模拟当前用户名称
const currentUser = userStore.userInfo.username


// 模态框状态
const isModalOpen = ref(false)
const editMode = ref(false)


const goalForm = ref({
  id: null,
  userId: null,
  goalName: '',
  description: '',
  goalCategoryId: null,
  goalStatus: null,
  satisfactionScore: null,
  startDate: '',
  finishDate: ''
})

// 打开模态框
const openModal = (goal = null) => {
  if (goal) {
    editMode.value = true
    goalForm.value = goal
  } else {
    editMode.value = false
    goalForm.value = {
      startYear: new Date()
    }
    goalForm.userId = currentUser // 确保User ID正确
  }
  isModalOpen.value = true
}

// (新增/修改)目标
const saveGoal = async () => {
  if (editMode.value) {
    // 模拟更新
    // goalForm.value.startDate = goalForm.value.startDate
    // goalForm.value.finishDate = goalForm.value.finishDate
    const res = await goalStore.updateGoal(goalForm.value)
    if (res.data.code === 200) {
      ElNotification.success({
        goalName: '成功',
        message: res.data.msg
      })
      await fetchGoalData()
      isModalOpen.value = false
    } else {
      ElNotification.error({
        goalName: '更新todo失败',
        message: res.data.msg
      })
    }
  } else {
    // 模拟新增
    // goalForm.value.startDate = goalForm.value.startDate
    // goalForm.value.finishDate = goalForm.value.finishDate
    const res = await goalStore.addGoal(goalForm.value)
    if (res.data.code === 200) {
      ElNotification.success({
        goalName: '成功',
        message: res.data.msg
      })
      isModalOpen.value = false
      await fetchGoalData()
    } else {
      ElNotification.error({
        goalName: '新增todo失败',
        message: res.data.msg
      })
    }
  }
  isModalOpen.value = false
}

// 删除
const deleteGoal = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除此目标吗？', '提示', {
      type: 'warning'
    })
    const res = await goalStore.delGoal(id)
    if (res.data.code === 200) {
      ElNotification.success('删除成功')
      await fetchGoalData()
    } else {
      ElNotification.error(res.data.msg)
    }


  } catch (error) {

  }

}

// 滑动轮播图计算属性
// const swiperImagesList = computed(() => {
//   return finishedGoals.value
//     .map(item => item.imageUrls ? item.imageUrls : [])
//     .flat()
//     .filter(url => url.trim() !== '')
// })


// 获取数据/监听数据
const goalList = ref([]) // 任务列表数据
// 默认今年的数据
const dateStr = dayjs().format('YYYY')
const queryParams = ref({
  startYear: dateStr,
  endYear: dateStr,
  page: 1,
  pageSize: 20,
  status: null
})
const goalStore = useGoalStore()
const fetchGoalData = async () => {
  const res = await goalStore.getGoalList(queryParams.value)
  if (res.data.code === 200) {
    goalList.value = res.data.data.goalList
    total.value = res.data.data.total
  } else {
    ElNotification.error({
      title: '获取数据失败'
    })
  }
}

// 计算属性
const todoGoals = computed(() => {
  return goalList?.value.filter(item => item.goalStatus === 0)
})

const runningGoals = computed(() => {
  return goalList?.value.filter(item => item.goalStatus === 1)
})
const finishedGoals = computed(() => {
  return goalList?.value.filter(item => item.goalStatus === 2)
})
const giveUpGoals = computed(() => {
  return goalList?.value.filter(item => item.goalStatus === 3)
})
const total = ref(0)

onMounted(async () => {
  await fetchGoalData()
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
