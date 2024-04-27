
<template>
    <div>
        <h1>练习</h1>
        <el-row :gutter="20">
            <el-card>
                <NodesBySearch />
            </el-card>

        </el-row>
        <el-row :gutter="20">
            <QuestionCards />
        </el-row>
        <!-- <QuestionList/> -->

    </div>
</template>

<script setup lang="ts">
import NodesBySearch from '@/components/NodesBySearch.vue';
// import QuestionList from '@/components/QuestionList.vue';
import QuestionCards from '@/components/QuestionCards.vue';

</script>

<style scoped></style>