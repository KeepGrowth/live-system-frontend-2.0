<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Aim, Delete, Edit, Memo, Plus, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dayjs } from 'element-plus'
import useTodoStore from '@/stores/todo/todo.js'
import useOkrStore from '@/stores/okr/okr.js'
import todoDrawer from '@/views/todo/component/TodoDrawer.vue'
import TodoLogDrawer from '@/views/todo/component/TodoLogDrawer.vue'
import { Search } from '@icon-park/vue-next'

// ====================== 1. 状态定义（规范命名 + 统一初始化） ======================
const todoList = ref([])
const total = ref(0)
const searchForm = ref({
  page: 1,
  pageSize: 10,
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD')
})
const isDrawerVisible = ref(false)
const isLogDrawerVisible = ref(false)
const todoForm = ref({
  deadline: dayjs().format('YYYY-MM-DD')
})
const currentTodoId = ref(0)
// 加载状态（优化用户体验）
const isLoading = ref(false)

// ====================== 2. 状态管理 & 核心方法 ======================
const todoStore = useTodoStore()
const okrStore = useOkrStore()

// 计算属性：优化OKR名称查找（缓存结果，避免重复遍历）
const getOkrName = computed(() => (okrId) => {
  return okrStore.okrOptions?.find(item => item.id === okrId)?.krName || '未关联'
})

/**
 * 统一获取Todo列表（添加加载状态）
 */
const fetchTodoList = async () => {
  if (isLoading.value) return // 防止重复请求
  isLoading.value = true
  try {
    const { list, total: totalCount } = await todoStore.getTodoList(searchForm.value)
    todoList.value = list
    total.value = totalCount
  } catch (error) {
    ElMessage.error('获取Todo列表失败：' + (error.message || '未知错误'))
    console.error('Todo列表请求失败：', error)
  } finally {
    isLoading.value = false // 无论成功失败都关闭加载
  }
}

// ====================== 3. 生命周期 & 监听 ======================
onMounted(async () => {
  await fetchTodoList()
})

// 监听分页参数变化，自动刷新（可选开启）
// watch([() => searchForm.value.page, () => searchForm.value.pageSize], fetchTodoList, { immediate: false })

// ====================== 4. 业务方法 ======================
// 打开新增/编辑抽屉
const openDrawer = async (todoItem = { deadline: dayjs().format('YYYY-MM-DD') }) => {
  todoForm.value = { ...todoItem } // 深拷贝，新增时用默认值
  isDrawerVisible.value = true
}

// 抽屉显隐切换
const handleDrawerVisibleChange = async (visible) => {
  isDrawerVisible.value = visible
  if (!visible) await fetchTodoList()
}

// 日志抽屉显隐切换
const handleLogDrawerVisibleChange = async (visible) => {
  isLogDrawerVisible.value = visible
  if (!visible) await fetchTodoList()
}

// 筛选查询
const handleSearch = async () => {
  searchForm.value.page = 1
  await fetchTodoList()
}

// 重置筛选条件
const handleReset = () => {
  searchForm.value = {
    page: 1,
    pageSize: 10,
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD')
  }
  fetchTodoList()
}

// 删除Todo（添加二次确认）
const handleDeleteTodo = async (todoId) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该Todo吗？删除后不可恢复！',
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await todoStore.delTodo(todoId)
    ElMessage.success('删除成功！')
    await fetchTodoList()
  } catch (error) {
    if (error !== 'cancel') { // 取消操作不报错
      ElMessage.error('删除失败：' + (error.message || '未知错误'))
      console.error('删除Todo失败：', error)
    }
  }
}

// 打开日志抽屉
const openLogDrawer = async (id) => {
  currentTodoId.value = id
  isLogDrawerVisible.value = true
}

// ====================== 5. 分页处理 ======================
const handlePageSizeChange = async (newPageSize) => {
  searchForm.value.pageSize = newPageSize
  searchForm.value.page = 1
  await fetchTodoList()
}

const handleCurrentPageChange = async (newCurrentPage) => {
  searchForm.value.page = newCurrentPage
  await fetchTodoList()
}
</script>

