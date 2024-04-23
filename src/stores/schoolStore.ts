// stores/schoolStore.ts
import { defineStore } from 'pinia';
import { School, SchoolService } from '@/services/schoolService';

export const useSchoolStore = defineStore('school', {
    state: () => ({
        currentSchool: null as School | null, // 明确指定类型为 School 或 null
    }),
    actions: {
        setCurrentSchool(school: School) {
            console.log('setCurrentSchool', school);
            this.currentSchool = school;
        },
        // 添加更新学校信息的方法，便于在组件中调用
        async updateSchool(schoolId: number, schoolData: School) {
            try {
                // 假设您有一个 updateSchool 方法在 SchoolService 中
                const response = await SchoolService.updateSchool(schoolId, schoolData);
                if (response) {
                    console.log('学校信息更新成功！');
                    this.setCurrentSchool(response); // 更新当前学校信息
                    return true;
                }
            } catch (error) {
                console.error('更新学校信息失败：', error);
                return false;
            }
        }
    }
});
