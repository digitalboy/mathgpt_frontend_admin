<!-- src\App.vue -->
<template>
  <el-row>
    <el-col :span="24">
      <!-- 动态渲染不同的头部组件 -->
      <component :is="headerComponent" />
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <!-- 只在 hideMenu 不为 true 时显示侧边菜单 -->
    <el-col :span="4" class="hidden-md-and-down" v-if="!$route.meta.hideMenu">
      <SideMenu />
    </el-col>
    <!-- 调整 span 根据是否显示侧边菜单 -->
    <el-col :span="$route.meta.hideMenu ? 24 : 20" class="hidden-md-and-down">
      <router-view v-if="!$route.meta.hideMenu" />
    </el-col>
    <el-col :span="24" class="hidden-lg-and-up">
      <router-view v-if="$route.meta.hideMenu" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import 'element-plus/theme-chalk/display.css';
import AppHeaderStudent from '@/components/AppHeaderStudent.vue';
import AppHeaderAdmin from '@/components/AppHeaderAdmin.vue';
import AppHeaderGuest from '@/components/AppHeaderGuest.vue'; // 导入访客头部组件
import SideMenu from '@/components/SideMenu.vue';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'App',
  components: {
    SideMenu
  },
  setup() {
    const authStore = useAuthStore();
    // 根据角色计算要使用的头部组件
    const headerComponent = computed(() => {
      if (!authStore.user?.isLoggedIn) {
        return AppHeaderGuest; // 未登录时显示访客头部组件
      } else if (authStore.user?.role === 'admin') {
        return AppHeaderAdmin;
      } else {
        return AppHeaderStudent;
      }
    });

    return {
      headerComponent
    };
  }
};
</script>

<style>
/* 你的全局样式 */
h1,
h2 {
  color: #525457;
}
</style>
