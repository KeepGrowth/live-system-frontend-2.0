import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'


const useTodoLogStore = defineStore('todoLog', () => {
  const todoLogOptions = ref([])
  // 请求
  const getTodoLogList = async (searchForm) => {

    try {
      const cleanParams = Object.fromEntries(
        Object.entries(searchForm).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      )

      const res = await api.get('/todo_log/list', {
        params:
        cleanParams
      })
      if (res.data.code === 200) {
        const list = res.data.data.todoLogList?.map(item => ({
          ...item,
          createTime: formatTime(item.createTime),
          updateTime: formatTime(item.updateTime)
        })) || []
        todoLogOptions.value = list
        ElNotification.success({
          message: res.data.message
        })
        return list
      }
    } catch (e) {
      ElNotification.error({
        message: '获取日志数据失败，请检查。'
      })
    } finally {
      loading.close()
    }

  }

  // 新增
  const addTodoLog = async (todoLogForm) => {
    const res = await api.post('/todo_log/add', todoLogForm)
    return res
  }

  // 更新
  const updateTodoLog = async (todoLogForm) => {

    const res = await api.put('/todo_log/update', todoLogForm)
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

  // 删除
  const delTodoLog = async (todoLogId) => {

    const res = await api.delete('/todo_log/delete', {
      params: {
        todoLogId: todoLogId
      }
    })
    if (res.data.code === 200) {
      ElNotification({
        goalName: '成功',
        message: res.data.message,
        type: 'success'
      })
    }
    loading.close()
  }


  return {
    todoLogOptions,
    getTodoLogList,
    addTodoLog,
    updateTodoLog,
    delTodoLog
  }

})

export default useTodoLogStore
