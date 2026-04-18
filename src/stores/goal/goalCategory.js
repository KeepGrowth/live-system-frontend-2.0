import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'


const useGoalCateStore = defineStore('goalCate', () => {
  //  分类选项
  const goalCateOptions = ref([])

  // 请求
  const getGoalCateList = async () => {

    const res = await api.get('/goal/cate/list')
    if (res.data.code === 200) {
      goalCateOptions.value = res.data.data.goalCategoryList || []
      return res.data.data.goalCategoryList?.map(item => ({
        ...item, createTime: formatTime(item.createTime), updateTime: formatTime(item.updateTime)
      })) || []
    }

  }

  // 新增
  const addGoalCate = async (cateForm) => {

    const res = await api.post('/goal/cate/add', cateForm)
    if (res.data.code === 200) {
      ElNotification.success({
        message: res.data.message
      })
      return res
    }
  }

  // 更新
  const updateGoalCate = async (cateForm) => {

    const res = await api.put('/goal/cate/update', cateForm)
    if (res.data.code === 200) {
      ElNotification({
        goalName: '成功', message: res.data.message, type: 'success'
      })
      return res
    }
  }

  // 删除
  const delGoalCate = async (cateId) => {

    const res = await api.delete('/goal/cate/delete', {
      params: {
        goalCategoryId: Number(cateId)
      }
    })
    if (res.data.code === 200) {

      ElNotification({
        goalName: '成功', message: res.data.message, type: 'success'
      })
    }

  }


  return {
    goalCateOptions, getGoalCateList, delGoalCate, updateGoalCate, addGoalCate
  }

}, { persist: true })

export default useGoalCateStore
