<template>
  <div class="cyber-section">
    <!-- 标题区域 -->
    <div class="cyber-header">
      <div class="cyber-corner top-right"></div>
      <div class="cyber-corner bottom-left"></div>
    </div>

    <!-- 滚动视窗 -->
    <div
      class="scroll-viewport relative w-full overflow-hidden py-6"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
    >
      <!-- 遮罩层：左右渐变，增加纵深感 -->
      <div
        class="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
      <div
        class="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

      <!-- 滚动轨道 -->
      <div
        ref="trackRef"
        class="scroll-track flex gap-6 w-max cursor-pointer"
        :class="{ 'animate-scroll': !isPaused }"
        :style="trackStyle"

      >
        <!-- 原始列表 -->
        <div
          v-for="(item, index) in images"
          :key="index"
          class="cyber-card group relative flex-shrink-0 w-64 h-40 overflow-hidden border border-slate-700 bg-slate-800/50 cursor-pointer"
          @click="goToDetail(item)"
        >
          <!-- 图片 -->
          <img
            :src="item.imageUrl"
            :alt="item.createTimeStr"
            class="w-full h-full max-h-60 object-cover  transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
          />

          <!-- 悬停覆盖层 -->
          <div
            class="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>

          <!-- 文字信息 -->
          <div
            class="absolute bottom-0 left-0 w-full p-3 bg-slate-900/80 border-t border-cyan-500/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联项目ID: {{ item.programId }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联目标ID:{{ item.goalId }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联待办ID:{{ item.todoId }}</p>
          </div>

          <!-- 装饰性角标 -->
          <div class="absolute top-2 right-2 w-2 h-2 bg-fuchsia-500"></div>
        </div>

        <!-- 重复列表 (用于无缝循环) -->
        <div
          v-if="images.length<24"
          v-for="(item, index) in backupImages"
          :key="`dup-${index}`"
          class="cyber-card group relative flex-shrink-0 w-64 h-40 overflow-hidden border border-slate-700 bg-slate-800/50"
        >
          <img
            :src="item.imageUrl"
            :alt="item.createTimeStr"
            class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
          />
          <div
            class="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
          <div
            class="absolute bottom-0 left-0 w-full p-3 bg-slate-900/80 border-t border-cyan-500/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联项目ID: {{ item.programId }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联目标ID:{{ item.goalId }}</p>
            <p class="text-fuchsia-400 text-sm font-bold font-mono">关联待办ID:{{ item.todoId }}</p>
          </div>
          <div class="absolute top-2 right-2 w-2 h-2 bg-fuchsia-500"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import router from '@/router/index.js'

