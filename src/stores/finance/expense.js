import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'
import utils from '@/utils/common.js'


const useExpenseStore = defineStore('Expense', () => {

  const firstCateOptions = ref([])
  const secondCateOptions = ref([])

  // 请求
  const getExpenseList = async (queryParams) => {
    const cleanParams = utils.cleanObject(queryParams)
    const res = await api.get('/expense/list', {
      params: cleanParams
    })
    return res

  }

  // 新增
  const addExpense = async (expenseForm) => {
    const cleanParams = utils.cleanObject(expenseForm)
    const res = await api.post('/expense/add', cleanParams)
    return res
  }

  // 更新
  const updateExpense = async (expenseForm) => {

    const cleanParams = utils.cleanObject(expenseForm)
    const res = await api.put('/expense/update', cleanParams)
    return res
  }

  // 删除
  const delExpense = async (expenseId) => {
    const res = await api.delete(`/expense/${Number(expenseId)}`)

    return res
  }

  // 支出一级分类选项
  const getFirstCateList = async () => {
    const res = await api.get('/expense/first_cate/list')
    firstCateOptions.value = res.data.data.expenseFirstCateList
    return firstCateOptions.value
  }

  // 根据一级分类请求二级分类选项
  const getSecondCateListByFirst = async (firstCateId) => {
    const res = await api.get(`/expense/second_cate/list/${firstCateId}`)
    secondCateOptions.value = res.data.data.expenseSecondCateList
    return secondCateOptions.value
  }

  return {
    getExpenseList,
    addExpense,
    updateExpense,
    delExpense,
    getFirstCateList,
    firstCateOptions,
    getSecondCateListByFirst,
    secondCateOptions
  }

})

export default useExpenseStore
