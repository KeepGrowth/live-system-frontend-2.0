import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'
import cleanObject from '@/utils/common.js'


const useProgramStore = defineStore('program', () => {
    const programOptions = ref([])

    // 请求列表
    const getProgramList = async (queryParams) => {
      const cleanParams = cleanObject(queryParams)
      const loading = ElLoading.service({ fullscreen: true })
      const res = await api.get('/program/list', {
        params: cleanParams
      })
      if (res.data.code === 200) {
        loading.close()
        return res
      }

    }

    // 获取项目详情
    const getProgramDetail = async (programId) => {
      const res = await api.get('/program/detail', {
        params: {
          programId
        }
      })
      return res
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
          goalName: '成功',
          message: res.data.message,
          type: 'success'
        })
        return res
      }
      loading.close()
    }

    // 删除单子
    const delProgram = async (programId) => {
      const loading = ElLoading.service({ fullscreen: true })
      try {
        const res = await api.delete('/program/delete', {
          params: {
            programId: Number(programId)
          }
        })
        if (res.data.code === 200) {
          ElNotification({
            goalName: '成功',
            message: res.data.message,
            type: 'success'
          })
        }
      } catch (e) {
        ElNotification.error({
          goalName: '错误',
          message: '你可能正在删除一个有关联目标的项目，这是不被允许的'
        })
      }
      loading.close()
    }


    return {
      programOptions,
      getProgramList,
      delProgram,
      updateProgram,
      addProgram,
      getProgramDetail
    }

  },
  {
    persist: true
  })

export default useProgramStore
