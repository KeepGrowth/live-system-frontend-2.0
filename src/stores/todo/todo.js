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
    const res = await api.get('/todo/list', {
      params: cleanParams
    })
    return res

  }

  // 新增
  const addTodo = async (todoForm) => {
    const cleanParams = utils.cleanObject(todoForm)
    const res = await api.post('/todo/add', cleanParams)
    return res
  }

  // 更新单子
  const updateTodo = async (todoForm) => {
    const cleanParams = utils.cleanObject(todoForm)
    const res = await api.put('/todo/update', cleanParams)
    return res
  }

  // 删除单子
  const delTodo = async (todoId) => {


    const res = await api.delete(`/todo/${Number(todoId)}`)

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
