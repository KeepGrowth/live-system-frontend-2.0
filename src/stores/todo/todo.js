import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'


const useTodoStore = defineStore('Todo', () => {
  const todoOptions = ref([])
  // 请求
  const getTodoList = async (searchForm) => {
    const loading = ElLoading.service({ fullscreen: true })
    const res = await api.get('/todo/list', {
      params:
      searchForm
    })
    if (res.data.code === 200) {
      loading.close()
      const list = res.data.data.todoList?.map(item => ({
        ...item,
        create_time: formatTime(item.create_time),
        update_time: formatTime(item.update_time)
      })) || []
      todoOptions.value = list
      return {
        list,
        total:res.data.data.total
      }
    }

  }

  // 新增
  const addTodo = async (todoForm) => {
    console.log(todoForm.name)
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
    try {
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
    } catch (e) {
      ElNotification.error({
        title: '错误',
        message: '你可能正在删除一个有关联OKR的待办，这是不被允许的，你可以把相关的OKR信息解绑后删除。'
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
