<script setup>
import { nextTick, onBeforeMount, onMounted, ref } from 'vue'
import { Aim, Delete, Edit, Memo, Plus } from '@element-plus/icons-vue'
import useTodoStore from '@/stores/todo/todo.js'
import useOkrStore from '@/stores/okr/okr.js'
import { dayjs } from 'element-plus'
import todoDrawer from '@/views/todo/component/TodoDrawer.vue'
import TodoLogDrawer from '@/views/todo/component/TodoLogDrawer.vue'
// 数据容器
const todoList = ref([]) // Todo分页列表
const searchForm = ref({}) // 条件筛选器
const DrawerVisible = ref(false)
const logDrawerVisible = ref(false)
const todoForm = ref({
  deadline: dayjs().format('YYYY-MM-DD')
})
const todoId = ref(0)

// 状态管理
const todoStore = useTodoStore()
const okrStore = useOkrStore()
onMounted(async () => {
  todoList.value = await todoStore.getTodoList(searchForm.value)
})

onBeforeMount(() => {
  todoForm.value = {
    deadline: dayjs().format('YYYY-MM-DD')
  }// 单个Todo内容

  searchForm.value = {
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD')
  } // 条件筛选器
})


// 方法
// 打开编辑抽屉
const openDrawer = async (todoItem) => {
  todoForm.value = todoItem
  DrawerVisible.value = true
}

// 更改抽屉显示状态
const handleDrawerChange = async (bool) => {
  DrawerVisible.value = bool
  todoList.value = await todoStore.getTodoList(searchForm.value)
}

// 更改日志抽屉显示状态
const handleLogDrawerVisible = async (bool) => {
  DrawerVisible.value = bool
  todoList.value = await todoStore.getTodoList(searchForm.value)
}
const search = (searchForm) => {

}
// 删除
const delTodo = async (todoId) => {
  await todoStore.delTodo(todoId)
  todoList.value = await todoStore.getTodoList(searchForm)
}
// 打开日志抽屉
const openLogDrawer = async (id) => {
  todoId.value = id
  logDrawerVisible.value = true
}

</script>

<template>
  <el-row class="header-row">
    <el-col :span="24" class="header-content">
      <h1 class="page-title">
        <el-icon>
          <Memo />
        </el-icon>
        Todo清单
      </h1>
    </el-col>
  </el-row>
  <!--条件筛选器-->
  <el-row>
    <el-card class="filter-card-container">
      <el-form :inline="true" :model="searchForm" class="filter-form-container">

        <el-form-item label-width="auto" label="日期" prop="deadline">
          <el-date-picker
            type="date"
            v-model="searchForm.startDate"
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
          <el-button type="primary" @click="openDrawer(todoForm)">新增Todo</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
  <!--表格-->
  <el-row>
    <el-table
      v-if="todoList.length > 0"
      :data="todoList"
      style="width: 100%"
      stripe
      max-height="800"
      border
    >
      <el-table-column prop="name" label="Todo" width="auto" align="center" />
      <el-table-column prop="okrId" label="归属OKR" width="auto" sortable align="center">
        <template #default="scope">
          <el-tag type="primary">
            {{ okrStore.okrOptions.find(item => item.id === scope.row.okrId)?.krName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Todo状态" width="auto" align="center">
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
            @click="delTodo(scope.row.id)"
          >
          </el-button>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="添加todo日志"
            placement="bottom-end"
          >
            <el-button
              type="primary"
              size="small"
              :icon="Plus"
              circle
              @click="openLogDrawer(scope.row.id)"
            />
          </el-tooltip>


        </template>
      </el-table-column>

    </el-table>
    <el-empty v-else style="margin: 0 auto">没有数据，快来新增一个Todo吧~</el-empty>
  </el-row>
  <todo-drawer
    v-model:drawer-visible="DrawerVisible"
    @update:drawer-visible="handleDrawerChange"
    :todo-form="todoForm"
  />
  <todo-log-drawer
    v-model:drawer-visible="logDrawerVisible"
    @update:drawer-visible="handleLogDrawerVisible"
    :todo-id="todoId"
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
