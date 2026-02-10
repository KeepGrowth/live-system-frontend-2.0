import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'


const useGoalStore = defineStore('goal', () => {
  // 请求单子列表
  const getGoalList = async () => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.get('/goal/list')
    if (res.data.code === 200) {
      loading.close()
      console.log(res.data.data.goalList)
      return res.data.data.goalList?.map(item => ({
        ...item,
        create_time: formatTime(item.create_time),
        update_time: formatTime(item.update_time)
      })) || []
    }

  }

  // 新增单子
  const addGoal = async (goalForm) => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.post('/goal/add', goalForm)
    if (res.data.code === 200) {
      ElNotification.success({
        message: res.data.message
      })
      return res
    }
  }

  // 更新单子
  const updateGoal = async (goalForm) => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.put('/goal/update', goalForm)
    if (res.data.code === 200) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success'
      })
      return res
    }
    loading.close()
  }

  // 删除单子
  const delGoal = async (goalId) => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.delete('/goal/delete', {
      params: {
        goalId
      }
    })
    if (res.data.code === 200) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success'
      })
    }
    loading.close()
  }


  return {
    getGoalList,
    delGoal,
    updateGoal,
    addGoal
  }

},
  {
    persist:true
  })

export default useGoalStore
