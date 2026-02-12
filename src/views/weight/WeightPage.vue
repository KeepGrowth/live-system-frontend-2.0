<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import weightDialog from '@/views/weight/component/WeightDialog.vue'
import useWeightStore from '@/stores/weight/weight.js'
// 数据容器
const weightList = ref([]) // 项目分页列表
const weightForm = ref({}) // 单个体重内容

// 添加编辑模态框数据与方法。
const dialogVisible = ref(false) // 控制显隐

// 状态管理
const weightStore = useWeightStore()
onMounted(async () => {
  weightList.value = await weightStore.getWeightList()
})


// 方法
// 打开编辑对话框
const openDialog = (weightItem) => {
  weightForm.value = weightItem
  dialogVisible.value = true
}

// 更改编辑对话框显示状态
const handleDialogChange = async (bool) => {
  dialogVisible.value = bool
  // 刷新数据列表
  weightList.value = await weightStore.getWeightList()
}

// 查询按钮方法
const search = (searchForm) => {

}
// 删除渠道分类方法
const delChannel = async (weightId) => {
  await weightStore.delWeight(weightId)
  weightList.value = await weightStore.getWeightList()
}


</script>

<template>
  <el-row class="header-row">
    <el-col :span="24" class="header-content">
      <h1>体重管理</h1>
    </el-col>
  </el-row>
  <!--新增分类-->
  <el-row>
    <el-card class="filter-card-container">
      <el-form-item>
        <el-button type="primary" @click="openDialog({})">新增体重记录</el-button>
      </el-form-item>
    </el-card>
  </el-row>
  <!--表格-->
  <el-row>
    <el-table
      v-if="weightList.length > 0"
      :data="weightList"
      style="width: 100%"
      stripe
      max-height="800"
      border
    >
      <el-table-column prop="updateTime" label="创建时间" width="auto" align="center" />
      <el-table-column prop="createTime" label="更新时间" width="auto" align="center" />
      <el-table-column prop="weight" label="体重(kg)" width="auto" align="center" />
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
  <weight-dialog v-model="dialogVisible" @update:dialog-visible="handleDialogChange" :weight-form="weightForm" />

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
