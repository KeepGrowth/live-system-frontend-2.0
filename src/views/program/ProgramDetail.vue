<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 font-mono selection:bg-cyan-500 selection:text-black p-4 md:p-8">
    <!-- 装饰性背景网格 -->
    <div class="fixed inset-0 z-0 opacity-10 pointer-events-none"
         style="background-image: linear-gradient(0deg, transparent 24%, #06b6d4 25%, #06b6d4 26%, transparent 27%, transparent 74%, #06b6d4 75%, #06b6d4 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #06b6d4 25%, #06b6d4 26%, transparent 27%, transparent 74%, #06b6d4 75%, #06b6d4 76%, transparent 77%, transparent); background-size: 50px 50px;">
    </div>
    <!-- 主容器 -->
    <div class="relative z-10 w-full space-y-6 px-4 md:px-8">
      <!-- 顶部标题栏 -->
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-cyan-500/50 pb-4 mb-8">
        <div>
          <h1 class="text-cyan-500 text-sm tracking-[0.2em] uppercase mb-1">
            {{ program?.programName || '无项目名称' }}</h1>
          <h1 class="text-3xl md:text-4xl font-bold text-white uppercase glitch-text" :data-text="program?.programName">
            {{ program?.programName || '无项目名称' }} 项目档案
          </h1>
        </div>
        <div class="mt-4 md:mt-0 flex items-center space-x-2">
          <!-- 状态徽章 -->
          <div
            class="px-4 py-1 border border-cyan-500 text-cyan-400 uppercase text-xs tracking-widest relative overflow-hidden group">
            <div
              class="absolute inset-0 w-0 bg-cyan-500 transition-all duration-[250ms] ease-out group-hover:w-full opacity-20"></div>
            <span
              :class="getStatusLabel(program?.programStatus).color"
              class="relative z-10"
            >{{ getStatusText(program?.programStatus) }}</span>
          </div>
          <span class="text-slate-500 text-xs font-mono">项目ID: {{ program?.id }}</span>
        </div>
      </header>
      <!-- 附件区域 -->
      <div v-if="program?.imageUrls.length>0">
        <swiper-component
          :images="program?.imageUrls"
        />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- 左侧主要信息 -->
        <div class="lg:col-span-4 space-y-8">
          <!-- 描述卡片 -->
          <section
            class="bg-slate-900/50 border border-slate-800 p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-fuchsia-500"></div>
            <h3 class="text-xl text-white mb-4 flex items-center">
              <span class="w-2 h-2 bg-fuchsia-500 mr-2 shadow-[0_0_10px_#d946ef]"></span>
              项目概述
            </h3>
            <p class="text-slate-500 leading-relaxed text-justify border-l-2 border-slate-800 pl-4">
              {{ program?.programDesc || '暂无相关项目概述' }}
            </p>
          </section>
          <!-- 关键指标网格 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 满意度 -->
            <div class="bg-slate-900/80 p-5 border border-slate-800 relative">
              <div class="flex justify-between items-end mb-2">
                <span class="text-slate-500 text-xs uppercase">项目满意度</span>
                <span
                  class="text-2xl font-bold text-fuchsia-400">{{ program?.satisfactionScore > 5 ? 5 : program?.satisfactionScore
                  }}<span
                    class="text-sm text-slate-600">/5分</span></span>
              </div>
              <el-rate v-model="program.satisfactionScore" disabled></el-rate>
            </div>

            <!-- 关联目标 -->
            <div
              @click="goToGoalDetail(program.goalId)"
              class="bg-slate-900/80 p-5 border border-slate-800 flex flex-col justify-center cursor-pointer"
            >
              <span class="text-slate-500 text-xs uppercase mb-1">项目关联目标</span>
              <div class="flex items-center text-cyan-300">
                <svg class="w-4 h-4 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                <span class="font-bold tracking-wider">查看目标-{{ program.goalId }}</span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <indicator-card
              :title="'项目进度'"
              :subtitle="'已完成OKR/OKR总数'"
              :value="completionRate"
              :target-value="100"
              :unit="'%'"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          </div>


        </div>
        <!-- 右侧时间轴/元数据 -->
        <div class="lg:col-span-1">
          <!-- 用户ID展示 -->
          <div @click="isUserModalOpen=true"
               class="cursor-pointer mt-6 mb-4 p-4 border border-slate-800 bg-slate-900/30 flex justify-between items-center">
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
                <div class="cursor-pointer group" @click="openOkrModal(item)">
                  <!-- 原有的脉冲点 -->
                  <span class="absolute -left-1 top-1.5 flex h-3 w-3">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"
          v-if="index === program.okrList.length - 1"></span>
    <span class="relative inline-flex rounded-full h-3 w-3 border border-slate-500 bg-slate-900"></span>
  </span>

                  <div class="flex flex-col gap-1">
                    <p class="text-xs text-slate-500 uppercase tracking-wider">{{ item.krName }}</p>

                    <!-- 底部信息行：时间 + 赛博朋克标签 -->
                    <div class="flex items-center gap-3">
                      <p class="text-sm text-cyan-100 font-medium font-mono">{{ formatDate(item.createTimeStr) }}</p>

                      <!-- 赛博朋克状态标签 -->
                      <span
                        class="relative inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black bg-cyan-400"
                        style="clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);">
        <!-- 装饰性的小方块 -->
        <span class="absolute top-0 left-0 w-1 h-full bg-black/20"></span>
        进行中
      </span>
                    </div>
                  </div>
                </div>
              </li>

            </ul>
          </div>


        </div>

      </div>
    </div>


  </div>
  <!--用户模态框-->
  <user-modal v-model="isUserModalOpen" :user="userInfo" @close="isUserModalOpen=false" />
  <!--OKR模态框-->
  <okr-modal
    v-model="isOkrModalOpen"
    :okrData="okrData"
    @view-detail="onViewOkrDetail"
  />

