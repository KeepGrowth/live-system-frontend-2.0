<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { Aim, Delete, Edit, Memo, Plus } from '@element-plus/icons-vue'
import useOkrStore from '@/stores/okr/okr.js'
import useProgramStore from '@/stores/program/program.js'
import { dayjs } from 'element-plus'
import okrDrawer from '@/views/okr/component/OkrDrawer.vue'
// 数据容器
const okrList = ref([]) // Okr分页列表
const okrForm = ref({}) // 单个Okr内容
const searchForm = ref({
  okrYear: [dayjs(new Date()).year]
}) // 条件筛选器
const DrawerVisible = ref(false)

// 状态管理
const okrStore = useOkrStore()
const programStore = useProgramStore()
onMounted(async () => {
  okrList.value = await okrStore.getOkrList()
})


// 方法
// 打开编辑抽屉
const openDrawer = async (okrItem) => {
  okrForm.value = okrItem
  DrawerVisible.value = true
}

// 更改抽屉显示状态
const handleDrawerChange = async (bool) => {
  DrawerVisible.value = bool
  okrList.value = await okrStore.getOkrList()
}
const search = (searchForm) => {

}
// 删除
const delOkr = async (okrId) => {
  await okrStore.delOkr(okrId)
  okrList.value = await okrStore.getOkrList()
}

</script>

<template>
  <el-row class="header-row">
    <el-col :span="24" class="header-content">
      <h1 class="page-title">
        <el-icon>
          <Memo />
        </el-icon>
        Okr管理
      </h1>
    </el-col>
  </el-row>
  <!--条件筛选器-->
  <el-row>
    <el-card class="filter-card-container">
      <el-form :inline="true" :model="searchForm" class="filter-form-container">

        <el-form-item label-width="auto" label="年份" prop="okrYear">
          <el-date-picker
            type="year"
            v-model="searchForm.okrYear"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openDrawer({})">新增Okr</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
  <!--表格-->
  <el-row>
    <el-table
      v-if="okrList.length > 0"
      :data="okrList"
      style="width: 100%"
      stripe
      max-height="800"
      border
    >
      <el-table-column prop="krName" label="关键结果" width="auto" align="center" />
      <el-table-column prop="krDesc" label="KR描述" width="auto" align="center" />
      <el-table-column prop="programId" label="归属项目" width="auto" sortable align="center">
        <template #default="scope">
          <el-tag type="primary">
            {{ programStore.programOptions.find(item => item.id === scope.row.programId)?.programName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Okr状态" width="auto" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="info">待完成</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">已完成</el-tag>
          <el-tag v-else type="danger">已放弃</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button
            type="warning"
            size="small"
            :icon="Edit"
            circle
            @click="openDrawer(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            size="small"
            circle
            :icon="Delete"
            @click="delOkr(scope.row.id)"
          >
          </el-button>

        </template>
      </el-table-column>

    </el-table>
    <el-empty v-else style="margin: 0 auto">没有数据，快来新增一个Okr吧~</el-empty>
  </el-row>
  <okr-drawer
    v-model:drawer-visible="DrawerVisible"
    @update:drawer-visible="handleDrawerChange"
    :okr-form="okrForm"
  />
</template>

<style scoped>
/* 页面标题样式 */
.page-title {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f6deb0;
}

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
