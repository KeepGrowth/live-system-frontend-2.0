<template>
  <div
    class="min-h-screen w-full bg-slate-950 text-slate-200 font-mono selection:bg-cyan-500 selection:text-black relative">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 z-0 opacity-20"
         style="background-image: linear-gradient(0deg, transparent 24%, #22d3ee 25%, #22d3ee 26%, transparent 27%, transparent), linear-gradient(90deg, transparent 24%, #e879f9 25%, #e879f9 26%, transparent 27%, transparent); background-size: 50px 50px;"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950"></div>

    <div class="relative z-10 container mx-auto p-4 md:p-8">
      <!-- 头部区域 -->
      <header class="mb-10 border-b-2 border-cyan-500 pb-6 flex flex-col lg:flex-row justify-between items-end gap-6">

        <!-- 左侧：标题 -->
        <div class="w-full lg:w-auto">
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] glitch-text"
            data-text="Todo作战室">
            Todo作战室
          </h1>
          <p class="text-cyan-500/70 text-xs md:text-sm mt-2 font-mono">
            系统用户: <span class="text-cyan-300">在线中</span> // UserName: {{ currentUser }}
          </p>
        </div>

        <!-- 中间：筛选组件 (新增) -->
        <div
          class="w-full lg:w-auto flex flex-col sm:flex-row gap-3 items-center bg-slate-900/50 p-3 rounded-lg border border-cyan-900/50 backdrop-blur-sm">
          <!-- 快速按钮组 -->
          <div class="flex gap-2">
            <button
              class="cursor-pointer px-3 py-1.5 text-xs font-bold text-cyan-900 bg-cyan-500 rounded shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all hover:scale-105">
              今日
            </button>
            <button
              class="cursor-pointer px-3 py-1.5 text-xs font-bold text-cyan-400 border border-cyan-500/30 bg-cyan-950/30 rounded hover:bg-cyan-500/20 transition-all hover:border-cyan-400">
              本周
            </button>
            <button
              class="cursor-pointer px-3 py-1.5 text-xs font-bold text-cyan-400 border border-cyan-500/30 bg-cyan-950/30 rounded hover:bg-cyan-500/20 transition-all hover:border-cyan-400">
              本月
            </button>
          </div>

          <!-- 分割线 (仅桌面端显示) -->
          <div class="hidden sm:block w-px h-6 bg-cyan-800"></div>

          <!-- 日期范围输入 -->
          <div class="flex items-center gap-2">
            <input type="date"
                   class="bg-black/40 border border-cyan-800 text-cyan-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.4)] font-mono">
            <span class="text-cyan-600">至</span>
            <input type="date"
                   class="bg-black/40 border border-cyan-800 text-cyan-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.4)] font-mono">
          </div>
        </div>

        <!-- 右侧：新建按钮 -->
        <div class="w-full lg:w-auto flex justify-end">
          <button @click="openModal()"
                  class="cursor-pointer group relative px-6 py-3 bg-cyan-950/30 border border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all duration-300 clip-path-slant w-full sm:w-auto">
            <span
              class="cursor-pointer absolute w-0 h-0 top-0 left-0 bg-cyan-400 group-hover:w-full group-hover:h-full transition-all duration-300 -z-10"></span>
            + 新建任务
          </button>
        </div>

      </header>
      <swiper-component/>
      <!-- 任务列表网格 -->
      <!--待办-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-zinc-400 text-shadow-lg text-shadow-zinc-400/50">待办</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <span class="text-[10px] uppercase border px-2 py-0.5 rounded-none tracking-wider"
                  :class="getStatusLabel(task.status).color">
              {{ getStatusLabel(task.status).text }}
            </span>
              <span class="text-xs text-slate-500 font-bold">ID: {{ task.id }}</span>
            </div>

            <!-- 标题 -->
            <h3 class="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1"
                :title="task.title">
              {{ task.title }}
            </h3>

            <!-- 目标简述 -->
            <p
              class="text-sm text-slate-400 mb-4 line-clamp-2 h-10 border-l-2 border-slate-800 pl-2 group-hover:border-cyan-500/30 transition-colors">
              {{ task.todo_goal || '无详细描述' }}
            </p>

            <!-- 数据网格 -->
            <div class="grid grid-cols-2 gap-2 text-xs mb-6 font-mono">
              <div class="flex flex-col">
                <span class="text-slate-600 text-[10px] uppercase">截止日期</span>
                <span class="text-fuchsia-400">{{ task.deadline || 'N/A' }}</span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-slate-600 text-[10px] uppercase">专注时间</span>
                <span class="text-cyan-400">{{ task.focusTime || 0 }} min</span>
              </div>
              <div class="flex flex-col">
                <span class="text-slate-600 text-[10px] uppercase">情绪</span>
                <span class="text-emerald-400">{{ task.emotion || 'Neutral' }}</span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-slate-600 text-[10px] uppercase">重要性</span>
                <div class="flex justify-end gap-1 mt-1">
                  <div v-for="i in 5" :key="i" class="w-1.5 h-3"
                       :class="i <= task.importance ? 'bg-yellow-400 shadow-[0_0_5px_#facc15]' : 'bg-slate-800'"></div>
                </div>
              </div>
            </div>

            <!-- 操作栏 -->
            <div class="flex justify-between items-center border-t border-slate-800 pt-4 mt-2">
              <div class="text-[10px] text-slate-600">
                OKR: <span class="text-slate-400">{{ task.okrId || '--' }}</span>
              </div>
              <div class="flex gap-2">
                <button @click="openModal(task)"
                        class="cursor-pointer text-xs bg-slate-800 hover:bg-cyan-900 hover:text-cyan-400 border border-transparent hover:border-cyan-500 px-3 py-1 transition-all">
                  编辑
                </button>
                <button @click="deleteTask(task.id)"
                        class="cursor-pointer text-xs bg-slate-800 hover:bg-red-900/50 hover:text-red-400 border border-transparent hover:border-red-500 px-3 py-1 transition-all">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!--进行中-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-yellow-400 text-shadow-lg text-shadow-yellow-400/50">正在进行中</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <span class="text-[10px] uppercase border px-2 py-0.5 rounded-none tracking-wider"
                  :class="getStatusLabel(task.status).color">
              {{ getStatusLabel(task.status).text }}
            </span>
              <span class="text-xs text-slate-500 font-bold">ID: {{ task.id }}</span>
            </div>

            <!-- 标题 -->
            <h3 class="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1"
                :title="task.title">
              {{ task.title }}
            </h3>

            <!-- 目标简述 -->
            <p
              class="text-sm text-slate-400 mb-4 line-clamp-2 h-10 border-l-2 border-slate-800 pl-2 group-hover:border-cyan-500/30 transition-colors">
              {{ task.todo_goal || '无详细描述' }}
            </p>

            <!-- 数据网格 -->
            <div class="grid grid-cols-2 gap-2 text-xs mb-6 font-mono">
              <div class="flex flex-col">
                <span class="text-slate-600 text-[10px] uppercase">截止日期</span>
                <span class="text-fuchsia-400">{{ task.deadline || 'N/A' }}</span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-slate-600 text-[10px] uppercase">专注时间</span>
                <span class="text-cyan-400">{{ task.focusTime || 0 }} min</span>
              </div>
              <div class="flex flex-col">
                <span class="text-slate-600 text-[10px] uppercase">情绪</span>
                <span class="text-emerald-400">{{ task.emotion || 'Neutral' }}</span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-slate-600 text-[10px] uppercase">重要性</span>
                <div class="flex justify-end gap-1 mt-1">
                  <div v-for="i in 5" :key="i" class="w-1.5 h-3"
                       :class="i <= task.importance ? 'bg-yellow-400 shadow-[0_0_5px_#facc15]' : 'bg-slate-800'"></div>
                </div>
              </div>
            </div>

            <!-- 操作栏 -->
            <div class="flex justify-between items-center border-t border-slate-800 pt-4 mt-2">
              <div class="text-[10px] text-slate-600">
                OKR: <span class="text-slate-400">{{ task.okrId || '--' }}</span>
              </div>
              <div class="flex gap-2">
                <button @click="openModal(task)"
                        class="cursor-pointer text-xs bg-slate-800 hover:bg-cyan-900 hover:text-cyan-400 border border-transparent hover:border-cyan-500 px-3 py-1 transition-all">
                  编辑
                </button>
                <button @click="deleteTask(task.id)"
                        class="cursor-pointer text-xs bg-slate-800 hover:bg-red-900/50 hover:text-red-400 border border-transparent hover:border-red-500 px-3 py-1 transition-all">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!--已完成-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-green-400 text-shadow-lg text-shadow-green-400/50">已完成</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <span class="text-[10px] uppercase border px-2 py-0.5 rounded-none tracking-wider"
                  :class="getStatusLabel(task.status).color">
              {{ getStatusLabel(task.status).text }}
            </span>
              <span class="text-xs text-slate-500 font-bold">ID: {{ task.id }}</span>
            </div>

            <!-- 标题 -->
            <h3 class="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1"
                :title="task.title">
              {{ task.title }}
            </h3>

            <!-- 目标简述 -->
            <p
              class="text-sm text-slate-400 mb-4 line-clamp-2 h-10 border-l-2 border-slate-800 pl-2 group-hover:border-cyan-500/30 transition-colors">
              {{ task.todo_goal || '无详细描述' }}
            </p>

            <!-- 数据网格 -->
            <div class="grid grid-cols-2 gap-2 text-xs mb-6 font-mono">
              <div class="flex flex-col">
                <span class="text-slate-600 text-[10px] uppercase">截止日期</span>
                <span class="text-fuchsia-400">{{ task.deadline || 'N/A' }}</span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-slate-600 text-[10px] uppercase">专注时间</span>
                <span class="text-cyan-400">{{ task.focusTime || 0 }} min</span>
              </div>
              <div class="flex flex-col">
                <span class="text-slate-600 text-[10px] uppercase">情绪</span>
                <span class="text-emerald-400">{{ task.emotion || 'Neutral' }}</span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-slate-600 text-[10px] uppercase">重要性</span>
                <div class="flex justify-end gap-1 mt-1">
                  <div v-for="i in 5" :key="i" class="w-1.5 h-3"
                       :class="i <= task.importance ? 'bg-yellow-400 shadow-[0_0_5px_#facc15]' : 'bg-slate-800'"></div>
                </div>
              </div>
            </div>

            <!-- 操作栏 -->
            <div class="flex justify-between items-center border-t border-slate-800 pt-4 mt-2">
              <div class="text-[10px] text-slate-600">
                OKR: <span class="text-slate-400">{{ task.okrId || '--' }}</span>
              </div>
              <div class="flex gap-2">
                <button @click="openModal(task)"
                        class="cursor-pointer text-xs bg-slate-800 hover:bg-cyan-900 hover:text-cyan-400 border border-transparent hover:border-cyan-500 px-3 py-1 transition-all">
                  编辑
                </button>
                <button @click="deleteTask(task.id)"
                        class="cursor-pointer text-xs bg-slate-800 hover:bg-red-900/50 hover:text-red-400 border border-transparent hover:border-red-500 px-3 py-1 transition-all">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!--已放弃-->
      <section class="container mx-auto px-6 -mt-10 relative z-30 mt-10">
        <div class="flex items-end gap-4 mb-12 border-b border-slate-800 pb-4">
          <h2 class="text-3xl font-bold text-white">
            <span class="text-red-400 text-shadow-lg text-shadow-red-400/50">已放弃</span>
          </h2>
          <span class="font-mono text-xs text-slate-500 mb-1">:: 你已经做的非常棒了，慢点，看看花是怎么开的</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <span class="text-[10px] uppercase border px-2 py-0.5 rounded-none tracking-wider"
                  :class="getStatusLabel(task.status).color">
              {{ getStatusLabel(task.status).text }}
            </span>
              <span class="text-xs text-slate-500 font-bold">ID: {{ task.id }}</span>
            </div>

            <!-- 标题 -->
            <h3 class="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1"
                :title="task.title">
              {{ task.title }}
            </h3>

            <!-- 目标简述 -->
            <p
              class="text-sm text-slate-400 mb-4 line-clamp-2 h-10 border-l-2 border-slate-800 pl-2 group-hover:border-cyan-500/30 transition-colors">
              {{ task.todo_goal || '无详细描述' }}
            </p>

            <!-- 数据网格 -->
            <div class="grid grid-cols-2 gap-2 text-xs mb-6 font-mono">
              <div class="flex flex-col">
                <span class="text-slate-600 text-[10px] uppercase">截止日期</span>
                <span class="text-fuchsia-400">{{ task.deadline || 'N/A' }}</span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-slate-600 text-[10px] uppercase">专注时间</span>
                <span class="text-cyan-400">{{ task.focusTime || 0 }} min</span>
              </div>
              <div class="flex flex-col">
                <span class="text-slate-600 text-[10px] uppercase">情绪</span>
                <span class="text-emerald-400">{{ task.emotion || 'Neutral' }}</span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-slate-600 text-[10px] uppercase">重要性</span>
                <div class="flex justify-end gap-1 mt-1">
                  <div v-for="i in 5" :key="i" class="w-1.5 h-3"
                       :class="i <= task.importance ? 'bg-yellow-400 shadow-[0_0_5px_#facc15]' : 'bg-slate-800'"></div>
                </div>
              </div>
            </div>

            <!-- 操作栏 -->
            <div class="flex justify-between items-center border-t border-slate-800 pt-4 mt-2">
              <div class="text-[10px] text-slate-600">
                OKR: <span class="text-slate-400">{{ task.okrId || '--' }}</span>
              </div>
              <div class="flex gap-2">
                <button @click="openModal(task)"
                        class="cursor-pointer text-xs bg-slate-800 hover:bg-cyan-900 hover:text-cyan-400 border border-transparent hover:border-cyan-500 px-3 py-1 transition-all">
                  编辑
                </button>
                <button @click="deleteTask(task.id)"
                        class="cursor-pointer text-xs bg-slate-800 hover:bg-red-900/50 hover:text-red-400 border border-transparent hover:border-red-500 px-3 py-1 transition-all">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- 模态框 (新增/编辑) -->
    <div v-if="isModalOpen"
         class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        class="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] p-1">
        <!-- 模态框装饰线条 -->
        <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 -mt-1 -ml-1"></div>
        <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 -mt-1 -mr-1"></div>
        <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-fuchsia-500 -mb-1 -ml-1"></div>
        <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fuchsia-500 -mb-1 -mr-1"></div>

        <div class="bg-slate-950 p-6 md:p-8 relative overflow-y-auto max-h-[90vh]">
          <h2 class="text-2xl font-bold text-cyan-400 mb-6 uppercase tracking-widest border-b border-slate-800 pb-2">
            {{ editMode ? '>> 修改指令' : '>> 新建指令' }}
          </h2>

          <form @submit.prevent="saveTask" class="space-y-4">
            <!-- 第一行：标题与截止日期 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs text-cyan-500 uppercase font-bold">任务标题</label>
                <input v-model="form.title" type="text" required
                       class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all"
                       placeholder="输入任务名称...">
              </div>
              <div class="space-y-1">
                <label class="text-xs text-fuchsia-500 uppercase font-bold">截止日期</label>
                <input v-model="form.deadline" type="date"
                       class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-fuchsia-500 focus:shadow-[0_0_10px_rgba(232,121,249,0.3)] transition-all">
              </div>
            </div>

            <!-- 第二行：目标与描述 -->
            <div class="space-y-1">
              <label class="text-xs text-cyan-500 uppercase font-bold">核心目标 (Goal)</label>
              <textarea v-model="form.todo_goal" rows="3"
                        class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                        placeholder="详细描述任务目标..."></textarea>
            </div>

            <!-- 第三行：参数设置 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase">重要性</label>
                <select v-model="form.importance"
                        class="w-full bg-slate-900 border border-slate-700 text-yellow-400 p-2 focus:outline-none focus:border-yellow-500">
                  <option v-for="n in 5" :key="n" :value="n">Level {{ n }}</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase">状态</label>
                <select v-model="form.status"
                        class="w-full bg-slate-900 border border-slate-700 text-cyan-400 p-2 focus:outline-none focus:border-cyan-500">
                  <option :value="0">待办</option>
                  <option :value="1">进行中</option>
                  <option :value="2">完成</option>
                  <option :value="3">放弃</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 uppercase">专注时间</label>
                <input v-model.number="form.focusTime" type="number"
                       class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-cyan-500"
                       placeholder="分钟">
              </div>

            </div>

            <!-- 隐藏字段模拟 -->
            <div class="grid grid-cols-2 gap-4 opacity-50 hover:opacity-100 transition-opacity">
              <div class="space-y-1">
                <label class="text-[10px] text-slate-600 uppercase">Goal ID</label>
                <input v-model="form.goal_id" type="number"
                       class="w-full bg-slate-900 border border-slate-800 text-slate-500 p-2 text-sm"
                       placeholder="关联目标ID">
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-slate-600 uppercase">OKR ID</label>
                <input v-model="form.okrId" type="number"
                       class="w-full bg-slate-900 border border-slate-800 text-slate-500 p-2 text-sm"
                       placeholder="关联OKRID">
              </div>
            </div>

            <!-- 按钮 -->
            <div class="pt-4 flex justify-end gap-4">
              <button type="button" @click="isModalOpen = false"
                      class="cursor-pointer px-6 py-2 border border-slate-600 text-slate-400 hover:text-white hover:border-white transition-colors uppercase text-sm font-bold">
                取消
              </button>
              <button type="submit"
                      class="cursor-pointer px-6 py-2 bg-cyan-600 text-black hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all uppercase text-sm font-black tracking-wider clip-path-slant">
                提交
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import useUserStore from '@/stores/user.js'
import TodoCard from '@/views/todo/component/TodoCard.vue'
import SwiperComponent from '@/components/SwiperComponent.vue'

