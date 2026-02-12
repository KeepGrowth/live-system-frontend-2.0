import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'


const useGoalStore = defineStore('goal', () => {
    const goalOptions = ref([])

    // 请求
    const getGoalList = async () => {
      const loading = ElLoading.service({ fullscreen: true })
      try {
        const res = await api.get('/goal/list')
        if (res.data.code === 200) {
          loading.close()
          goalOptions.value = res.data.data.goalList || []
          return res.data.data.goalList?.map(item => ({
            ...item,
            create_time: formatTime(item.create_time),
            update_time: formatTime(item.update_time)
          })) || []
        }
      } catch (e) {
        ElNotification.error({
          title: '错误',
          message: '服务器接口出现错误'
        })
      } finally {
        loading.close()
      }

    }

    // 新增
    const addGoal = async (goalForm) => {
      const loading = ElLoading.service({ fullscreen: true })
      try {
        const res = await api.post('/goal/add', goalForm)
        if (res.data.code === 200) {
          ElNotification.success({
            message: res.data.message
          })
          return res
        }
      } catch (e) {
        ElNotification.error({
          title: '错误',
          message: '服务器接口出现错误'
        })
      } finally {
        loading.close()
      }
    }

    // 更新
    const updateGoal = async (goalForm) => {
      const loading = ElLoading.service({ fullscreen: true })
      try{
        const res = await api.put('/goal/update', goalForm)
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          return res
        }
      }catch (e){
        ElNotification.error({
          title: '错误',
          message: '服务器接口出现错误'
        })
      }finally {
        loading.close()

      }
    }

    // 删除
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
      goalOptions,
      getGoalList,
      delGoal,
      updateGoal,
      addGoal
    }

  },
  {
    persist: true
  })

export default useGoalStore
