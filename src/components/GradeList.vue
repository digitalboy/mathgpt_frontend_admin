<!-- // components/GradeList.vue -->
<template>
  <el-table :data="grades" style="width: 100%">
    <el-table-column prop="name" label="年级名称"></el-table-column>
    <el-table-column prop="description" label="描述"></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="primary" :icon="Edit" circle @click="editGrade(row)" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { GradeService } from '@/services/gradeService'; // 确保有对应的年级服务
import { useGradeStore } from '@/stores/gradeStore'; // 年级状态管理，如需创建
import { Grade } from '@/services/gradeService'; // 年级数据类型定义
import { Edit } from '@element-plus/icons-vue';

const gradeStore = useGradeStore(); // 使用年级的状态存储
const grades = ref<Grade[]>([]);

const fetchGrades = async () => {
  try {
    const data = await GradeService.getGrades();
    if (data) {
      grades.value = data;
    } else {
      throw new Error('未能获取年级数据');
    }
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error('加载年级数据失败: ' + error.message);
    } else {
      ElMessage.error('发生未知错误');
    }
  }
};

const editGrade = (grade: Grade) => { 
  gradeStore.setCurrentGrade(grade); 
  // 路由到编辑页面或打开模态框进行编辑
};

onMounted(() => {
  fetchGrades();
});
</script>

<style scoped>
/* 添加所需的CSS样式 */
</style>
