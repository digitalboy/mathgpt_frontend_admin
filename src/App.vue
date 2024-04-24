<!-- src\App.vue -->
<template>
  <el-row :gutter="20">
    <!-- 只在 hideMenu 不为 true 时显示侧边菜单 -->
    <el-col :span="4" class="hidden-md-and-down" v-if="!$route.meta.hideMenu">
      <SideMenu />
    </el-col>
    <!-- 调整 span 根据是否显示侧边菜单 -->
    <el-col :span="$route.meta.hideMenu ? 24 : 20" class="hidden-md-and-down">
      <router-view />
    </el-col>
    <el-col :span="24" class="hidden-md-and-up">
      <router-view />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import 'element-plus/theme-chalk/display.css'
import SideMenu from '@/components/SideMenu.vue';

export default {
  name: 'App',
  components: {
    SideMenu
  }
};
</script>

<style>
/* 你的全局样式 */
h1 {
  color: #525457;
}
</style>
