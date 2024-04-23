<!-- src\components\SubjectList.vue  -->
<template>
    <el-table :data="subjects" style="width: 100%">
        <el-table-column prop="id" label="科目ID"></el-table-column>
        <el-table-column prop="name" label="科目名称"></el-table-column>
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="primary" :icon="Edit" circle @click="editSubject(row)" />
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useSubjectStore } from '@/stores/subjectStore'; // 确保已经在 stores 中定义了 subjectStore
import { Subject } from '@/services/subjectService';
import { Edit } from '@element-plus/icons-vue';

const subjectStore = useSubjectStore();
const subjects = computed(() => subjectStore.subjects);

const editSubject = (subject: Subject) => {
    subjectStore.setCurrentSubject(subject);
};

onMounted(() => {
    if (subjects.value.length === 0) {
        subjectStore.fetchSubjects().catch(error => {
            ElMessage.error('加载科目数据失败: ' + error.message);
        });
    }
});
</script>

<style scoped></style>
