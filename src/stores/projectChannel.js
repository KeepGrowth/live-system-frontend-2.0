import { defineStore } from 'pinia'
import api from '@/utils/request.js'
import { ElNotification } from 'element-plus'
import formatTime from '@/utils/date.js'
import { ref } from 'vue'


const useProjectChannelStore = defineStore('projectChannel', () => {
    // 单子分类选项
    const channelOptions = ref([])

    // 请求单子分类
    const getProjectChannelList = async () => {
      const res = await api.get('/project/channel/list')
      if (res.data.code === 200) {
        channelOptions.value = res.data.data.channelList?.map(item => ({
          ...item,
          create_time: formatTime(item.create_time),
          update_time: formatTime(item.update_time)
        }))
        ElNotification.success(res.data.message)
        return channelOptions.value
      }
    }
    // 新增渠道分类
    const addChannel = async (channelForm) => {
      const res = await api.post('/project/channel/add', {
        channelName: channelForm.channel_name
      })
      if (res.data.code === 200) {
        await getProjectChannelList()
        ElNotification.success(res.data.message)
        return res.data.data
      }
    }

    // 更新渠道分类名称
    const updateChannel = async (channelForm) => {
      const res = await api.put('/project/channel/update', channelForm)
      if (res.data.code === 200) {
        await getProjectChannelList()
        ElNotification.success(res.data.message)
        return res.data.data
      }
    }
    // 删除渠道分类
    const deleteChannel = async (channelId) => {
      console.log(channelId)
      const res = await api.delete('/project/channel/delete', {
        params: {
          channelId
        }
      })
      if (res.data.code === 200) {
        ElNotification.success(res.data.message)
        await getProjectChannelList()
        return res.data.data
      }
    }


    return {
      // 相关属性
      channelOptions,

      // 增删改查方法
      getProjectChannelList,
      addChannel,
      updateChannel,
      deleteChannel
    }

  },
  {
    persist: true
  })

export default useProjectChannelStore
