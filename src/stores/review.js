import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import commonUtils from '@/utils/common.js'
import { ref } from 'vue'


const useReviewStore = defineStore('review', () => {

    // 请求
    const getGoalReview = async (queryParams) => {
      const cleanParams = commonUtils.cleanObject(queryParams)
      const res = await api.get('/review/goal-review', {
        params: cleanParams
      })
      return res

    }

    return {

      getGoalReview,
    }

  },
  {
    persist: true
  })

export default useReviewStore
