<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { Aim, Delete, Edit, Plus } from '@element-plus/icons-vue'
import useGoalStore from '@/stores/goal/goal.js'
import useGoalCateStore from '@/stores/goal/goalCategory.js'
import { dayjs } from 'element-plus'
import GoalDrawer from '@/views/goal/component/GoalDrawer.vue'
// 数据容器
const goalList = ref([]) // 项目分页列表
const goalForm = ref({}) // 单个项目内容
const searchForm = ref({
  goalYear: [dayjs(new Date()).year]
}) // 条件筛选器
const DrawerVisible = ref(false)

// 状态管理
const goalStore = useGoalStore()
const goalCateStore = useGoalCateStore()
onMounted(async () => {
  goalList.value = await goalStore.getGoalList()
})


// 方法
// 打开编辑抽屉
const openDrawer = async (goalItem) => {
  goalForm.value = goalItem
  DrawerVisible.value = true
}

// 更改抽屉显示状态
const handleDrawerChange = async (bool) => {
  DrawerVisible.value = bool
  goalList.value = await goalStore.getGoalList()
}
const search = (searchForm) => {

}
// 删除
const delGoal = async (goalId) => {
  await goalStore.delGoal(goalId)
  goalList.value = await goalStore.getGoalList()
}

</script>

<template>
  <el-row class="header-row">
    <el-col :span="24" class="header-content">

      <h1 class="page-title">
        <el-icon>
          <Aim />
        </el-icon>
        目标管理
      </h1>
    </el-col>
  </el-row>
  <!--条件筛选器-->
  <el-row>
    <el-card class="filter-card-container">
      <el-form :inline="true" :model="searchForm" class="filter-form-container">

        <el-form-item label-width="auto" label="年份" prop="goalYear">
          <el-date-picker
            type="year"
            v-model="searchForm.goalYear"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="auto" label="目标分类" prop="goalCategoryId">
          <!-- 1. 绑定v-model + 设置宽度100% + 补充占位符 -->
          <el-select
            v-model="searchForm.goalCategoryId"
            style="width: 10rem;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in goalCateStore.goalCateOptions"
              :key="item.id"
              :label="item.categoryName"
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
          <el-button type="primary" @click="openDrawer({})">新增目标</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
  <!--表格-->
  <el-row>
    <el-table
      v-if="goalList.length > 0"
      :data="goalList"
      style="width: 100%"
      stripe
      max-height="800"
      border
    >
      <el-table-column prop="startDate" label="开始时间" width="auto" align="center" />
      <el-table-column prop="finishDate" label="预计完成时间" width="auto" align="center" />
      <el-table-column prop="goalName" label="目标" width="auto" align="center" />
      <el-table-column prop="goalCategoryId" label="目标分类" width="auto" align="center" />
      <el-table-column prop="goalStatus" label="目标状态" width="auto" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.goalStatus === 0" type="info">待完成</el-tag>
          <el-tag v-else-if="scope.row.goalStatus === 1" type="success">已完成</el-tag>
          <el-tag v-else type="danger">已放弃</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="satisfactionScore"
        label="目标信心程度" width="auto"
        align="center">
        <template
          #default="scope"
        >
          <el-rate v-model="scope.row.satisfactionScore" disabled></el-rate>
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
            @click="delGoal(scope.row.id)"
          >
          </el-button>

        </template>
      </el-table-column>

    </el-table>
    <el-empty v-else style="margin: 0 auto">没有数据，快来新增一个目标吧~</el-empty>
  </el-row>
  <goal-drawer
    v-model:drawer-visible="DrawerVisible"
    @update:drawer-visible="handleDrawerChange"
    :goal-form="goalForm"
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