const userStore = useUserStore()
// 模拟当前用户名称
const currentUser = userStore.userInfo.username

// 任务列表数据
const tasks = ref([
  {
    id: 101,
    user_id: 8080,
    title: '系统核心升级',
    todo_goal: '将神经网络核心升级至v2.0，优化算法效率。',
    finish_desc: '',
    quit_desc: '',
    importance: 5,
    status: 1, // 进行中
    focusTime: 120,
    deadline: '2026-04-20',
    emotion: 'Focused',
    goal_id: 9,
    programId: 4,
    okrId: 1,
    create_time: '2026-04-17 10:00:00',
    update_time: '2026-04-17 10:00:00'
  },
  {
    id: 102,
    user_id: 8080,
    title: '数据清洗任务',
    todo_goal: '清理Q1季度的冗余日志数据。',
    importance: 3,
    status: 0, // 待办
    focusTime: 0,
    deadline: '2026-04-25',
    emotion: 'Neutral',
    goal_id: 2,
    programId: null,
    okrId: null
  },
  {
    id: 101,
    user_id: 8080,
    title: '系统核心升级',
    todo_goal: '将神经网络核心升级至v2.0，优化算法效率。',
    finish_desc: '',
    quit_desc: '',
    importance: 5,
    status: 1, // 进行中
    focusTime: 120,
    deadline: '2026-04-20',
    emotion: 'Focused',
    goal_id: 9,
    programId: 4,
    okrId: 1,
    create_time: '2026-04-17 10:00:00',
    update_time: '2026-04-17 10:00:00'
  },
  {
    id: 102,
    user_id: 8080,
    title: '数据清洗任务',
    todo_goal: '清理Q1季度的冗余日志数据。',
    importance: 3,
    status: 0, // 待办
    focusTime: 0,
    deadline: '2026-04-25',
    emotion: 'Neutral',
    goal_id: 2,
    programId: null,
    okrId: null
  },
  {
    id: 101,
    user_id: 8080,
    title: '系统核心升级',
    todo_goal: '将神经网络核心升级至v2.0，优化算法效率。',
    finish_desc: '',
    quit_desc: '',
    importance: 5,
    status: 1, // 进行中
    focusTime: 120,
    deadline: '2026-04-20',
    emotion: 'Focused',
    goal_id: 9,
    programId: 4,
    okrId: 1,
    create_time: '2026-04-17 10:00:00',
    update_time: '2026-04-17 10:00:00'
  },
  {
    id: 102,
    user_id: 8080,
    title: '数据清洗任务',
    todo_goal: '清理Q1季度的冗余日志数据。',
    importance: 3,
    status: 0, // 待办
    focusTime: 0,
    deadline: '2026-04-25',
    emotion: 'Neutral',
    goal_id: 2,
    programId: null,
    okrId: null
  },
  {
    id: 101,
    user_id: 8080,
    title: '系统核心升级',
    todo_goal: '将神经网络核心升级至v2.0，优化算法效率。',
    finish_desc: '',
    quit_desc: '',
    importance: 5,
    status: 1, // 进行中
    focusTime: 120,
    deadline: '2026-04-20',
    emotion: 'Focused',
    goal_id: 9,
    programId: 4,
    okrId: 1,
    create_time: '2026-04-17 10:00:00',
    update_time: '2026-04-17 10:00:00'
  },
  {
    id: 102,
    user_id: 8080,
    title: '数据清洗任务',
    todo_goal: '清理Q1季度的冗余日志数据。',
    importance: 3,
    status: 0, // 待办
    focusTime: 0,
    deadline: '2026-04-25',
    emotion: 'Neutral',
    goal_id: 2,
    programId: null,
    okrId: null
  }
])

