import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'
import utils from '@/utils/common.js'


const useDashboardStore = defineStore('dashboard', () => {
  // 请求累计达成指标卡数据
  const getDashboardList = async () => {
    const res = await api.get('/dashboard/acc-statistic-card')
    return res

  }


  return {
    getDashboardList
  }

})

export default useDashboardStore
