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
            data-text="Todo作战室">
            Todo作战室
          </h1>
          <p class="text-cyan-500/70 text-xs md:text-sm mt-2 font-mono">
            系统用户: <span class="text-cyan-300">在线中</span> // UserName: {{ currentUser }}
          </p>
        </div>

        <!-- 中间：筛选组件 (新增) -->
        <div
          class="w-full lg:w-auto flex flex-col sm:flex-row gap-3 items-center bg-slate-900/50 p-3 rounded-lg border border-cyan-900/50 backdrop-blur-sm">
          <!-- 快速按钮组 -->
          <div class="flex gap-2">
            <button
              @click="chooseDateRangeType('today')"
              :class="getButtonClass('today')"
            >
              今日
            </button>
            <button
              @click="chooseDateRangeType('thisWeek')"
              :class="getButtonClass('thisWeek')"
            >
              本周
            </button>
            <button
              @click="chooseDateRangeType('month')"
              :class="getButtonClass('month')"
            >
              本月
            </button>
          </div>

          <!-- 分割线 (仅桌面端显示) -->
          <div class="hidden sm:block w-px h-6 bg-cyan-800"></div>

          <!-- 日期范围输入 -->
          <div class="flex items-center gap-2">
            <el-date-picker
              v-model="queryParams.startDate"
              value-format="YYYY-MM-DD"
              type="date"
              class="bg-black/40 border border-cyan-800 text-cyan-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.4)] font-mono"
            />
          </div>
          <span>至</span>
          <div class="flex items-center gap-2">
            <el-date-picker
              v-model="queryParams.endDate"
              value-format="YYYY-MM-DD"
              type="date"
              class="bg-black/40 border border-cyan-800 text-cyan-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.4)] font-mono"
            />
          </div>
          <!-- 分割线 (仅桌面端显示) -->
          <div class="hidden sm:block w-px h-6 bg-cyan-800"></div>
          <!--状态选择框-->
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

        </div>

        <!-- 右侧：新建按钮 -->
        <div class="w-full lg:w-auto flex justify-end">
          <button @click="openModal()"
                  class="cursor-pointer group relative px-6 py-3 bg-cyan-950/30 border border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all duration-300 clip-path-slant w-full sm:w-auto">
            <span
              class="cursor-pointer absolute w-0 h-0 top-0 left-0 bg-cyan-400 group-hover:w-full group-hover:h-full transition-all duration-300 -z-10"></span>
            + 新建Todo
          </button>
        </div>

      </header>
      <swiper-component class="mb-5" v-model:images="todoImageList" />

      <div class="grid grid-cols-3 gap-4">
        <indicator-card
          :title="'累计专注时长'"
          subtitle="根据你选择的周期计算"
          unit="h"
          v-model:value="focusTimeTotal"
        />
        <indicator-card
          title="完成率"
          unit="%"
          :value="finishRate"
        />
        <indicator-card
          title="推进OKR数"
          unit="个"
          :value="pushedOkr"
        />
      </div>
      <!-- 分页组件 -->
      <div class="w-full lg:w-auto">
        <el-pagination
          class="mt-8 flex justify-center" v-if="tasks.length > 0"
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10,20,30,40]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="fetchTodoData"
          @current-change="fetchTodoData"
        />
      </div>
      <!-- 任务列表网格 -->
      <!--待办-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10" v-if="todoTasks.length>0">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-purple-400 text-shadow-lg text-shadow-purple-400/50 glitch-text"
                  data-text="待办">待办</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <todo-card
          :todo-list="todoTasks"
          @edit="openModal"
          @delete="deleteTask"
          @append-log="openLogModal"
          @display-okr="openOkrDisplayModal"
        />
      </section>
      <!--进行中-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10" v-if="runingTasks.length>0">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-yellow-400 text-shadow-lg text-shadow-yellow-400/50 glitch-text" data-text="正在进行中">正在进行中</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <todo-card
          :todo-list="runingTasks"
          @edit="openModal"
          @delete="deleteTask"
          @display-okr="openOkrDisplayModal"
          @append-log="openLogModal"
        />
      </section>
      <!--已完成-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10" v-if="finishedTasks.length>0">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-green-400 text-shadow-lg text-shadow-green-400/50 glitch-text"
                  data-text="已完成">已完成</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <todo-card
          :todo-list="finishedTasks"
          @edit="openModal"
          @delete="deleteTask"
          @append-log="openLogModal"
          @display-okr="openOkrDisplayModal"
        />
      </section>
      <!--已放弃-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10" v-if="giveUpTasks.length>0">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-red-400 text-shadow-lg text-shadow-red-400/50">已放弃</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <todo-card
          :todo-list="giveUpTasks"
          @edit="openModal"
          @delete="deleteTask"
          @append-log="openLogModal"
          @display-okr="openOkrDisplayModal"
        />
      </section>
      <el-empty description="暂无待办，新建一个开始你的一天吧。" v-if="tasks.length===0" />

    </div>

    <!-- todo模态框 (新增/编辑) -->
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
            {{ editMode ? '>> 修改Todo' : '>> 新建Todo' }}
          </h2>

          <form @submit.prevent="saveTask" class="space-y-4">
            <!-- 第一行：标题与截止日期 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs text-cyan-500 uppercase font-bold">任务标题</label>
                <input v-model="form.title" type="text" required
                       class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all"
                       placeholder="输入任务名称...">
              </div>
              <div class="space-y-1">
                <label class="text-xs text-fuchsia-500 uppercase font-bold">截止日期</label>
                <input v-model="form.deadline" type="date"
                       class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-fuchsia-500 focus:shadow-[0_0_10px_rgba(232,121,249,0.3)] transition-all">
              </div>
            </div>

            <!-- 第二行：目标与描述 -->
            <div class="space-y-1">
              <label class="text-xs text-cyan-500 uppercase font-bold">核心目标</label>
              <textarea v-model="form.todoGoal" rows="12"
                        class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                        placeholder="详细描述任务目标..."></textarea>
            </div>

            <!-- 第三行：参数设置 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase">重要性</label>
                <select v-model="form.importance"
                        class="w-full bg-slate-900 border border-slate-700 text-yellow-400 p-2 focus:outline-none focus:border-yellow-500">
                  <option :value="0" class="text-green-400">不紧急不重要</option>
                  <option :value="1" class="text-purple-400">不紧急重要</option>
                  <option :value="2" class="text-yellow-400">紧急不重要</option>
                  <option :value="3" class="text-red-400">紧急重要</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase">状态</label>
                <select v-model="form.status"
                        class="w-full bg-slate-900 border border-slate-700 text-cyan-400 p-2 focus:outline-none focus:border-cyan-500">
                  <option :value="0">待办</option>
                  <option :value="1">进行中</option>
                  <option :value="2">完成</option>
                  <option :value="3">放弃</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase" disabled>专注时间（分钟）</label>
                <el-input disabled v-model.number="form.focusTime" type="number"
                          placeholder="分钟">
                </el-input>
              </div>

            </div>
            <div class="space-y-1" v-if="form.status===3">
              <label class="text-xs text-cyan-500 uppercase font-bold">放弃描述</label>
              <textarea v-model="form.quitDesc" rows="5"
                        class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                        placeholder="放弃是一件需要勇气的事情，而你做到一点，你只需要在此处记录原因方便追踪即可，不必活在过去。"></textarea>
            </div>
            <div class="space-y-1" v-if="form.status===2">
              <label class="text-xs text-cyan-500 uppercase font-bold">完成总结</label>
              <textarea v-model="form.finishDesc" rows="5"
                        class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                        placeholder="恭喜你完成此待办，距离你的目标又推进了一步！说说你的感受和值得记录的事情吧~"></textarea>
            </div>

            <!-- 隐藏字段模拟 -->
            <div class="grid grid-cols-2 gap-4 opacity-50 hover:opacity-100 transition-opacity">
              <div class="space-y-1">
                <label class="text-[10px] uppercase">关联OKR</label>
                <el-cascader
                  filterable
                  clearable
                  v-model="form.okrId"
                  :options="okrOptions"
                  :show-all-levels="false"
                  :props="{ emitPath: false }"
                />
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

    <!--    todo日志模态框（新增、编辑）-->
    <TodoLogModal
      v-model="isLogModalOpen"
      :initial-data="{todoId:currentTodoId}"
      @submit="handleLogSubmit"
    />
    <okr-dis-play
      v-model="okrDisplayOpen"
      :data="currentOkr"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import useUserStore from '@/stores/user.js'
