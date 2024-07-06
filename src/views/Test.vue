<!-- src/views/Test.vue -->
<template>
    <h1>知识图谱</h1>
    <el-row :gutter="20">
        <el-col :span="24">
            <GraphVisualizeGuest />
        </el-col>
    </el-row>
    <NodeEdit />
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import { ElMessageBox } from 'element-plus';
import GraphVisualizeGuest from '@/components/GraphVisualizeGuest.vue';
// import GraphVisualize from '@/components/GraphVisualizeGuest.vue';  // 导入图谱可视化组件

console.log("GraphVisualizeGuest");

onMounted(async () => {
    // 确保所有 DOM 更新完成后再执行
    await nextTick();

    // 弹出欢迎消息
    // ElMessageBox.alert('欢迎使用知识图谱系统！请首先选择出版社，年级（可多选），学科不要选，只有数学；关系（可多选）。联系我：digitalboyzone@gmail.com；微信：13510546101', '欢迎', {
    //     confirmButtonText: '确定',
    //     type: 'info',
    // });

    ElMessageBox({
        title: '欢迎使用知识图谱系统！',
        message: '请首先选择出版社，年级（可多选），学科不要选，只有数学；关系（可多选）。联系我：digitalboyzone@gmail.com；微信：13510546101；别忘了去Github 给我点个Star。https://github.com/digitalboy/RCAE_graph_data',

        type: 'info',
        showCancelButton: false,
        confirmButtonText: '确定',

    })

});
</script>

<style scoped></style>

