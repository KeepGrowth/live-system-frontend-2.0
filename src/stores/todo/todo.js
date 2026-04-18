import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'
import utils from '@/utils/common.js'


const useTodoStore = defineStore('Todo', () => {
  const todoOptions = ref([])
  // 请求
  const getTodoList = async (queryParams) => {
    const cleanParams = utils.cleanObject(queryParams)
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.get('/todo/list', {
      params: cleanParams
    })
    if (res.data.code === 200) {
      loading.close()
      return res
    }

  }

  // 新增
  const addTodo = async (todoForm) => {
    const cleanParams = utils.cleanObject(todoForm)
    const res = await api.post('/todo/add', cleanParams)
    if (res.data.code === 200) {
      ElNotification.success({
        message: res.data.message
      })
      return res
    }
  }

  // 更新单子
  const updateTodo = async (todoForm) => {
    const loading = ElLoading.service({ fullscreen: true })
    const cleanParams = utils.cleanObject(todoForm)
    const res = await api.put('/todo/update', cleanParams)
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
  const delTodo = async (todoId) => {
    const loading = ElLoading.service({ fullscreen: true })

    const res = await api.delete(`/todo/${Number(todoId)}`)

    loading.close()
    return res
  }


  return {
    todoOptions,
    getTodoList,
    addTodo,
    updateTodo,
    delTodo
  }

})

export default useTodoStore
