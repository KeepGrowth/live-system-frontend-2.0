<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import TextEditor from '@/components/TextEditor.vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import Uploader from '@/components/Uploader.vue'
import ProjectDrawer from '@/views/project/component/ProjectDrawer.vue'
import useProjectStore from '@/stores/project'
// 数据容器
const programList = ref([]) // 项目分页列表
const projectForm = ref({}) // 单个项目内容
const searchForm = ref({
  dateRange: [],
  channelId: 1
}) // 条件筛选器
const DrawerVisible = ref(false)

// 状态管理
const projectStore = useProjectStore()
onMounted(async () => {
  programList.value = await projectStore.getProjectList()
})


// 方法
// 打开编辑抽屉
const openDrawer = (projectItem: {}) => {
  console.log(projectItem)

  projectForm.value = projectItem
  DrawerVisible.value = true
}

// 更改抽屉显示状态
const handleDrawerChange = async (bool) => {
  DrawerVisible.value = bool
  programList.value = await projectStore.getProjectList()
}
const search = (searchForm: object) => {

}
// 条件查询

</script>

<template>
  <el-row class="header-row">
    <el-col :span="24" class="header-content">
      <h1>项目管理</h1>
    </el-col>
  </el-row>
  <!--条件筛选器-->
  <el-row>
    <el-card class="filter-card-container">
      <el-form :inline="true" :model="searchForm" class="filter-form-container">

        <el-form-item label-width="auto" label="截止日期范围" prop="dateRange">
          <el-date-picker
            type="daterange"
            v-model="searchForm.dateRange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="auto" label="项目来源" prop="channelId">
          <!-- 1. 绑定v-model + 设置宽度100% + 补充占位符 -->
          <el-select
            v-model="searchForm.channelId"
            style="width: 6rem;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.channel_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openDrawer({})">新增项目</el-button>

        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
  <!--表格-->
  <el-row>
    <el-table
      v-if="programList.length > 0"
      :data="programList"
      style="width: 100%"
      stripe
      max-height="800"
      border
    >
      <el-table-column
        fixed
        prop="end_date"
        label="截止日期"
        width="150"
        align="center"
        sortable
      />
      <el-table-column prop="project_name" label="项目" width="auto" align="center" />
      <el-table-column prop="project_stack" label="技术栈" width="auto" align="center" />
      <el-table-column prop="amount" label="总金额" width="auto" align="center" />
      <el-table-column prop="channel_id" label="来源" width="auto" align="center" />
      <el-table-column prop="customer_id" label="客户" width="auto" align="center" />
      <el-table-column prop="create_time" label="创建时间" width="auto" align="center" />
      <el-table-column fixed="right" label="Operations" min-width="120">
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
          >
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-empty v-else style="margin: 0 auto">没有数据，快来新增一个项目吧~</el-empty>
  </el-row>

  <project-drawer
    v-model:drawer-visible="DrawerVisible"
    @update:drawer-visible="handleDrawerChange"
    :projectForm="projectForm"
  />
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