import TodoCard from '@/views/todo/component/TodoCard.vue'
import SwiperComponent from '@/components/SwiperComponent.vue'
import useTodoStore from '@/stores/todo/todo.js'
import { dayjs, ElMessageBox, ElNotification } from 'element-plus'
import isoWeek from 'dayjs/plugin/isoWeek'
import useOkrStore from '@/stores/okr/okr.js'
import TodoLogModal from '@/views/todo_log/component/TodoLogModal.vue'
import useTodoLogStore from '@/stores/todo/todoLog.js'
import IndicatorCard from '@/components/IndicatorCard.vue'
import OkrDetail from '@/views/okr/OkrDetail.vue'
import OkrDisPlay from '@/views/okr/component/OkrDisPlay.vue'


dayjs.extend(isoWeek)
const userStore = useUserStore()
// 模拟当前用户名称
const currentUser = userStore.userInfo.username


// 模态框状态
const isModalOpen = ref(false)
const editMode = ref(false)


const form = ref({
  id: null,
  userId: null,
  title: '',
  todoGoal: '',
  finishDesc: '',
  quitDesc: '',
  importance: null,
  status: 0,
  focusTime: 0,
  deadline: '',
  emotion: '',
  goalId: null,
  programId: null,
  okrId: null
})

// 打开模态框
const openModal = (task = null) => {
  if (task) {
    editMode.value = true
    form.value = task
  } else {
    editMode.value = false
    form.value = {}
    if (queryParams.value.endDate) {
      form.value.deadline = queryParams.value.endDate
    }
    form.value.importance = 1
    form.value.status = 0
    form.userId = currentUser // 确保User ID正确
  }
  isModalOpen.value = true
}

