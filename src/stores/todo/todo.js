import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'


const useTodoStore = defineStore('Todo', () => {
  const todoOptions = ref([])
  // 请求单子列表
  const getTodoList = async (searchForm) => {

    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.get('/todo/list', {
      params:
      searchForm
    })
    if (res.data.code === 200) {
      loading.close()
      todoOptions.value = res.data.data.todoList
      return res.data.data.todoList?.map(item => ({
        ...item,
        create_time: formatTime(item.create_time),
        update_time: formatTime(item.update_time)
      })) || []
    }

  }

  // 新增单子
  const addTodo = async (todoForm) => {
    console.log(todoForm)
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.post('/todo/add', todoForm)
    if (res.data.code === 200) {
      ElNotification.success({
        message: res.data.message
      })
      return res
    }
    loading.close
  }

  // 更新单子
  const updateTodo = async (todoForm) => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.put('/todo/update', todoForm)
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
  const delTodo = async (todoId) => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.delete('/todo/delete', {
      params: {
        todoId: todoId
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
    todoOptions,
    getTodoList,
    addTodo,
    updateTodo,
    delTodo
  }

})

export default useTodoStore
