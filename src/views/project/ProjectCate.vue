<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import useProjectChannelStore from '@/stores/project/projectChannel.js'
import ChannelDialog from '@/views/project/component/ChannelDialog.vue'
import { ElLoading, vLoading } from 'element-plus'
// 数据容器
const projectChannelList = ref([]) // 项目分页列表
const channelForm = ref({}) // 单个分类内容

// 添加编辑模态框数据与方法。
const dialogVisible = ref(false) // 控制显隐

// 状态管理
const projectChannelStore = useProjectChannelStore()
onMounted(async () => {
  projectChannelList.value = await projectChannelStore.getProjectChannelList()
})


// 方法
// 打开编辑对话框
const openDialog = (channelItem) => {
  channelForm.value = channelItem
  dialogVisible.value = true
}

// 更改编辑对话框显示状态
const handleDialogChange = async (bool) => {
  dialogVisible.value = bool
  // 刷新数据列表
  projectChannelList.value = await projectChannelStore.getProjectChannelList()
}

// 查询按钮方法
const search = (searchForm) => {

}
// 删除渠道分类方法
const delChannel = async (channelId) => {
  await projectChannelStore.deleteChannel(channelId)
  projectChannelList.value = await projectChannelStore.getProjectChannelList()
}


</script>

<template>
  <el-row class="header-row">
    <el-col :span="24" class="header-content">
      <h1>渠道分类</h1>
    </el-col>
  </el-row>
  <!--新增分类-->
  <el-row>
    <el-card class="filter-card-container">
      <el-form-item>
        <el-button type="primary" @click="openDialog({})">新增分类</el-button>
      </el-form-item>
    </el-card>
  </el-row>
  <!--表格-->
  <el-row>
    <el-table
      v-if="projectChannelList.length > 0"
      :data="projectChannelList"
      style="width: 100%"
      stripe
      max-height="800"
      border
    >
      <el-table-column prop="channel_name" label="渠道" width="auto" align="center" />
      <el-table-column prop="create_time" label="创建时间" width="auto" align="center" />
      <el-table-column prop="update_time" label="更新时间" width="auto" align="center" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button
            type="warning"
            size="small"
            :icon="Edit"
            circle
            @click="openDialog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            size="small"
            circle
            :icon="Delete"
            @click="delChannel(scope.row.id)"
          >
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-empty v-else style="margin: 0 auto">没有数据，快来新增一个分类吧~</el-empty>
  </el-row>
  <channel-dialog v-model="dialogVisible" @update:dialog-visible="handleDialogChange" :channel-form="channelForm" />

</template>

<style scoped>
.filter-card-container {
  width: 100%;
}

/* 2. 清除 el-card 的所有内边距和外边距 */
:deep(.filter-card-container) {
  margin: 0 !important; /* 清除卡片外边距 */
  padding: 0 !important; /* 清除卡片内边距 */
  border: none !important; /* 可选：清除卡片边框（如需） */
  box-shadow: none !important; /* 可选：清除卡片阴影（如需） */
}

</style>
