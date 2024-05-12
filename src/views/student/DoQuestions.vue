<template>
    <div>
        <h1>练习</h1>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card>
                    <NodesBySearch :display-type="displayType" />
                </el-card>
            </el-col>
        </el-row>
        <el-divider>
            <el-icon><star-filled /></el-icon>
        </el-divider>
        <el-row :gutter="20" class="question-cartd-container">
            <el-col :span="24">
                <QuestionCards />
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NodesBySearch from '@/components/NodesBySearch.vue';
import QuestionCards from '@/components/QuestionCards.vue';

const route = useRoute();
const displayType = ref('all');
// 从路由查询参数中读取displayType
watch(
    () => route.query.displayType,
    (newDisplayType) => {
        displayType.value = typeof newDisplayType === 'string' ? newDisplayType : 'all';
    },
    { immediate: true } // 立即触发，以便组件加载时设置初始值
);
</script>

<style scoped>

</style>