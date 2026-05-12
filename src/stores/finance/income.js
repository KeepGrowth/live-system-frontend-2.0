import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'
import utils from '@/utils/common.js'


const useIncomeStore = defineStore('Income', () => {

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

  // 更新单子
  const updateIncome = async (incomeForm) => {

    const cleanParams = utils.cleanObject(incomeForm)
    const res = await api.put('/income/update', cleanParams)
    return res
  }

  // 删除单子
  const delIncome = async (incomeId) => {


    const res = await api.delete(`/income/${Number(incomeId)}`)

    return res
  }


  return {

    getIncomeList,
    addIncome,
    updateIncome,
    delIncome
  }

})

export default useIncomeStore
