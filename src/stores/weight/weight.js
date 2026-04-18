import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'


const useWeightStore = defineStore('weight', () => {
    const weightOptions = ref([])

    // 请求
    const getWeightList = async () => {
      const loading = ElLoading.service({ fullscreen: true })
      try{
        const res = await api.get('/weight/list')
        if (res.data.code === 200) {
          weightOptions.value = res.data.data.weightList || []
          return res.data.data.weightList?.map(item => ({
            ...item,
            createTime: formatTime(item.createTime),
            updateTime: formatTime(item.updateTime)
          })) || []
        }
      }finally {
        loading.close()
      }

    }

    // 新增
    const addWeight = async (weightForm) => {
      const loading = ElLoading.service({ fullscreen: true })
      try{
        const res = await api.post('/weight/add', weightForm)
        if (res.data.code === 200) {
          ElNotification.success({
            message: res.data.message
          })
          return res
        }
      }finally {
        loading.close()
      }
    }

    // 更新
    const updateWeight = async (weightForm) => {
      const loading = ElLoading.service({ fullscreen: true })
      try{
        const res = await api.put('/weight/update', weightForm)
        if (res.data.code === 200) {
          ElNotification({
            goalName: '成功',
            message: res.data.message,
            type: 'success'
          })
          return res
        }
      }finally {
        loading.close()
      }
    }

    // 删除
    const delWeight = async (weightId) => {
      const loading = ElLoading.service({ fullscreen: true })
      try{
        const res = await api.delete('/weight/delete', {
          params: {
            weightId
          }
        })
        if (res.data.code === 200) {
          ElNotification({
            goalName: '成功',
            message: res.data.message,
            type: 'success'
          })
        }
      }finally {
        loading.close()

      }
    }


    return {
      weightOptions,
      getWeightList,
      delWeight,
      updateWeight,
      addWeight
    }

  },
  {
    persist: true
  })

export default useWeightStore