// 状态控制
const isPaused = ref(false)
const props = defineProps({
  images: {
    type: Array,
    default: () => [
      {
        'id': 1,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2005-09-03T11:07:00',
        'createTimeStr': '2005-09-03 11:07:00',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 2,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2018-12-12T05:22:55',
        'createTimeStr': '2018-12-12 05:22:55',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 3,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2015-07-25T08:41:13',
        'createTimeStr': '2015-07-25 08:41:13',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 4,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2019-04-19T17:59:43',
        'createTimeStr': '2019-04-19 17:59:43',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 5,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2005-02-24T06:12:19',
        'createTimeStr': '2005-02-24 06:12:19',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 6,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2024-07-06T07:35:55',
        'createTimeStr': '2024-07-06 07:35:55',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 7,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2015-02-28T22:59:49',
        'createTimeStr': '2015-02-28 22:59:49',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 8,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2008-04-30T10:37:28',
        'createTimeStr': '2008-04-30 10:37:28',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 9,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2024-03-08T10:43:47',
        'createTimeStr': '2024-03-08 10:43:47',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 10,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2005-08-31T23:23:59',
        'createTimeStr': '2005-08-31 23:23:59',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 11,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2013-08-06T15:33:14',
        'createTimeStr': '2013-08-06 15:33:14',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 12,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2007-03-13T08:55:22',
        'createTimeStr': '2007-03-13 08:55:22',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 13,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2026-01-04T10:34:48',
        'createTimeStr': '2026-01-04 10:34:48',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 14,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2001-12-23T19:15:54',
        'createTimeStr': '2001-12-23 19:15:54',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 15,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2014-09-03T19:39:48',
        'createTimeStr': '2014-09-03 19:39:48',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 16,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2009-05-24T11:00:22',
        'createTimeStr': '2009-05-24 11:00:22',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 17,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2006-07-15T12:07:18',
        'createTimeStr': '2006-07-15 12:07:18',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 18,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2005-05-12T15:34:44',
        'createTimeStr': '2005-05-12 15:34:44',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 19,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2016-02-20T14:11:52',
        'createTimeStr': '2016-02-20 14:11:52',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 20,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2000-05-30T08:08:55',
        'createTimeStr': '2000-05-30 08:08:55',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 228,
        'userId': 352,
        'todoLogId': 637,
        'todoId': 570,
        'programId': 1,
        'goalId': 320,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2001-12-06T14:19:31',
        'createTimeStr': '2001-12-06 14:19:31',
        'user': {
          'id': 352,
          'username': 'Murata Kenta',
          'birthday': '2004-08-16',
          'email': 'murataken725@gmail.com',
          'gender': 955,
          'avatar': '60HvqHrJVh',
          'role': 620,
          'status': 48,
          'statusDesc': 'Navicat authorizes you to make connection to remote servers running on different platforms (i.e. Windows, macOS, Linux and UNIX), and supports PAM and GSSAPI authentication. Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure. The first step is as good as half over. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. SSH serves to prevent such vulnerabilities and allows you to access a remote server\'s shell without compromising security. Navicat Cloud could not connect and access your databases. By which it means, it could only store your connection settings, queries, model files, and virtual group; your database passwords and data (e.g. tables, views, etc) will not be stored to Navicat Cloud. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. If you wait, all that happens is you get older. To connect to a database or schema, simply double-click it in the pane. Creativity is intelligence having fun. Difficult circumstances serve as a textbook of life for people. How we spend our days is, of course, how we spend our lives. Flexible settings enable you to set up a custom key for comparison and synchronization. Navicat authorizes you to make connection to remote servers running on different platforms (i.e. Windows, macOS, Linux and UNIX), and supports PAM and GSSAPI authentication. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. Difficult circumstances serve as a textbook of life for people. How we spend our days is, of course, how we spend our lives. If you wait, all that happens is you get older. The past has no power over the present moment. HTTP Tunneling is a method for connecting to a server that uses the same protocol (http://) and the same port (port 80) as a web server does. It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. What you get by achieving your goals is not as important as what you become by achieving your goals. Anyone who has ever made anything of importance was disciplined. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. Remember that failure is an event, not a person. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login information in the General tab. There is no way to happiness. Happiness is the way. To clear or reload various internal caches, flush tables, or acquire locks, control-click your connection in the Navigation pane and select Flush and choose the flush option. You must have the reload privilege to use this feature. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Remember that failure is an event, not a person. If opportunity doesn’t knock, build a door. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences. Champions keep playing until they get it right. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview. I destroy my enemies when I make them my friends. You will succeed because most people are lazy. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview. In the middle of winter I at last discovered that there was in me an invincible summer. After logged in the Navicat Cloud feature, the Navigation pane will be divided into Navicat Cloud and My Connections sections. If you wait, all that happens is you get older. Navicat is a multi-connections Database Administration tool allowing you to connect to MySQL, Oracle, PostgreSQL, SQLite, SQL Server, MariaDB and/or MongoDB databases, making database administration to multiple kinds of database so easy. Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. In a Telnet session, all communications, including username and password, are transmitted in plain-text, allowing anyone to listen-in on your session and steal passwords and other information. The past has no power over the present moment. All the Navicat Cloud objects are located under different projects. You can share the project to other Navicat Cloud accounts for collaboration. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Navicat Data Modeler enables you to build high-quality conceptual, logical and physical data models for a wide variety of audiences. Such sessions are also susceptible to session hijacking, where a malicious user takes over your session once you have authenticated. You cannot save people, you can just love them. Genius is an infinite capacity for taking pains. The past has no power over the present moment. You can select any connections, objects or projects, and then select the corresponding buttons on the Information Pane. You can select any connections, objects or projects, and then select the corresponding buttons on the Information Pane. What you get by achieving your goals is not as important as what you become by achieving your goals. You will succeed because most people are lazy. The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server, or Amazon RDS instance. After logged in the Navicat Cloud feature, the Navigation pane will be divided into Navicat Cloud and My Connections sections. If it scares you, it might be a good thing to try. If opportunity doesn’t knock, build a door. Navicat Monitor can be installed on any local computer or virtual machine and does not require any software installation on the servers being monitored. It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. A query is used to extract data from the database in a readable format according to the user\'s request. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Optimism is the one quality more associated with success and happiness than any other. In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram buttons to change the object view. The reason why a great man is great is that he resolves to be a great man. If opportunity doesn’t knock, build a door. A man is not old until regrets take the place of dreams. To clear or reload various internal caches, flush tables, or acquire locks, control-click your connection in the Navigation pane and select Flush and choose the flush option. You must have the reload privilege to use this feature. It is used while your ISPs do not allow direct connections, but allows establishing HTTP connections. Remember that failure is an event, not a person. There is no way to happiness. Happiness is the way. Navicat authorizes you to make connection to remote servers running on different platforms (i.e. Windows, macOS, Linux and UNIX), and supports PAM and GSSAPI authentication. Navicat Monitor requires a repository to store alerts and metrics for historical analysis. Secure Sockets Layer(SSL) is a protocol for transmitting private documents via the Internet. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences. The Main Window consists of several toolbars and panes for you to work on connections, database objects and advanced tools. Navicat Monitor is a safe, simple and agentless remote server monitoring tool that is packed with powerful features to make your monitoring effective as possible. Genius is an infinite capacity for taking pains. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences.',
          'signature': 'It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. If the plan doesn’t work, change the plan, but never the goal. The past has no power over the present moment. Success consists of going from failure to failure without loss of enthusiasm. The reason why a great man is great is that he resolves to be a great man. Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. Navicat 15 has added support for the system-wide dark mode. I will greet this day with love in my heart. Such sessions are also susceptible to session hijacking, where a malicious user takes over your session once you have authenticated. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login information in the General tab. Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. The reason why a great man is great is that he resolves to be a great man. Navicat 15 has added support for the system-wide dark mode. If the plan doesn’t work, change the plan, but never the goal. You cannot save people, you can just love them. You must be the change you wish to see in the world. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. I will greet this day with love in my heart. You can select any connections, objects or projects, and then select the corresponding buttons on the Information Pane. I destroy my enemies when I make them my friends. The Navigation pane employs tree structure which allows you to take action upon the database and their objects through their pop-up menus quickly and easily. Sometimes you win, sometimes you learn. All journeys have secret destinations of which the traveler is unaware. A comfort zone is a beautiful place, but nothing ever grows there. Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure. To connect to a database or schema, simply double-click it in the pane. All journeys have secret destinations of which the traveler is unaware. Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. A man’s best friends are his ten fingers. It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. Flexible settings enable you to set up a custom key for comparison and synchronization. In the middle of winter I at last discovered that there was in me an invincible summer. Creativity is intelligence having fun. I will greet this day with love in my heart. If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences. Navicat Monitor requires a repository to store alerts and metrics for historical analysis. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. If the plan doesn’t work, change the plan, but never the goal. Remember that failure is an event, not a person. Success consists of going from failure to failure without loss of enthusiasm. If your Internet Service Provider (ISP) does not provide direct access to its server, Secure Tunneling Protocol (SSH) / HTTP is another solution. Navicat Cloud provides a cloud service for synchronizing connections, queries, model files and virtual group information from Navicat, other Navicat family members, different machines and different platforms. The past has no power over the present moment. You cannot save people, you can just love them.',
          'occupation': 'mlA8DZTgW0',
          'industry': 'Electronics industry',
          'city': 'Chicago',
          'createTime': '2022-06-07T09:15:42',
          'updateTime': '2025-11-26T23:01:29'
        }
      }
    ]
  },
  backupImages: {
    type: Array,
    default: () => [
      {
        'id': 1,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2005-09-03T11:07:00',
        'createTimeStr': '2005-09-03 11:07:00',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 2,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2018-12-12T05:22:55',
        'createTimeStr': '2018-12-12 05:22:55',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 3,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2015-07-25T08:41:13',
        'createTimeStr': '2015-07-25 08:41:13',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 4,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2019-04-19T17:59:43',
        'createTimeStr': '2019-04-19 17:59:43',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 5,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2005-02-24T06:12:19',
        'createTimeStr': '2005-02-24 06:12:19',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 6,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2024-07-06T07:35:55',
        'createTimeStr': '2024-07-06 07:35:55',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 7,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2015-02-28T22:59:49',
        'createTimeStr': '2015-02-28 22:59:49',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 8,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2008-04-30T10:37:28',
        'createTimeStr': '2008-04-30 10:37:28',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 9,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2024-03-08T10:43:47',
        'createTimeStr': '2024-03-08 10:43:47',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 10,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2005-08-31T23:23:59',
        'createTimeStr': '2005-08-31 23:23:59',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 11,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2013-08-06T15:33:14',
        'createTimeStr': '2013-08-06 15:33:14',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 12,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2007-03-13T08:55:22',
        'createTimeStr': '2007-03-13 08:55:22',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 13,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2026-01-04T10:34:48',
        'createTimeStr': '2026-01-04 10:34:48',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 14,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2001-12-23T19:15:54',
        'createTimeStr': '2001-12-23 19:15:54',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 15,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2014-09-03T19:39:48',
        'createTimeStr': '2014-09-03 19:39:48',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 16,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2009-05-24T11:00:22',
        'createTimeStr': '2009-05-24 11:00:22',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 17,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2006-07-15T12:07:18',
        'createTimeStr': '2006-07-15 12:07:18',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 18,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2005-05-12T15:34:44',
        'createTimeStr': '2005-05-12 15:34:44',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 19,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2016-02-20T14:11:52',
        'createTimeStr': '2016-02-20 14:11:52',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 20,
        'userId': 1001,
        'todoLogId': 1,
        'todoId': 1,
        'programId': 1,
        'goalId': 600,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2000-05-30T08:08:55',
        'createTimeStr': '2000-05-30 08:08:55',
        'user': {
          'id': 1001,
          'username': '123456',
          'birthday': null,
          'email': '859707243@qq.com',
          'gender': 0,
          'avatar': null,
          'role': 0,
          'status': 0,
          'statusDesc': null,
          'signature': null,
          'occupation': null,
          'industry': null,
          'city': null,
          'createTime': '2026-04-17T08:09:47',
          'updateTime': '2026-04-17T08:09:47'
        }
      },
      {
        'id': 228,
        'userId': 352,
        'todoLogId': 637,
        'todoId': 570,
        'programId': 1,
        'goalId': 320,
        'imageUrl': 'https://placehold.co/1920x1080/1e1b4b/06b6d4?text=test',
        'createTime': '2001-12-06T14:19:31',
        'createTimeStr': '2001-12-06 14:19:31',
        'user': {
          'id': 352,
          'username': 'Murata Kenta',
          'birthday': '2004-08-16',
          'email': 'murataken725@gmail.com',
          'gender': 955,
          'avatar': '60HvqHrJVh',
          'role': 620,
          'status': 48,
          'statusDesc': 'Navicat authorizes you to make connection to remote servers running on different platforms (i.e. Windows, macOS, Linux and UNIX), and supports PAM and GSSAPI authentication. Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure. The first step is as good as half over. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. SSH serves to prevent such vulnerabilities and allows you to access a remote server\'s shell without compromising security. Navicat Cloud could not connect and access your databases. By which it means, it could only store your connection settings, queries, model files, and virtual group; your database passwords and data (e.g. tables, views, etc) will not be stored to Navicat Cloud. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. If you wait, all that happens is you get older. To connect to a database or schema, simply double-click it in the pane. Creativity is intelligence having fun. Difficult circumstances serve as a textbook of life for people. How we spend our days is, of course, how we spend our lives. Flexible settings enable you to set up a custom key for comparison and synchronization. Navicat authorizes you to make connection to remote servers running on different platforms (i.e. Windows, macOS, Linux and UNIX), and supports PAM and GSSAPI authentication. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. Difficult circumstances serve as a textbook of life for people. How we spend our days is, of course, how we spend our lives. If you wait, all that happens is you get older. The past has no power over the present moment. HTTP Tunneling is a method for connecting to a server that uses the same protocol (http://) and the same port (port 80) as a web server does. It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. What you get by achieving your goals is not as important as what you become by achieving your goals. Anyone who has ever made anything of importance was disciplined. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. Remember that failure is an event, not a person. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login information in the General tab. There is no way to happiness. Happiness is the way. To clear or reload various internal caches, flush tables, or acquire locks, control-click your connection in the Navigation pane and select Flush and choose the flush option. You must have the reload privilege to use this feature. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Remember that failure is an event, not a person. If opportunity doesn’t knock, build a door. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences. Champions keep playing until they get it right. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview. I destroy my enemies when I make them my friends. You will succeed because most people are lazy. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview. In the middle of winter I at last discovered that there was in me an invincible summer. After logged in the Navicat Cloud feature, the Navigation pane will be divided into Navicat Cloud and My Connections sections. If you wait, all that happens is you get older. Navicat is a multi-connections Database Administration tool allowing you to connect to MySQL, Oracle, PostgreSQL, SQLite, SQL Server, MariaDB and/or MongoDB databases, making database administration to multiple kinds of database so easy. Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. In a Telnet session, all communications, including username and password, are transmitted in plain-text, allowing anyone to listen-in on your session and steal passwords and other information. The past has no power over the present moment. All the Navicat Cloud objects are located under different projects. You can share the project to other Navicat Cloud accounts for collaboration. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Navicat Data Modeler enables you to build high-quality conceptual, logical and physical data models for a wide variety of audiences. Such sessions are also susceptible to session hijacking, where a malicious user takes over your session once you have authenticated. You cannot save people, you can just love them. Genius is an infinite capacity for taking pains. The past has no power over the present moment. You can select any connections, objects or projects, and then select the corresponding buttons on the Information Pane. You can select any connections, objects or projects, and then select the corresponding buttons on the Information Pane. What you get by achieving your goals is not as important as what you become by achieving your goals. You will succeed because most people are lazy. The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server, or Amazon RDS instance. After logged in the Navicat Cloud feature, the Navigation pane will be divided into Navicat Cloud and My Connections sections. If it scares you, it might be a good thing to try. If opportunity doesn’t knock, build a door. Navicat Monitor can be installed on any local computer or virtual machine and does not require any software installation on the servers being monitored. It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. A query is used to extract data from the database in a readable format according to the user\'s request. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Optimism is the one quality more associated with success and happiness than any other. In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram buttons to change the object view. The reason why a great man is great is that he resolves to be a great man. If opportunity doesn’t knock, build a door. A man is not old until regrets take the place of dreams. To clear or reload various internal caches, flush tables, or acquire locks, control-click your connection in the Navigation pane and select Flush and choose the flush option. You must have the reload privilege to use this feature. It is used while your ISPs do not allow direct connections, but allows establishing HTTP connections. Remember that failure is an event, not a person. There is no way to happiness. Happiness is the way. Navicat authorizes you to make connection to remote servers running on different platforms (i.e. Windows, macOS, Linux and UNIX), and supports PAM and GSSAPI authentication. Navicat Monitor requires a repository to store alerts and metrics for historical analysis. Secure Sockets Layer(SSL) is a protocol for transmitting private documents via the Internet. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences. The Main Window consists of several toolbars and panes for you to work on connections, database objects and advanced tools. Navicat Monitor is a safe, simple and agentless remote server monitoring tool that is packed with powerful features to make your monitoring effective as possible. Genius is an infinite capacity for taking pains. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences.',
          'signature': 'It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. If the plan doesn’t work, change the plan, but never the goal. The past has no power over the present moment. Success consists of going from failure to failure without loss of enthusiasm. The reason why a great man is great is that he resolves to be a great man. Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. Navicat 15 has added support for the system-wide dark mode. I will greet this day with love in my heart. Such sessions are also susceptible to session hijacking, where a malicious user takes over your session once you have authenticated. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login information in the General tab. Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. The reason why a great man is great is that he resolves to be a great man. Navicat 15 has added support for the system-wide dark mode. If the plan doesn’t work, change the plan, but never the goal. You cannot save people, you can just love them. You must be the change you wish to see in the world. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. I will greet this day with love in my heart. You can select any connections, objects or projects, and then select the corresponding buttons on the Information Pane. I destroy my enemies when I make them my friends. The Navigation pane employs tree structure which allows you to take action upon the database and their objects through their pop-up menus quickly and easily. Sometimes you win, sometimes you learn. All journeys have secret destinations of which the traveler is unaware. A comfort zone is a beautiful place, but nothing ever grows there. Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure. To connect to a database or schema, simply double-click it in the pane. All journeys have secret destinations of which the traveler is unaware. Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. A man’s best friends are his ten fingers. It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. Flexible settings enable you to set up a custom key for comparison and synchronization. In the middle of winter I at last discovered that there was in me an invincible summer. Creativity is intelligence having fun. I will greet this day with love in my heart. If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences. Navicat Monitor requires a repository to store alerts and metrics for historical analysis. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. If the plan doesn’t work, change the plan, but never the goal. Remember that failure is an event, not a person. Success consists of going from failure to failure without loss of enthusiasm. If your Internet Service Provider (ISP) does not provide direct access to its server, Secure Tunneling Protocol (SSH) / HTTP is another solution. Navicat Cloud provides a cloud service for synchronizing connections, queries, model files and virtual group information from Navicat, other Navicat family members, different machines and different platforms. The past has no power over the present moment. You cannot save people, you can just love them.',
          'occupation': 'mlA8DZTgW0',
          'industry': 'Electronics industry',
          'city': 'Chicago',
          'createTime': '2022-06-07T09:15:42',
          'updateTime': '2025-11-26T23:01:29'
        }
      }
    ]
  },
  type: {
    type: String,
    default: () => 'program'
  }
})

