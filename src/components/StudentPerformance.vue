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
                            <el-statistic :value="data.correct_answers" class="performance-circle">
                                <template #title>
                                    <div>
                                        正确率
                                    </div>
                                </template>
                                <template #suffix>/ {{ data.answered_questions }}</template>
                            </el-statistic>
                            <div class="performance-circle">
                                <el-progress type="circle" :percentage="data.correct_rate" />
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <el-statistic :value="data.answered_questions" class="performance-circle">
                                <template #title>
                                    <div>
                                        作答率
                                    </div>
                                </template>
                                <template #suffix>/ {{ data.total_questions }}</template>
                            </el-statistic>
                            <div class="performance-circle">
                                <el-progress type="circle" :percentage="data.answer_rate" />
                            </div>
                        </el-col>

                        <el-col :span="8">
                            <el-statistic :value="data.reached_knowledge_points" class="performance-circle">
                                <template #title>
                                    <div>
                                        知识触达
                                    </div>
                                </template>
                                <template #suffix>/ {{ data.total_knowledge_points }}</template>
                            </el-statistic>

                            <div class="performance-circle">
                                <el-progress type="circle" :percentage="data.knowledge_point_reach_rate" />
                            </div>
                        </el-col>
                    </el-row>

                    <el-divider content-position="center">最经常出错的知识点</el-divider>
                    <el-col :span="24">
                        <el-table :data="data.most_missed_knowledge_points" style="width: 100%" stripe>
                            <el-table-column prop="knowledge_point_uuid" label="知识点ID" width="300"></el-table-column>
                            <el-table-column prop="error_count" label="错误次数"></el-table-column>
                        </el-table>
                    </el-col>

                    <el-divider content-position="center">最经常出错的试题</el-divider>
                    <el-col :span="24">
                        <el-table :data="data.most_missed_questions" style="width: 100%" stripe>
                            <el-table-column prop="question_text" label="题目" width="300"></el-table-column>
                            <el-table-column prop="error_count" label="错误次数"></el-table-column>
                        </el-table>
                    </el-col>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useStudentStore } from '@/stores/studentStore';
import { useAuthStore } from '@/stores/authStore';

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


</script>

<style scoped>
.performance-card {
    text-align: center;
    /* padding: 20px; */
    border-radius: 4px;
    /* background-color: #636366; */
    transition: box-shadow 0.3s;
}

.performance-card:hover {
    /* box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1); */
}

.performance-circle {
    margin-bottom: 20px;
}

.performance-footer {
    font-size: 0.9em;
    color: #666;
}
</style>