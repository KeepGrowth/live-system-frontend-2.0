import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'


const useProgramStore = defineStore('program', () => {
    const programOptions = ref([])

    // 请求列表
    const getProgramList = async () => {
      const loading = ElLoading.service({ fullscreen: true })
      const res = await api.get('/program/list')
      if (res.data.code === 200) {
        loading.close()
        programOptions.value = res.data.data.programList || []
        return res.data.data.programList?.map(item => ({
          ...item,
          createTime: formatTime(item.createTime),
          updateTime: formatTime(item.updateTime)
        })) || []
      }

    }

    // 新增
    const addProgram = async (programForm) => {
      const loading = ElLoading.service({ fullscreen: true })
      const res = await api.post('/program/add', programForm)
      if (res.data.code === 200) {
        ElNotification.success({
          message: res.data.message
        })
        return res
      }
    }

    // 更新单子
    const updateProgram = async (programForm) => {
      const loading = ElLoading.service({ fullscreen: true })
      const res = await api.put('/program/update', programForm)
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
    const delProgram = async (programId) => {
      alert(programId)
      const loading = ElLoading.service({ fullscreen: true })
      const res = await api.delete('/program/delete', {
        params: {
          programId: Number(programId)
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
      programOptions,
      getProgramList,
      delProgram,
      updateProgram,
      addProgram
    }

  },
  {
    persist: true
  })

export default useProgramStore