<template>
  <!-- 页面头部 -->
  <el-row class="header-row">
    <el-col :span="24" class="header-content">
      <h1 class="page-title">
        <el-icon><Memo /></el-icon>
        Todo清单
      </h1>
    </el-col>
  </el-row>

  <!-- 条件筛选器 -->
  <el-row class="filter-row" style="display: flex;justify-content: space-between;align-items: center">
    <el-card class="filter-card">
      <el-form
        :inline="true"
        :model="searchForm"
        class="filter-form"
        @submit.prevent="handleSearch"
      >
        <el-form-item label="日期范围" label-width="80px">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            placeholder="选择开始日期"
            style="width: 180px"
          />
          <span class="date-separator">至</span>
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            placeholder="选择结束日期"
            style="width: 180px"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch"
            :loading="isLoading"
            :icon="Search"
          >
            查询
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            @click="handleReset"
            :icon="Refresh"
          >
            重置
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            @click="openDrawer()"
            :icon="Plus"
          >
            新增Todo
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>

  <!-- 表格 & 分页 -->
  <el-row class="table-row">
    <!-- 加载中状态 -->
    <el-skeleton v-if="isLoading" :rows="8" animated style="width: 100%" />

    <!-- 数据表格 -->
    <template v-else>
      <el-table
        v-if="todoList.length > 0"
        :data="todoList"
        stripe
        border
        height="500"
        style="width: 100%"
        empty-text="暂无数据"
      >
        <el-table-column
          prop="name"
          label="Todo名称"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="okrId"
          label="归属OKR"
          align="center"
          min-width="150"
          sortable
        >
          <template #default="scope">
            <el-tag type="primary">{{ getOkrName(scope.row.okrId) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="Todo状态"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="info">待完成</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="success">进行中</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">已完成</el-tag>
            <el-tag v-else type="danger">已放弃</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <el-button
              type="warning"
              size="small"
              :icon="Edit"
              circle
              @click="openDrawer(scope.row)"
              tooltip="编辑"
            />
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              circle
              @click="handleDeleteTodo(scope.row.id)"
              tooltip="删除"
            />
            <el-button
              type="primary"
              size="small"
              :icon="Plus"
              circle
              @click="openLogDrawer(scope.row.id)"
              tooltip="添加Todo日志"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-else
        description="暂无Todo数据，快来新增一个吧~"
        style="margin: 0 auto"
      >
        <el-button type="success" @click="openDrawer()">新增Todo</el-button>
      </el-empty>

      <!-- 分页组件 -->
      <el-pagination
        v-if="todoList.length > 0"
        style="margin: 2rem auto; text-align: right"
        v-model:current-page="searchForm.page"
        v-model:page-size="searchForm.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"
        :disabled="isLoading"
      />
    </template>
  </el-row>

  <!-- 抽屉组件 -->
  <todo-drawer
    v-model:drawer-visible="isDrawerVisible"
    @update:drawer-visible="handleDrawerVisibleChange"
    :todo-form="todoForm"
  />
  <todo-log-drawer
    v-model:drawer-visible="isLogDrawerVisible"
    @update:drawer-visible="handleLogDrawerVisibleChange"
    :todo-id="currentTodoId"
  />
</template>

<style scoped>
/* 页面标题 */
.header-row {
  margin-bottom: 1rem;
}
.page-title {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem 0;
  background-color: #f6deb0;
  margin: 0;
  border-radius: 4px;
  color: #333;
}

/* 筛选区域 */
.filter-row {
  margin-bottom: 2rem;
}
.filter-card {
  width: 100%;
  --el-card-padding: 1rem;
  --el-card-border-radius: 4px;
}
.filter-form {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  margin-left: 3rem;
  gap: 0.8rem;
}
.date-separator {
  margin: 0 0.5rem;
  color: #999;
}

/* 表格区域 */
.table-row {
  --el-table-header-text-color: #666;
  --el-table-row-hover-bg-color: #f8f9fa;
}

/* 修复tooltip样式穿透 */
:deep(.el-tooltip__popper) {
  max-width: 200px;
}
</style>
