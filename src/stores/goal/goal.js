import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import commonUtils from '@/utils/common.js'
import { ref } from 'vue'


const useGoalStore = defineStore('goal', () => {
    const goalOptions = ref([])

    // 请求
    const getGoalList = async (queryParams) => {
      const cleanParams = commonUtils.cleanObject(queryParams)
      const res = await api.get('/goal/list', {
        params: cleanParams
      })
      return res

    }

    // 新增
    const addGoal = async (goalForm) => {
      const cleanParams = commonUtils.cleanObject(goalForm)
      const res = await api.post('/goal/add', cleanParams)
      return res

    }

    // 更新
    const updateGoal = async (goalForm) => {
      const loading = ElLoading.service({ fullscreen: true })
      try {
        const res = await api.put('/goal/update', goalForm)
        if (res.data.code === 200) {
          ElNotification({
            goalName: '成功',
            message: res.data.message,
            type: 'success'
          })
          return res
        }
      } catch (e) {
        ElNotification.error({
          goalName: '错误',
          message: '服务器接口出现错误'
        })
      } finally {
        loading.close()

      }
    }

    // 删除
    const delGoal = async (goalId) => {
      const loading = ElLoading.service({ fullscreen: true })
      const res = await api.delete(`/goal/delete/${goalId}`)
      loading.close()
      return res
    }

    // 获取级联选项
    const getOptions = async () => {
      const res = await api.get('/goal/multi-options')
      return res
    }

    // 请求详情
    const getGoalDetail = async (goalId) => {
      const res = await api.get(`/goal/detail/${goalId}`)
      return res

    }

    return {
      goalOptions,
      getGoalList,
      delGoal,
      updateGoal,
      addGoal,
      getOptions,
      getGoalDetail
    }

  },
  {
    persist: true
  })

export default useGoalStore
