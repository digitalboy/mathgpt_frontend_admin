// components/StudentPerformance.vue

<template>
    <el-row :gutter="20">
        <el-col :span="8" v-for="(data, subject) in performanceData" :key="subject">
            <el-card>
                <template #header>
                    <span>
                        <h2>{{ subject }}</h2>
                    </span>
                </template>
                <div class="performance-card">
                    <el-row :gutter="10">

                        <el-col :span="8">
                            <div class="performance-circle">
                                <el-progress type="circle" :percentage="data.correct_rate" />
                            </div>
                            <el-statistic :title="subject" value="正确率">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center">
                                        {{ data.correct_answers }}/{{ data.answered_questions }}
                                    </div>
                                </template>
                            </el-statistic>
                        </el-col>

                        <el-col :span="8">
                            <div class="performance-circle">
                                <el-progress type="circle" :percentage="data.answer_rate" />
                            </div>

                            <el-statistic :title="subject" value="作答率">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center">
                                        {{ data.answered_questions }}/{{ data.total_questions }}
                                    </div>
                                </template>
                            </el-statistic>
                        </el-col>

                        <el-col :span="8">
                            <div class="performance-circle">
                                <el-progress type="circle" :percentage="data.knowledge_point_reach_rate" />
                            </div>
                            <el-statistic :title="subject" value="知识触达">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center">
                                        {{ data.reached_knowledge_points }}/{{ data.total_knowledge_points }}
                                    </div>
                                </template>
                            </el-statistic>
                        </el-col>

                    </el-row>


                </div>
            </el-card>
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
    /* background-color: #636366; */
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