import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'
import utils from '@/utils/common.js'


const useIncomeStore = defineStore('Income', () => {

  const firstCateOptions = ref([])
  const secondCateOptions = ref([])

  // 请求
  const getIncomeList = async (queryParams) => {
    const cleanParams = utils.cleanObject(queryParams)
    const res = await api.get('/income/list', {
      params: cleanParams
    })
    return res

  }

  // 新增
  const addIncome = async (incomeForm) => {
    const cleanParams = utils.cleanObject(incomeForm)
    const res = await api.post('/income/add', cleanParams)
    return res
  }

  // 更新
  const updateIncome = async (incomeForm) => {

    const cleanParams = utils.cleanObject(incomeForm)
    const res = await api.put('/income/update', cleanParams)
    return res
  }

  // 删除
  const delIncome = async (incomeId) => {
    const res = await api.delete(`/income/${Number(incomeId)}`)

    return res
  }

  // 收入一级分类选项
  const getFirstCateList = async () => {
    const res = await api.get('/income/first_cate/list')
    firstCateOptions.value = res.data.data.incomeFirstCateList
    return firstCateOptions.value
  }

  // 根据一级分类请求二级分类选项
  const getSecondCateListByFirst = async (firstCateId) => {
    const res = await api.get(`/income/second_cate/list/${firstCateId}`)
    secondCateOptions.value = res.data.data.incomeSecondCateList
    return secondCateOptions.value
  }

  return {
    getIncomeList,
    addIncome,
    updateIncome,
    delIncome,
    getFirstCateList,
    firstCateOptions,
    getSecondCateListByFirst,
    secondCateOptions
  }

})

export default useIncomeStore
