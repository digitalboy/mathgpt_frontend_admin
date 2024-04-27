// components/StudentPerformance.vue

<template>
    <el-row :gutter="20">
        <el-col :span="8" v-for="(data, subject) in performanceData" :key="subject">
            <div class="performance-card">
                <div class="performance-circle">
                    <el-progress type="circle" :percentage="data.correct_rate"
                        :status="getProgressStatus(data.correct_rate)" />
                </div>
                <el-statistic :title="subject" :value="data.correct_rate" suffix="% 正确率">
                    <template #title>
                        <div style="display: inline-flex; align-items: center">
                            {{ subject }}
                        </div>
                    </template>
                </el-statistic>
                <div class="performance-footer">
                    <div>回答问题: {{ data.answered_questions }} / {{ data.total_questions }}</div>
                    <div>回答率: {{ data.answer_rate }}</div>
                </div>
            </div>
        </el-col>
    </el-row>
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
        const studentId = authStore.user?.id;

        onMounted(() => {
            if (studentId) {
                studentStore.fetchStudentPerformance(studentId);
            }
        });

        const performanceData = computed(() => {
            return studentStore.studentPerformance;
        });

        function getProgressStatus(percentage: string): string {
            const numPercentage = parseFloat(percentage);
            if (numPercentage < 40) return 'exception';
            if (numPercentage < 70) return 'warning';
            return 'success';
        }

        return {
            performanceData,
            getProgressStatus,
        };
    }
});
</script>

<style scoped>
.performance-card {
    text-align: center;
    padding: 20px;
    border-radius: 4px;
    background-color: #f7f7f8;
    transition: box-shadow 0.3s;
}

.performance-card:hover {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
}

.performance-circle {
    margin-bottom: 20px;
}

.performance-footer {
    font-size: 0.9em;
    color: #666;
}
</style>