import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'
import utils from '@/utils/common.js'


const useProgramStore = defineStore('program', () => {
    const programOptions = ref([])

    // 请求列表
    const getProgramList = async (queryParams) => {
      const cleanParams = utils.cleanObject(queryParams)
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
      const res = await api.delete(`/program/delete/${programId}`)
      loading.close()
      return res
    }

    // 获取级联选项。
    // 获取级联选项
    const getOptions = async () => {
      const res = await api.get('/program/multi-options')
      return res
    }


    return {
      programOptions,
      getProgramList,
      delProgram,
      updateProgram,
      addProgram,
      getProgramDetail,
      getOptions
    }

  },
  {
    persist: true
  })

export default useProgramStore
