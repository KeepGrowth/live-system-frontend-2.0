import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'


const useOkrStore = defineStore('okr', () => {
  // 请求单子列表
  const getOkrList = async () => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.get('/okr/list')
    if (res.data.code === 200) {
      loading.close()
      console.log(res.data)
      return res.data.data.okrList?.map(item => ({
        ...item,
        create_time: formatTime(item.create_time),
        update_time: formatTime(item.update_time)
      })) || []
    }

  }

  // 新增单子
  const addOkr = async (okrForm) => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.post('/okr/add', okrForm)
    if (res.data.code === 200) {
      ElNotification.success({
        message: res.data.message
      })
      return res
    }
  }

  // 更新单子
  const updateOkr = async (okrForm) => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.put('/okr/update', okrForm)
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
  const delOkr = async (okrId) => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.delete('/okr/delete', {
      params: {
        okrId
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
    getOkrList,
    addOkr,
    updateOkr,
    delOkr
  }

})

export default useOkrStore