// 模态框状态
const isModalOpen = ref(false)
const editMode = ref(false)

// 表单数据模型 (对应数据库字段)
const defaultForm = {
  id: null,
  user_id: currentUser,
  title: '',
  todo_goal: '',
  finish_desc: '',
  quit_desc: '',
  importance: 1,
  status: 0,
  focusTime: 0,
  deadline: '',
  emotion: '',
  goal_id: null,
  programId: null,
  okrId: null
}

const form = reactive({ ...defaultForm })

// 打开模态框
const openModal = (task = null) => {
  if (task) {
    editMode.value = true
    Object.assign(form, task) // 填充数据
  } else {
    editMode.value = false
    Object.assign(form, defaultForm) // 重置表单
    form.user_id = currentUser // 确保User ID正确
  }
  isModalOpen.value = true
}

// 保存任务 (新增/修改)
const saveTask = () => {
  if (editMode.value) {
    // 模拟更新
    const index = tasks.value.findIndex(t => t.id === form.id)
    if (index !== -1) {
      tasks.value[index] = { ...form }
    }
  } else {
    // 模拟新增
    const newId = tasks.value.length ? Math.max(...tasks.value.map(t => t.id)) + 1 : 100
    tasks.value.unshift({
      ...form,
      id: newId,
      create_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
      update_time: new Date().toISOString().slice(0, 19).replace('T', ' ')
    })
  }
  isModalOpen.value = false
}

