<!-- components/StudentPerformance.vue -->
<template>
    <el-row :gutter="20" v-loading="loading">
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
                    <!-- ... 其他部分 ... -->
                    <el-divider content-position="center">最常出错的知识点</el-divider>
                    <el-col :span="24">
                        <el-table :data="data.most_missed_knowledge_points" style="width: 100%" stripe
                            table-layout="fixed">
                            <el-table-column label="知识点" width="200">
                                <template #default="scope">

                                    {{ nodesNamesMap.get(scope.row.knowledge_point_uuid) || '知识点未找到' }}

                                </template>
                            </el-table-column>
                            <el-table-column prop="error_count" label="错误次数"></el-table-column>
                            <el-table-column label="讲解">
                                <template #default="scope">

                                    <el-button type="primary" :icon="Reading" circle
                                        @click="handleEdit(scope.$index, scope.row)" />

                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-divider content-position="center">最常出错的试题</el-divider>
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
    <GraphNeighborhoodDialog />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue';
import { useStudentStore } from '@/stores/studentStore';
import { useAuthStore } from '@/stores/authStore';
import { useGraphStore } from '@/stores/graphStore';
import GraphNeighborhoodDialog from './GraphNeighborhoodDialog.vue';
import { Reading } from '@element-plus/icons-vue'

const studentStore = useStudentStore();
const graphStore = useGraphStore();
const authStore = useAuthStore();
const studentId = authStore.user?.id;
const nodesNamesMap = ref(new Map<string, string>());

const loading = ref(true)

const performanceData = computed(() => {
    return studentStore.studentPerformance;
});

onMounted(async () => {
    if (studentId) {
        await studentStore.fetchStudentPerformance(studentId);

        await nextTick(); // 确保DOM已更新，响应式数据已被填充

        for (const subject in performanceData.value) {
            const missedPoints = performanceData.value[subject].most_missed_knowledge_points;

            for (const point of missedPoints) {
                if (!nodesNamesMap.value.has(point.knowledge_point_uuid)) {
                    // 只有当知识点不在映射表中时才异步加载
                    const node = await graphStore.findNodeByUUID(point.knowledge_point_uuid);
                    if (node) {
                        nodesNamesMap.value.set(point.knowledge_point_uuid, node.properties.node_name);
                    }
                }
            }
        }
        loading.value = false

    }
});



const handleEdit = async (_index: number, row: any) => {
    console.log("index:::: ", row.knowledge_point_uuid)
    const node = await graphStore.findNodeByUUID(row.knowledge_point_uuid);
    graphStore.currentNode = node ? node : null;
    // console.log('Current node:', graphStore.currentNode);
}
</script>

<!-- ... 样式 ... -->

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