import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'
import utils from '@/utils/common.js'


const useOkrStore = defineStore('okr', () => {
    const okrOptions = ref([])

    // 请求单子列表
    const getOkrList = async (queryParams) => {
      const cleanParams = utils.cleanObject(queryParams)
      const res = await api.get('/okr/list', {
        params: cleanParams
      })
      return res

    }

    // 新增
    const addOkr = async (okrForm) => {

      const res = await api.post('/okr/add', okrForm)

      return res

    }
    // 更新单子
    const updateOkr = async (okrForm) => {
      const loading = ElLoading.service({ fullscreen: true })
      try {
        const res = await api.put('/okr/update', okrForm)
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

    // 删除单子
    const delOkr = async (okrId) => {
      const loading = ElLoading.service({ fullscreen: true })
      try {
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
      } catch (e) {
        ElNotification.error({
          goalName: '错误',
          message: '服务器接口出现错误'
        })
      } finally {
        loading.close()
      }
    }

    // 获取级联选项
    const getOptions = async () => {
      const res = await api.get('/okr/multi-options')
      return res
    }


    return {
      okrOptions,
      getOkrList,
      addOkr,
      updateOkr,
      delOkr,
      getOptions
    }

  }, {
    persist: true
  }
)

export default useOkrStore