</template>

<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import SwiperComponent from '@/components/SwiperComponent.vue'
import useProgramStore from '@/stores/program/program.js'
import { ElNotification } from 'element-plus'
import UserModal from '@/views/user/component/UserModal.vue'
import useUserStore from '@/stores/user.ts'
import router from '@/router/index.js'
import IndicatorCard from '@/components/IndicatorCard.vue'
import LineChart from '@/components/chart/LineChart.vue'
import BarChart from '@/components/chart/StackBarChart.vue'
import OkrModal from '@/views/okr/component/OkrModal.vue'

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

const getStatusLabel = (status) => {
  const map = {
    1: { text: '进行中', color: 'border-yellow-500/30 text-yellow-400 bg-yellow-950/30' },
    0: { text: '待开始', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/30' },
    2: { text: '已完成', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/30' },
    3: { text: '已放弃', color: 'border-red-500/30 text-red-400 bg-red-950/30' }
  }
  return map[status] || { text: status || '未知', color: 'border-slate-500/30 text-slate-400' }
}

// 日期格式化
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-CA') // YYYY-MM-DD
}

// 2. 修复 Bug 2: 移除不存在的 getRate，直接计算进度
// 计算已完成的 OKR 比例
const completionRate = computed(() => {
  if (!program.value?.okrList?.length) return 0
  const completed = program.value.okrList.filter(item => item.status === 1).length
  return (completed / program.value.okrList.length) * 100
})

const programStore = useProgramStore()
const fetchProgramDetail = async () => {
  const res = await programStore.getProgramDetail(props.id)
  if (res.data.code === 200) {
    program.value = res.data.data
    // 确保后端返回的数据包含 okrList，若没有则初始化为空数组
    if (!Array.isArray(program.value.okrList)) {
      program.value.okrList = []
    }
  } else {
    ElNotification.error({ title: '详情获取失败', message: res.data.msg })
  }
}

watch(() => props.id, async (newId) => {
  if (newId) {
    await fetchProgramDetail()
  }
}, { immediate: true })

// 3. 修复 Bug 3: 使用计算属性包装 userInfo，防止未定义
const userStore = useUserStore()
const isUserModalOpen = ref(false)
const userInfo = computed(() => userStore.userInfo || {}) // 提供默认空对象

// 跳转目标详情页
const goToGoalDetail = async (goalId) => {
  router.push({
    name: 'GoalDetail', params: {
      id: goalId
    }
  })
}

// OKR模态框交互
const isOkrModalOpen = ref(false)
const okrData = ref()
const openOkrModal = (okrItem) => {
  okrData.value = okrItem
  isOkrModalOpen.value = true
}
const onViewOkrDetail = async (okrId) => {
  router.push({ name: 'OkrDetail', params: { id: okrId } })
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
