import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'


const useOkrStore = defineStore('okr', () => {
  const okrOptions = ref([])

  // 请求单子列表
  const getOkrList = async () => {
    const loading = ElLoading.service({ fullscreen: true })
    try {
      const res = await api.get('/okr/list')
      if (res.data.code === 200) {
        loading.close()
        okrOptions.value = res.data.data.okrList || []
        return res.data.data.okrList?.map(item => ({
          ...item,
          create_time: formatTime(item.create_time),
          update_time: formatTime(item.update_time)
        })) || []
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

  // 新增单子
  const addOkr = async (okrForm) => {
    const loading = ElLoading.service({ fullscreen: true })
    try{
      const res = await api.post('/okr/add', okrForm)
      if (res.data.code === 200) {
        ElNotification.success({
          message: res.data.message
        })
        return res
      }
    }catch (e){
      ElNotification.error({
        goalName: '错误',
        message: '服务器接口出现错误'
      })
    }
  }

  // 更新单子
  const updateOkr = async (okrForm) => {
    const loading = ElLoading.service({ fullscreen: true })
    try{
      const res = await api.put('/okr/update', okrForm)
      if (res.data.code === 200) {
        ElNotification({
          goalName: '成功',
          message: res.data.message,
          type: 'success'
        })
        return res
      }
    }catch (e){
      ElNotification.error({
        goalName: '错误',
        message: '服务器接口出现错误'
      })
    }finally {
      loading.close()
    }
  }

  // 删除单子
  const delOkr = async (okrId) => {
    const loading = ElLoading.service({ fullscreen: true })
    try{
      const res = await api.delete('/okr/delete', {
        params: {
          okrId
        }
      })
      if (res.data.code === 200) {
        ElNotification({
          goalName: '成功',
          message: res.data.message,
          type: 'success'
        })
      }
    }catch (e){
      ElNotification.error({
        goalName: '错误',
        message: '服务器接口出现错误'
      })
    }finally {
      loading.close()
    }
  }


  return {
    okrOptions,
    getOkrList,
    addOkr,
    updateOkr,
    delOkr
  }

}, {
  persist: true
})

export default useOkrStore