// 删除任务
const deleteTask = (id) => {
  if (confirm('确认删除该数据块？此操作不可逆。')) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }
}

// 辅助函数：状态样式
const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return 'border-l-4 border-l-yellow-400' // 进行中
    case 2:
      return 'border-l-4 border-l-emerald-500 opacity-75' // 完成
    case 3:
      return 'border-l-4 border-l-red-500 opacity-50 grayscale' // 放弃
    default:
      return 'border-l-4 border-l-cyan-500' // 待办
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 1:
      return { text: '进行中', color: 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' }
    case 2:
      return { text: '已完成', color: 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' }
    case 3:
      return { text: '已放弃', color: 'border-red-500/50 text-red-500 bg-red-500/10' }
    default:
      return { text: '待开始', color: 'border-cyan-500/50 text-cyan-500 bg-cyan-500/10' }
  }
}
</script>

<style scoped>
/* 赛博朋克斜切角按钮 */
.clip-path-slant {
  clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
}

/* 简单的故障文字效果 */
.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch-text::before {
  color: #f0f;
  z-index: -1;
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}

.glitch-text::after {
  color: #0ff;
  z-index: -2;
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% {
    clip-path: inset(20% 0 80% 0);
    transform: translate(-2px, 1px);
  }
  20% {
    clip-path: inset(60% 0 10% 0);
    transform: translate(2px, -1px);
  }
  40% {
    clip-path: inset(40% 0 50% 0);
    transform: translate(-2px, 2px);
  }
  60% {
    clip-path: inset(80% 0 5% 0);
    transform: translate(2px, -2px);
  }
  80% {
    clip-path: inset(10% 0 70% 0);
    transform: translate(-1px, 1px);
  }
  100% {
    clip-path: inset(30% 0 20% 0);
    transform: translate(1px, -1px);
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip-path: inset(10% 0 60% 0);
    transform: translate(2px, -1px);
  }
  20% {
    clip-path: inset(80% 0 5% 0);
    transform: translate(-2px, 2px);
  }
  40% {
    clip-path: inset(30% 0 20% 0);
    transform: translate(2px, 1px);
  }
  60% {
    clip-path: inset(15% 0 80% 0);
    transform: translate(-1px, -2px);
  }
  80% {
    clip-path: inset(50% 0 30% 0);
    transform: translate(1px, 2px);
  }
  100% {
    clip-path: inset(5% 0 90% 0);
    transform: translate(-2px, 1px);
  }
}
</style>
