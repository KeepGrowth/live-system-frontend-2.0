import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'


const useProjectStore = defineStore('project', () => {
  // 请求单子列表
  const getProjectList = async () => {
    const res = await api.get('/project/list')
    if (res.data.code === 200) {

      return res.data.data.projectList?.map(item => ({
        ...item,
        create_time: formatTime(item.create_time),
        update_time: formatTime(item.update_time)
      })) || []
    }
  }

  // 新增单子
  const addProject = async (projectForm) => {
    console.log('新增单子', projectForm)
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
    console.log('更新数据：', projectForm)
    const res = await api.put('/project/update', projectForm)
    if (res.data.code === 200) {
      return res.data.data
    }
  }


  return {
    getProjectList,
    addProject,
    updateProject
  }

})

export default useProjectStore
