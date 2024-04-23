<!-- src/App.vue -->
<template>
  <div class="layout-container-demo" style="height: 1000px">
    <el-container>
      <el-header>
        <div>Header - Logo and Navigation</div>
      </el-header>

      <el-container>
        <!-- 侧边栏仅在桌面显示 -->
        <el-aside v-if="isDesktop" width="200px">Sidebar - Navigation</el-aside>
        <el-main>
          <router-view /> <!-- 主要内容区域，显示路由视图 -->
        </el-main>
      </el-container>


    </el-container>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue';
import useMediaQuery from '@/composables/useMediaQuery'; // 假设你有这个自定义的响应式hooks

export default {
  name: 'App',
  setup() {
    const isDesktop = computed(() => useMediaQuery('(min-width: 992px)'));
    return { isDesktop };
  }
};
</script>

<style>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
.el-header,
.el-footer {
  color: white;
  background-color: #324157;
}

.el-aside {
  background-color: #1f2d3d;
  color: white;
  text-align: center;
}

/* 媒体查询，对小屏幕进行样式调整 */
@media (max-width: 991px) {

  .el-header,
  .el-footer {
    text-align: center;
  }
}
</style>
