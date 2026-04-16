<template>
  <div class="min-h-screen bg-slate-950 text-cyan-50 font-mono p-8 selection:bg-fuchsia-500 selection:text-white overflow-x-hidden relative">
    <!-- 背景装饰网格 -->
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none"
         style="background-image: linear-gradient(#083344 1px, transparent 1px), linear-gradient(90deg, #083344 1px, transparent 1px); background-size: 40px 40px;">
    </div>

    <div class="relative z-10 max-w-7xl mx-auto">
      <!-- 标题区域 -->
      <header class="mb-10 border-b-2 border-cyan-500 pb-4 flex justify-between items-end glitch-container">
        <div>
          <h1 class="text-5xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 relative">
            项目终端
            <span class="absolute -bottom-2 left-0 w-full h-1 bg-fuchsia-600 animate-pulse"></span>
          </h1>
          <p class="text-cyan-700 mt-2 text-sm">一站式管理你的项目信息</p>
        </div>
        <button @click="openModal('create')"
                class="cursor-pointer group relative px-6 py-2 bg-cyan-950 border border-cyan-500 text-cyan-400 uppercase tracking-wider font-bold hover:bg-cyan-500 hover:text-black transition-all duration-300 clip-path-slant">
          <span class=" absolute top-0 left-0 w-2 h-2 bg-cyan-400 transition-all duration-300 group-hover:w-full group-hover:h-full -z-10 opacity-50"></span>
          + 新建项目
        </button>
      </header>

      <!-- 数据表格 -->
      <div class="bg-slate-900/80 border border-cyan-900 p-1 backdrop-blur-sm shadow-[0_0_30px_rgba(8,145,178,0.1)]">
        <table class="w-full text-left border-collapse">
          <thead>
          <tr class="border-b border-cyan-900 bg-cyan-950/30 text-cyan-300 text-sm uppercase">
            <th class="p-4">ID</th>
            <th class="p-4">项目名称</th>
            <th class="p-4">目标ID</th>
            <th class="p-4">状态</th>
            <th class="p-4">满意度</th>
            <th class="p-4">预估时间</th>
            <th class="p-4 text-right">操作</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-cyan-900/50">
          <tr v-for="item in programs" :key="item.id" class="hover:bg-cyan-950/20 transition-colors group">
            <td class="p-4 text-fuchsia-400 font-bold">#{{ item.id }}</td>
            <td class="p-4">
              <div class="font-bold text-cyan-100">{{ item.program_name }}</div>
              <div class="text-xs text-cyan-700 truncate max-w-xs">{{ item.program_desc }}</div>
            </td>
            <td class="p-4 text-sm text-cyan-600">GOAL-{{ item.goal_id }}</td>
            <td class="p-4">
                <span :class="statusColor(item.program_status)" class="px-2 py-1 text-xs border rounded uppercase">
                  {{ getStatusText(item.program_status) }}
                </span>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <div class="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full bg-fuchsia-500" :style="{ width: (item.satisfaction_score || 0) * 10 + '%' }"></div>
                </div>
                <span class="text-xs">{{ item.satisfaction_score || 0 }}/10</span>
              </div>
            </td>
            <td class="p-4 text-xs text-cyan-600">
              <div>开始: {{ item.estimate_start_time }}</div>
              <div>结束: {{ item.estimate_finish_time }}</div>
            </td>
            <td class="p-4 text-right">
              <button @click="openModal('edit', item)" class="text-cyan-500 hover:text-white mr-4 text-sm uppercase font-bold hover:underline cursor-pointer">编辑</button>
              <button @click="deleteItem(item.id)" class="text-fuchsia-600 hover:text-fuchsia-400 text-sm uppercase font-bold hover:underline cursor-pointer">删除</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 新增/编辑模态框 -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="bg-slate-900 border-2 border-cyan-500 w-full max-w-2xl relative shadow-[0_0_50px_rgba(6,182,212,0.3)]">
        <!-- 模态框装饰角 -->
        <div class="absolute -top-[10px] -left-[10px] w-4 h-4 bg-cyan-500"></div>
        <div class="absolute -top-[10px] -right-[10px] w-4 h-4 bg-fuchsia-500"></div>
        <div class="absolute -bottom-[10px] -left-[10px] w-4 h-4 bg-fuchsia-500"></div>
        <div class="absolute -bottom-[10px] -right-[10px] w-4 h-4 bg-cyan-500"></div>

        <div class="p-6">
          <h2 class="text-2xl font-bold text-cyan-400 uppercase mb-6 border-b border-cyan-900 pb-2">
            {{ editMode ? '>> 编辑协议' : '>> 新建协议' }}
          </h2>

          <form @submit.prevent="saveItem" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 第一列 -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs uppercase text-fuchsia-400 mb-1">项目名称</label>
                <input v-model="formData.program_name" type="text" required
                       class="w-full bg-slate-950 border border-cyan-800 text-cyan-100 p-2 focus:outline-none focus:border-fuchsia-500 focus:shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all"/>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs uppercase text-fuchsia-400 mb-1">用户ID</label>
                  <input v-model="formData.user_id" type="number"
                         class="w-full bg-slate-950 border border-cyan-800 text-cyan-100 p-2 focus:outline-none focus:border-fuchsia-500"/>
                </div>
                <div>
                  <label class="block text-xs uppercase text-fuchsia-400 mb-1">目标ID</label>
                  <input v-model="formData.goal_id" type="number"
                         class="w-full bg-slate-950 border border-cyan-800 text-cyan-100 p-2 focus:outline-none focus:border-fuchsia-500"/>
                </div>
              </div>

              <div>
                <label class="block text-xs uppercase text-fuchsia-400 mb-1">状态</label>
                <select v-model="formData.program_status"
                        class="w-full bg-slate-950 border border-cyan-800 text-cyan-100 p-2 focus:outline-none focus:border-fuchsia-500">
                  <option :value="0">初始化</option>
                  <option :value="1">进行中</option>
                  <option :value="2">已完成</option>
                  <option :value="3">已终止</option>
                </select>
              </div>
            </div>

            <!-- 第二列 -->
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs uppercase text-fuchsia-400 mb-1">开始日期</label>
                  <input v-model="formData.estimate_start_time" type="date"
                         class="w-full bg-slate-950 border border-cyan-800 text-cyan-100 p-2 focus:outline-none focus:border-fuchsia-500"/>
                </div>
                <div>
                  <label class="block text-xs uppercase text-fuchsia-400 mb-1">结束日期</label>
                  <input v-model="formData.estimate_finish_time" type="date"
                         class="w-full bg-slate-950 border border-cyan-800 text-cyan-100 p-2 focus:outline-none focus:border-fuchsia-500"/>
                </div>
              </div>

              <div>
                <label class="block text-xs uppercase text-fuchsia-400 mb-1">满意度评分 (0-10)</label>
                <input v-model="formData.satisfaction_score" type="range" min="0" max="10"
                       class="w-full accent-fuchsia-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"/>
                <div class="text-right text-fuchsia-400 font-bold">{{ formData.satisfaction_score || 0 }}/10</div>
              </div>

              <div>
                <label class="block text-xs uppercase text-fuchsia-400 mb-1">附件路径</label>
                <input v-model="formData.attachment_path" type="text" placeholder="/sys/data/..."
                       class="w-full bg-slate-950 border border-cyan-800 text-cyan-100 p-2 focus:outline-none focus:border-fuchsia-500 text-sm"/>
              </div>
            </div>

            <!-- 全宽描述 -->
            <div class="md:col-span-2">
              <label class="block text-xs uppercase text-fuchsia-400 mb-1">项目描述</label>
              <textarea v-model="formData.program_desc" rows="3"
                        class="w-full bg-slate-950 border border-cyan-800 text-cyan-100 p-2 focus:outline-none focus:border-fuchsia-500 resize-none"></textarea>
            </div>

            <!-- 按钮 -->
            <div class="md:col-span-2 flex justify-end gap-4 mt-4 pt-4 border-t border-cyan-900">
              <button type="button" @click="showModal = false"
                      class="cursor-pointer px-4 py-2 text-sm text-cyan-600 hover:text-white uppercase font-bold tracking-wider">
                取消
              </button>
              <button type="submit"
                      class="cursor-pointer px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white uppercase font-bold tracking-wider shadow-[0_0_15px_rgba(192,38,211,0.6)] hover:shadow-[0_0_25px_rgba(192,38,211,0.8)] transition-all clip-path-slant">
                确认上传
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 模拟数据 - 对应数据库结构
const programs = ref([
  {
    id: 101,
    user_id: 8821,
    program_name: '神经链接协议升级',
    goal_id: 502,
    program_desc: '优化大脑皮层与外部网络的带宽连接，减少延迟。',
    program_status: 1,
    attachment_path: '/data/uploads/neuro_v2.bin',
    satisfaction_score: 8,
    estimate_finish_time: '2026-05-20',
    estimate_start_time: '2026-04-15',
    create_time: '2026-04-16 10:00:00',
    update_time: '2026-04-16 17:20:00'
  },
  {
    id: 102,
    user_id: 9932,
    program_name: '夜之城全息广告',
    goal_id: 104,
    program_desc: '为荒坂塔外部部署新型全息投影广告系统。',
    program_status: 0,
    attachment_path: '/data/ads/holo_proj_01.zip',
    satisfaction_score: 0,
    estimate_finish_time: '2026-06-01',
    estimate_start_time: '2026-05-10',
    create_time: '2026-04-10 09:30:00',
    update_time: '2026-04-10 09:30:00'
  }
]);

