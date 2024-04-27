<!-- components/StudentPerformance.vue -->

<template>
    <div v-if="studentId">
        <el-table :data="performanceData" style="width: 100%">
            <el-table-column prop="subject" label="科目" width="180"></el-table-column>
            <el-table-column prop="answered_questions" label="回答问题数"></el-table-column>
            <el-table-column prop="total_questions" label="总问题数"></el-table-column>
            <el-table-column prop="answer_rate" label="回答率"></el-table-column>
            <el-table-column prop="correct_answers" label="正确答案数"></el-table-column>
            <el-table-column prop="correct_rate" label="正确率"></el-table-column>
        </el-table>
    </div>
    <div v-else>
        没有找到学生信息。
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStudentStore } from '@/stores/studentStore';
import { useAuthStore } from '@/stores/authStore';

export default defineComponent({
    name: 'StudentPerformance',
    setup() {
        const studentStore = useStudentStore();
        const authStore = useAuthStore();
        const studentId = authStore.user?.id; // Assuming the 'id' refers to the student's ID

        // Computed property to transform the performance object to a format suitable for the table
        const performanceData = computed(() => {
            const performance = studentStore.studentPerformance;
            return Object.keys(performance).map(subject => ({
                subject: subject,
                ...performance[subject]
            }));
        });

        onMounted(() => {
            if (studentId) {
                studentStore.fetchStudentPerformance(studentId);
            }
        });

        return {
            studentId,
            performanceData,
        };
    }
});
</script>