// 动画滚动效果计算
const trackRef = ref(null)

// 配置：每张卡片显示时长（毫秒）
const CARD_DURATION = 1000
// 配置：卡片宽度 (对应 w-64 = 16rem = 256px)
const CARD_WIDTH = 256
// 配置：卡片间距 (对应 gap-6 = 1.5rem = 24px)
const GAP_WIDTH = 24

// 改动点 2: 计算总宽度和动画时长
const trackStyle = computed(() => {
  const count = props.images.length

  // 1. 计算单组列表的总宽度 (宽 + 间距) * 数量
  // 注意：最后一个元素通常不需要间距，但为了计算方便和视觉缓冲，这里简单相加
  const totalWidth = count * (CARD_WIDTH + GAP_WIDTH)

  // 2. 计算动画总时长
  const duration = count * (CARD_DURATION / 1000) // 转换为秒

  return {
    '--scroll-distance': `-${totalWidth}px`, // 移动的距离
    '--scroll-duration': `${duration}s`      // 动画的时间
  }
})


// 点击图片跳转详情界面
const goToDetail = async (imageItem) => {
  // 根据类型不同跳转到不同详情页
  if (props.type === 'program') {
    router.push({
      name: 'ProgramDetail',
      params: { id: imageItem.programId }
    })
  }
}
</script>

<style scoped>
/* 赛博朋克字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

.font-mono {
  font-family: 'Orbitron', sans-serif;
}

/* 核心滚动动画 */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    /* 移动 50% 是因为我们复制了一份列表，移动到一半时重置即可实现无缝 */
    transform: translateX(var(--scroll-distance));
  }
}

.animate-scroll {
  animation: scroll 180s linear infinite;
  /* 添加 will-change 优化性能 */
  will-change: transform;
}

/* 装饰性边框角标 */
.cyber-header {
  position: relative;
  margin-bottom: 5px;
  padding-left: 20px;
}

.cyber-title {
  font-size: 1.5rem;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
}

.cyber-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid #f0abfc; /* fuchsia-400 */
  box-shadow: 0 0 8px #f0abfc;
  transition: all 0.3s ease;
}

.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

/* 卡片悬停效果增强 */
.cyber-card {
  box-shadow: 4px 4px 0px rgba(6, 182, 212, 0.2);
  transition: all 0.3s ease;
}

.cyber-card:hover {
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
  border-color: #22d3ee;
  z-index: 10;
}
</style>