// 保存任务 (新增/修改)
const saveTask = async () => {
  if (editMode.value) {
    // 模拟更新
    const res = await todoStore.updateTodo(form.value)
    if (res.data.code === 200) {
      ElNotification.success({
        title: '成功',
        message: res.data.msg
      })
      await fetchTodoData()
      isModalOpen.value = false
    } else {
      ElNotification.error({
        title: '更新todo失败',
        message: res.data.msg
      })
    }
  } else {
    // 模拟新增
    const res = await todoStore.addTodo(form.value)
    if (res.data.code === 200) {
      ElNotification.success({
        title: '成功',
        message: res.data.msg
      })
      isModalOpen.value = false
      await fetchTodoData()
    } else {
      ElNotification.error({
        title: '新增todo失败',
        message: res.data.msg
      })
    }
  }
  isModalOpen.value = false
}

// 删除任务
const deleteTask = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除此任务吗？', '提示', {
      type: 'warning'
    })
    const res = await todoStore.delTodo(id)
    if (res.data.code === 200) {
      ElNotification.success('删除成功')
      await fetchTodoData()
    } else {
      ElNotification.error(res.data.msg)
    }


  } catch (error) {

  }

}

// 打开OKR详情
const okrDisplayOpen = ref(false)
const currentOkr = ref()
const openOkrDisplayModal = async (okrId) => {
  okrDisplayOpen.value = true
  const res = await okrStore.getOkrById(okrId)
  currentOkr.value = res.data.data

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
// 获取完整类名的函数
const getButtonClass = (type) => {
  const isActive = activeType.value === type
  return `${baseClass} ${isActive ? activeClass : inactiveClass}`
}

// 计算属性
const todoTasks = computed(() => {
  return tasks.value.filter(item => item.status === 0)
})

const runingTasks = computed(() => {
  return tasks.value.filter(item => item.status === 1)
})
const finishedTasks = computed(() => {
  return tasks.value.filter(item => item.status === 2)
})
const giveUpTasks = computed(() => {
  return tasks.value.filter(item => item.status === 3)
})

// 取todo图片数组
const todoImageList = computed(() => {
  return tasks.value
    .flatMap(todo => {
      // 检查 imageList 是否存在且不为空
      const images = todo.imageList || []
      return images
        .filter(img => img.imageUrl) // 确保有 URL
        .map(img => ({
          // 1. 携带图片 URL
          imageUrl: img.imageUrl,
          // 2. 携带你需要的 ID 信息
          todoId: todo.id,
          okrId: todo.okrId,
          programId: todo.programId,
          goalId: todo.goalId
        }))
    })
  // .filter(item => item.imageUrl) // 过滤掉无效项
})

// 筛选条件
const chooseDateRangeType = async (dateType) => {
  activeType.value = dateType
  const day = dayjs()
  if (dateType === 'today') {
    queryParams.value.startDate = day.format('YYYY-MM-DD')
    queryParams.value.endDate = day.format('YYYY-MM-DD')
    await fetchTodoData()
  } else if (dateType === 'thisWeek') {
    queryParams.value.startDate = dayjs().startOf('isoWeek').format('YYYY-MM-DD')
    queryParams.value.endDate = dayjs().endOf('isoWeek').format('YYYY-MM-DD')
    await fetchTodoData()
  } else {
    queryParams.value.startDate = dayjs().startOf('month').format('YYYY-MM-DD')
    queryParams.value.endDate = dayjs().endOf('month').format('YYYY-MM-DD')
    await fetchTodoData()
  }
}
// 获取数据/监听数据
const dateStr = dayjs().format('YYYY-MM-DD')
const total = ref(0)
const queryParams = ref({
  status: 0,
  startDate: dateStr,
  endDate: dateStr,
  page: 1,
  pageSize: 20
})

const tasks = ref([]) // 任务列表数据


const todoStore = useTodoStore()
const fetchTodoData = async () => {
  const res = await todoStore.getTodoList(queryParams.value)
  if (res.data.code === 200) {
    tasks.value = res.data.data.todoList
    total.value = res.data.data.total
  }
}

// 级联选项
const okrStore = useOkrStore()
let okrOptions = ref([])
const fetchOkrOptions = async () => {
  const res = await okrStore.getOptions()
  if (res.data.code === 200) {
    okrOptions.value = res.data.data
  } else {
    ElNotification.error({
        title: 'OKR选项获取失败',
        message: res.data.msg
      }
    )
  }
}

// todo日志模态框处理
const todoLogStore = useTodoLogStore()
const isLogModalOpen = ref(false)
const currentTodoId = ref()
const openLogModal = async (todoId) => {
  currentTodoId.value = todoId
  isLogModalOpen.value = true
}

// 计算属性
//累计专注时间
const focusTimeTotal = computed(() => {
  const totalFocusTime = tasks?.value.reduce((accumulator, currentTask) => {
    return accumulator + currentTask.focusTime
  }, 0)
  return (totalFocusTime / 60).toFixed(2)
})

// 完成率
const finishRate = computed(() => {
  const totalLength = tasks?.value.length
  const statusOneCount = tasks?.value.filter(task => task.status === 2).length
  const ratio = totalLength === 0 ? 0 : statusOneCount / totalLength
  return (ratio * 100).toFixed(2)
})

// 推进OKR数
const pushedOkr = computed(() => {
  const uniqueOkrIds = [...new Set(tasks?.value.map(item => item.okrId))]
  return uniqueOkrIds.length
})

// 提交日志
const handleLogSubmit = async (todoLogForm) => {
  const res = await todoLogStore.addTodoLog(todoLogForm)
  if (res.data.code === 200) {
    ElNotification.success({
      title: '成功',
      message: res.data.msg
    })
    await fetchTodoData()
  } else {
    ElNotification.error({
      title: '失败',
      message: res.data.msg
    })
  }
  isLogModalOpen.value = false
}

onMounted(async () => {
  await fetchTodoData()
  await fetchOkrOptions()
})

watch(queryParams, async (newVal, oldValue) => {
  await fetchTodoData()
}, { deep: true, immediate: true })


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
