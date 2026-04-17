<script setup>

</script>

<template>
  <div
    v-for="task in tasks"
    :key="task.id"
    class="group relative bg-slate-900/80 border border-slate-700 p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-sm"
    :class="getStatusColor(task.status)"
  >
    <!-- 装饰角标 -->
    <div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500 opacity-50"></div>
    <div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-fuchsia-500 opacity-50"></div>

    <!-- 状态标签 -->
    <div class="flex justify-between items-start mb-4">
            <span class="text-[10px] uppercase border px-2 py-0.5 rounded-none tracking-wider" :class="getStatusLabel(task.status).color">
              {{ getStatusLabel(task.status).text }}
            </span>
      <span class="text-xs text-slate-500 font-bold">ID: {{ task.id }}</span>
    </div>

    <!-- 标题 -->
    <h3 class="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1" :title="task.title">
      {{ task.title }}
    </h3>

    <!-- 目标简述 -->
    <p class="text-sm text-slate-400 mb-4 line-clamp-2 h-10 border-l-2 border-slate-800 pl-2 group-hover:border-cyan-500/30 transition-colors">
      {{ task.todo_goal || '无详细描述' }}
    </p>

    <!-- 数据网格 -->
    <div class="grid grid-cols-2 gap-2 text-xs mb-6 font-mono">
      <div class="flex flex-col">
        <span class="text-slate-600 text-[10px] uppercase">Deadline</span>
        <span class="text-fuchsia-400">{{ task.deadline || 'N/A' }}</span>
      </div>
      <div class="flex flex-col text-right">
        <span class="text-slate-600 text-[10px] uppercase">Focus Time</span>
        <span class="text-cyan-400">{{ task.focus_time || 0 }} min</span>
      </div>
      <div class="flex flex-col">
        <span class="text-slate-600 text-[10px] uppercase">Emotion</span>
        <span class="text-emerald-400">{{ task.emotion || 'Neutral' }}</span>
      </div>
      <div class="flex flex-col text-right">
        <span class="text-slate-600 text-[10px] uppercase">Imp.</span>
        <div class="flex justify-end gap-1 mt-1">
          <div v-for="i in 5" :key="i" class="w-1.5 h-3" :class="i <= task.importance ? 'bg-yellow-400 shadow-[0_0_5px_#facc15]' : 'bg-slate-800'"></div>
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="flex justify-between items-center border-t border-slate-800 pt-4 mt-2">
      <div class="text-[10px] text-slate-600">
        OKR: <span class="text-slate-400">{{ task.okr_id || '--' }}</span>
      </div>
      <div class="flex gap-2">
        <button @click="openModal(task)" class="cursor-pointer text-xs bg-slate-800 hover:bg-cyan-900 hover:text-cyan-400 border border-transparent hover:border-cyan-500 px-3 py-1 transition-all">
          编辑
        </button>
        <button @click="deleteTask(task.id)" class="cursor-pointer text-xs bg-slate-800 hover:bg-red-900/50 hover:text-red-400 border border-transparent hover:border-red-500 px-3 py-1 transition-all">
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
