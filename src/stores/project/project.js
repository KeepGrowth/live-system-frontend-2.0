import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'


const useProjectStore = defineStore('project', () => {
  // 请求单子列表
  const getProjectList = async () => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.get('/project/list')
    if (res.data.code === 200) {
      loading.close()
      console.log(res.data)
      return res.data.data.projectList?.map(item => ({
        ...item,
        create_time: formatTime(item.create_time),
        update_time: formatTime(item.update_time)
      })) || []
    }

  }

  // 新增单子
  const addProject = async (projectForm) => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.post('/project/add', projectForm)
    if (res.data.code === 200) {
      ElNotification.success({
        message: res.data.message
      })
      return res
    }
  }

  // 更新单子
  const updateProject = async (projectForm) => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.put('/project/update', projectForm)
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
  const delProject = async (projectId) => {
    const loading = ElLoading.service({ fullscreen: true })
    try {
      const res = await api.delete('/project/delete', {
        params: {
          projectId
        }
      })
      if (res.data.code === 200) {
        ElNotification({
          title: '成功',
          message: res.data.message,
          type: 'success'
        })
      }
    } catch (e) {
      ElNotification.error({
        title: '错误',
        message: '你可能正在删除一个有关联客户的项目，这是不被允许的，你可以把相关的客户信息解绑后删除。'
      })
    }
    loading.close()
  }


  return {
    getProjectList,
    addProject,
    updateProject,
    delProject
  }

})

export default useProjectStore
