<template>
  <el-header>
    <el-menu
      :default-active="activeIndex"
      class="header-menu"
      mode="horizontal"
      :ellipsis="false"
      @select="redirect_to"
    >
      <el-menu-item index="goal">
        <el-icon>
          <HomeFilled />
        </el-icon>
        <h1>浮生录事</h1>
      </el-menu-item>
      <el-sub-menu>
        <template #title>常用选项</template>
        <el-menu-item @click="openWeightDialog({})">更新体重</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="person">
        <template #title>{{ userStore.userInfo.username }}</template>
        <el-menu-item index="2-1">个人中心</el-menu-item>
        <el-menu-item index="2-2">退出登录</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-header>
  <el-row style="height: 100vh">
    <el-col :span="isCollapse?1:3">
      <el-menu
        default-active="Work"
        class="tab-bar"
        :collapse="isCollapse"
        @select="redirect_to"
      >
        <el-sub-menu index="Work">
          <template #title>
            <el-icon>
              <Coin />
            </el-icon>
            <span>事业</span>
          </template>
          <el-menu-item index="goal">目标管理</el-menu-item>
          <el-menu-item index="program">项目管理</el-menu-item>
          <el-menu-item index="okr">OKR管理</el-menu-item>
          <el-menu-item index="todo">Todo管理</el-menu-item>
          <el-menu-item index="project">IT项目管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="Finance">
          <template #title>
            <el-icon>
              <List />
            </el-icon>
            <span>收支</span>
          </template>
          <el-menu-item index="2-1">支出管理</el-menu-item>
          <el-menu-item index="2-2">收入管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="Live">
          <template #title>
            <el-icon>
              <ColdDrink />
            </el-icon>
            <span>生活</span>
          </template>
          <el-menu-item index="2-1">阅读管理</el-menu-item>
          <el-menu-item index="2-2">日记管理</el-menu-item>
          <el-menu-item index="weight">体重管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
    <el-col :span="isCollapse?23:21">
      <router-view></router-view>
    </el-col>
  </el-row>
  <!-- 折叠/展开控制按钮 - 固定在屏幕中间下方 -->
  <div class="button-row">
    <!-- 动态切换图标：展开(isCollapse=false)显示向右箭头，折叠(isCollapse=true)显示向左箭头 -->
    <el-button
      @click="isCollapse = !isCollapse"
    >
      <template #icon>
        <el-icon v-if="!isCollapse">
          <ArrowLeft />
        </el-icon>
        <el-icon v-else>
          <ArrowRight />
        </el-icon>
      </template>
    </el-button>
  </div>
  <weight-dialog v-model="dialogVisible" @update:dialog-visible="handleDialogChange" :weight-form="weightForm" />


</template>

<script lang="ts" setup>
import { ArrowLeft, ArrowRight, Coin, ColdDrink, HomeFilled, List } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import WeightDialog from '@/views/weight/component/WeightDialog.vue'
// 用户状态
const userStore = useUserStore()

const activeIndex = ref('goal')

const isCollapse = ref(false)

// 根据选择的选项跳转路由
// 初始化路由实例
const router = useRouter()
const redirect_to = (index: string) => {
  // 1. 根据index获取对应的路由名称
  // 3. 路由跳转（捕获重复跳转错误）
  try {
    router.push({ name: index })
  } catch (err) {
    if ((err as Error).name !== 'NavigationDuplicated') {
      throw err // 只忽略重复跳转错误，其他错误正常抛出
    }
  }
}

// 体重对话框相关变量与方法
const dialogVisible = ref(false)
const weightForm = ref({})

// 打开体重对话框
const openWeightDialog = (weightItem:object) => {
  dialogVisible.value = true
  weightForm.value = weightItem
}

// 处理对话框关闭
const handleDialogChange = (bool:boolean) => {
  dialogVisible.value = bool
}

</script>


<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

/* 核心：让菜单高度铺满容器，边框铺满高度 */
:deep(.tab-bar) {
  height: 100%; /* 菜单高度铺满外层容器 */
  border-right: 1px solid #e6e6e6; /* 自定义右侧边框（替换默认） */
  /* 关键：取消默认的inline-block，改为block */
  display: block;
  /* 可选：如果有内边距，清除后边框更贴合 */
  padding: 0;
  margin: 0;
}


/* 按钮固定在屏幕中间下方的样式 */
.button-row {
  position: fixed;
  left: 5%;
  bottom: 3vh;
  transform: translateX(-50%);
  z-index: 999;
  /* 可选：添加轻微阴影提升视觉效果 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.button-row > * {
  margin: 0;
}

/* 按钮大小可自定义（可选） */
:deep(.el-button--circle) {
  width: 20px;
  height: 20px;

}
</style>
