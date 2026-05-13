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
            data-text="财务档案">
            财务档案
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
        </div>


      </header>


      <!-- 列表网格 -->
      <!--收入-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10">
        <!-- 右侧：新建按钮 -->
        <div class="w-full lg:w-auto flex justify-end">
          <button @click="openIncomeModal({})"
                  class="cursor-pointer group relative px-6 py-3 bg-cyan-950/30 border border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all duration-300 clip-path-slant w-full sm:w-auto">
            <span
              class="cursor-pointer absolute w-0 h-0 top-0 left-0 bg-cyan-400 group-hover:w-full group-hover:h-full transition-all duration-300 -z-10"></span>
            + 新增收入
          </button>
        </div>
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-green-400 text-shadow-lg text-shadow-green-400/50">收入</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1"></span>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <indicator-card
            :title="'累计收入'"
            subtitle="根据你选择的周期计算"
            unit="￥"
            v-model:value="incomeAmount"
          />
          <indicator-card
            title="完成率"
            unit="%"
            :value="finishRate"
          />
          <indicator-card
            title="收入笔数"
            unit="笔"
            :value="incomeLength"
          />
        </div>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <span v-for="item in incomes">
          <income-card
            :id="item.id"
            :incomeDate="item.incomeDate"
            :amount="item.amount"
            :second-cate-name="item.secondCateName"
            :first-cate-name="item.firstCateName"
            :note="item.note"
            :user_id="item.userId"
            :first-cate-id="item.firstCateId"
            :second-cate-id="item.secondCateId"

            @open-edit-modal="openIncomeModal"
            @del-income="delIncome"
            :user-id="userStore.userInfo.userId" />

          </span>
        </div>
        <!-- 分页组件 -->
        <div class="w-full lg:w-auto">
          <el-pagination
            class="mt-8 flex justify-center"
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[10,20,30,40]"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="fetchIncomeData"
            @current-change="fetchIncomeData"
          />

        </div>
      </section>
    </div>
    <!--收入模态框-->
    <income-modal
      v-model="incomeModalOpen"
      :income-data="incomeForm"
      :first-cate-list="firstCateOptions"
      @submit="submitIncome"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue'
import useUserStore from '@/stores/user.js'

import useIncomeStore from '@/stores/finance/income.js'
import { dayjs, ElMessageBox, ElNotification } from 'element-plus'
import isoWeek from 'dayjs/plugin/isoWeek'
import IndicatorCard from '@/components/IndicatorCard.vue'
import IncomeCard from '@/views/finance/component/IncomeCard.vue'
import IncomeModal from '@/views/finance/component/IncomeModal.vue'


dayjs.extend(isoWeek)
const userStore = useUserStore()
// 模拟当前用户名称
const currentUser = userStore.userInfo.username


// 模态框状态
const incomeModalOpen = ref(false)
const editMode = ref(false)


const incomeForm = ref({})

// 打开模态框
const openIncomeModal = (income = null) => {
  if (income) {
    editMode.value = true
    incomeForm.value = income
  } else {
    editMode.value = false
    incomeForm.value = {}
    if (queryParams.value.endDate) {
      incomeForm.value.incomeDate = queryParams.value.endDate
    }
    incomeForm.userId = currentUser // 确保User ID正确
  }
  incomeModalOpen.value = true
}

// 保存收入
const saveTask = async () => {
  if (editMode.value) {
    // 模拟更新
    const res = await incomeStore.updateIncome(incomeForm.value)
    if (res.data.code === 200) {
      ElNotification.success({
        title: '成功',
        message: res.data.msg
      })
      await fetchIncomeData()
      incomeModalOpen.value = false
    } else {
      ElNotification.error({
        title: '更新todo失败',
        message: res.data.msg
      })
    }
  } else {
    // 模拟新增
    const res = await incomeStore.addIncome(incomeForm.value)
    if (res.data.code === 200) {
      ElNotification.success({
        title: '成功',
        message: res.data.msg
      })
      incomeModalOpen.value = false
      await fetchIncomeData()
    } else {
      ElNotification.error({
        title: '新增todo失败',
        message: res.data.msg
      })
    }
  }
  incomeModalOpen.value = false
}

// 删除收入
const delIncome = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除此收入吗？', '提示', {
      type: 'warning'
    })
    const res = await incomeStore.delIncome(id)
    if (res.data.code === 200) {
      ElNotification.success('删除成功')
      await fetchIncomeData()
    } else {
      ElNotification.error(res.data.msg)
    }


  } catch (error) {

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
// 获取完整类名的函数
const getButtonClass = (type) => {
  const isActive = activeType.value === type
  return `${baseClass} ${isActive ? activeClass : inactiveClass}`
}

// 筛选条件
const chooseDateRangeType = async (dateType) => {
  activeType.value = dateType
  const day = dayjs()
  if (dateType === 'today') {
    queryParams.value.startDate = day.format('YYYY-MM-DD')
    queryParams.value.endDate = day.format('YYYY-MM-DD')
    await fetchIncomeData()
  } else if (dateType === 'thisWeek') {
    queryParams.value.startDate = dayjs().startOf('isoWeek').format('YYYY-MM-DD')
    queryParams.value.endDate = dayjs().endOf('isoWeek').format('YYYY-MM-DD')
    await fetchIncomeData()
  } else {
    queryParams.value.startDate = dayjs().startOf('month').format('YYYY-MM-DD')
    queryParams.value.endDate = dayjs().endOf('month').format('YYYY-MM-DD')
    await fetchIncomeData()
  }
}
// 获取数据/监听数据
const dateStr = dayjs().format('YYYY-MM-DD')
const total = ref(0)
const queryParams = ref({
  startDate: dateStr,
  endDate: dateStr,
  page: 1,
  pageSize: 20
})

const incomes = ref([]) // 收入列表数据


const incomeStore = useIncomeStore()
const fetchIncomeData = async () => {
  const res = await incomeStore.getIncomeList(queryParams.value)
  if (res.data.code === 200) {
    incomes.value = res.data.data.incomeList
    total.value = res.data.data.total
  }
}


// 计算属性
//累计专注时间
const incomeAmount = computed(() => {
  const incomeAmount = incomes?.value.reduce((accumulator, currentTask) => {
    return accumulator + currentTask.amount
  }, 0)
  return incomeAmount
})

// 收入笔数
const incomeLength = computed(() => {
  const uniqueOkrIds = [...new Set(incomes?.value.map(item => item.id))]
  return uniqueOkrIds.length
})

const firstCateOptions = ref([])

onMounted(async () => {
  firstCateOptions.value = await incomeStore.getFirstCateList()
  await fetchIncomeData()
})

watch(queryParams, async (newVal, oldValue) => {
  await fetchIncomeData()
}, { deep: true, immediate: true })

// 提交收入表单
const submitIncome = async (incomeForm) => {
  if (incomeForm.id) {
    // 更新
    const res = await incomeStore.updateIncome(incomeForm)
    if (res.data.code === 200) {
      ElNotification.success({
        title: '成功',
        message: res.data.msg
      })
    } else {
      ElNotification.error({
        title: '错误',
        message: res.data.msg
      })
    }
  } else {
    // 新增
    const res = await incomeStore.addIncome(incomeForm)
    if (res.data.code === 200) {
      ElNotification.success({
        title: '成功',
        message: res.data.msg
      })
    } else {
      ElNotification.error({
        title: '错误',
        message: res.data.msg
      })
    }
  }
  await fetchIncomeData()
}


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
