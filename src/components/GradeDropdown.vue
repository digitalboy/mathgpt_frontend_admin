<!-- src\components\GradeDropdown.vue -->
<template>
  <div>
    <el-select v-if="grades.length > 0" v-model="selectedGradeId" placeholder="请选择年级" @change="handleGradeChange">
      <el-option v-for="grade in grades" :key="grade.id" :label="grade.name" :value="grade.id"></el-option>
    </el-select>
    <div v-else><el-text class="mx-1" type="warning">正在加载数据...</el-text></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useGradeStore } from '@/stores/gradeStore';
// import { ElMessage } from 'element-plus';

const gradeStore = useGradeStore();
const selectedGradeId = ref<number | null>(null);

// 使用计算属性确保响应式更新
const grades = computed(() => gradeStore.grades);

// 当选中的年级 ID 变化时，更新当前年级状态
watch(selectedGradeId, (newId) => {
  if (newId !== null) {
    const grade = grades.value.find(g => g.id === newId) || null;
    gradeStore.setCurrentGrade(grade);
  } else {
    gradeStore.setCurrentGrade(null);
  }
});

const handleGradeChange = (newGradeId: number | null) => {
  console.log(`Selected Grade ID: ${newGradeId}`);
};

onMounted(async () => {
  await gradeStore.fetchGrades();
  // 检查本地存储是否有保存的年级ID
  const storedGradeId = localStorage.getItem('currentGradeId');
  if (storedGradeId) {
    const gradeId = parseInt(storedGradeId, 10);
    selectedGradeId.value = gradeId;
  } else if (grades.value.length > 0) {
    // 如果本地没有存储，选择列表中的第一个年级
    selectedGradeId.value = grades.value[0].id as number;
  }
});

</script>

<style scoped>
/* 添加适当的样式 */
</style>
