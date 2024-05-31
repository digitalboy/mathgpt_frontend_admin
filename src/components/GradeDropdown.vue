<!-- src\components\GradeDropdown.vue -->
<template>
  <div>
    <el-select v-model="selectedGradeIds" placeholder="请选择年级" multiple collapse-tags @change="handleGradeChange">
      <el-option v-for="grade in grades" :key="grade.id" :label="grade.name" :value="grade.id"></el-option>
    </el-select>
    <div v-if="isLoading"><el-text class="mx-1" type="warning">正在加载数据...</el-text></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useGradeStore } from '@/stores/gradeStore';

const gradeStore = useGradeStore();
const selectedGradeIds = ref<number[]>([]);
const isLoading = ref(true);

const grades = computed(() => gradeStore.grades);

watch(grades, () => {
  isLoading.value = false; // 数据加载完成后更新加载状态
});

watch(selectedGradeIds, (newIds) => {
  console.log(`Selected Grade IDs: ${newIds}`);
  // 更新本地存储中的选中年级 ID 数组
  localStorage.setItem('selectedGradeIds', JSON.stringify(newIds));
});

const handleGradeChange = (newGradeIds: number[]) => {
  console.log(`Selected Grade IDs: ${newGradeIds}`);
  selectedGradeIds.value = newGradeIds;

  // 根据选中的年级 ID 更新当前选中年级的名称列表
  gradeStore.setCurrentGradeNames(newGradeIds.map(id => {
    const grade = grades.value.find(grade => grade.id === id);
    return grade ? grade.name : '';
  }));
};

onMounted(async () => {
  await gradeStore.fetchGrades();
  // 从本地存储中获取已选年级 ID 数组
  const storedGradeIds = localStorage.getItem('selectedGradeIds');
  if (storedGradeIds) {
    const gradeIds = JSON.parse(storedGradeIds) as number[];
    selectedGradeIds.value = gradeIds;
    // 初始化当前选中年级的名称列表
    gradeStore.setCurrentGradeNames(gradeIds.map(id => {
      const grade = grades.value.find(grade => grade.id === id);
      return grade ? grade.name : '';
    }));
  }
});
</script>