const showModal = ref(false);
const editMode = ref(false);

// 表单数据结构
const initialFormState = {
  id: null,
  user_id: null,
  program_name: '',
  goal_id: null,
  program_desc: '',
  program_status: 0,
  attachment_path: '',
  satisfaction_score: 0,
  estimate_finish_time: '',
  estimate_start_time: '',
};

const formData = reactive({ ...initialFormState });

// 状态文本映射
const getStatusText = (status) => {
  switch(status) {
    case 0: return '初始化';
    case 1: return '进行中';
    case 2: return '已完成';
    case 3: return '已终止';
    default: return '未知';
  }
};

// 状态颜色映射
const statusColor = (status) => {
  switch(status) {
    case 0: return 'border-gray-500 text-gray-400';
    case 1: return 'border-cyan-500 text-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.5)]';
    case 2: return 'border-emerald-500 text-emerald-400';
    case 3: return 'border-fuchsia-500 text-fuchsia-400';
    default: return '';
  }
};

// 打开模态框
const openModal = (mode, item = null) => {
  if (mode === 'edit' && item) {
    editMode.value = true;
    Object.assign(formData, item);
  } else {
    editMode.value = false;
    Object.assign(formData, initialFormState);
  }
  showModal.value = true;
};

// 保存（新增/编辑）
const saveItem = () => {
  if (editMode.value) {
    // 模拟更新
    const index = programs.value.findIndex(p => p.id === formData.id);
    if (index !== -1) {
      programs.value[index] = { ...formData };
    }
  } else {
    // 模拟新增
    const newId = Math.max(...programs.value.map(p => p.id), 100) + 1;
    programs.value.unshift({
      ...formData,
      id: newId,
      create_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
      update_time: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
  }
  showModal.value = false;
};

// 删除
const deleteItem = (id) => {
  if(confirm('确认要删除这个数据节点吗？此操作不可逆。')) {
    programs.value = programs.value.filter(p => p.id !== id);
  }
};
</script>

<style scoped>
/* 赛博朋克特定的裁剪路径 */
.clip-path-slant {
  clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
}

/* 简单的故障文字效果 */
.glitch-container:hover h1 {
  text-shadow: 2px 0 #f0f, -2px 0 #0ff;
}
</style>
