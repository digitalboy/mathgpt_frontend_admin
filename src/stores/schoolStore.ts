// stores/schoolStore.ts
import { defineStore } from 'pinia';
import { School, SchoolService } from '@/services/schoolService';

export const useSchoolStore = defineStore('school', {
    state: () => ({
        schools: [] as School[],
        currentSchool: null as School | null, // 明确指定类型为 School 或 null
    }),
    actions: {
        setCurrentSchool(school: School) {
            console.log('setCurrentSchool', school);
            this.currentSchool = school;
        },
        async fetchSchools() {
            try {
                const schools = await SchoolService.getSchools();
                if (schools) {
                    console.log('学校列表加载成功');
                    this.schools = schools;
                }
            } catch (error) {
                console.error('加载学校列表失败:', error);
            }
        },
        async updateSchool(schoolId: number, schoolData: School) {
            try {
                const response = await SchoolService.updateSchool(schoolId, schoolData);
                if (response) {
                    console.log('学校信息更新成功！');
                    this.setCurrentSchool(response); // 更新当前学校信息
                    const index = this.schools.findIndex(s => s.id === schoolId);
                    if (index !== -1) {
                        this.schools[index] = response;
                    }
                    return true;
                }
            } catch (error) {
                console.error('更新学校信息失败：', error);
                return false;
            }
        },
        async deleteSchool(schoolId: number) {
            try {
                const response = await SchoolService.deleteSchool(schoolId);
                if (response) {
                    console.log('学校删除成功！');
                    this.schools = this.schools.filter(s => s.id !== schoolId);
                    if (this.currentSchool?.id === schoolId) {
                        this.currentSchool = null; // 如果删除的是当前选中的学校，清除选中状态
                    }
                    return true;
                }
            } catch (error) {
                console.error('删除学校失败：', error);
                return false;
            }
        }
    }
});
