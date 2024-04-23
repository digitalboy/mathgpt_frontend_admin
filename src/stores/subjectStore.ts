// stores/subjectStore.ts
import { defineStore } from 'pinia';
import { Subject, SubjectService } from '@/services/subjectService';

export const useSubjectStore = defineStore('subject', {
    state: () => ({
        subjects: [] as Subject[],
        currentSubject: null as Subject | null,
    }),
    actions: {
        setCurrentSubject(subject: Subject | null) {
            this.currentSubject = subject;
        },
        async fetchSubjects() {
            try {
                const subjects = await SubjectService.getSubjects();
                if (subjects) {
                    this.subjects = subjects;
                }
            } catch (error) {
                console.error('加载学科列表失败:', error);
            }
        },
        async fetchSubjectById(subjectId: number) {
            try {
                const subject = await SubjectService.getSubjectById(subjectId);
                if (subject) {
                    this.setCurrentSubject(subject);
                }
            } catch (error) {
                console.error('获取学科详细信息失败:', error);
            }
        },
        async createSubject(subjectData: Subject) {
            try {
                const newSubject = await SubjectService.createSubject(subjectData);
                if (newSubject) {
                    this.subjects.push(newSubject);
                    this.setCurrentSubject(newSubject);
                }
            } catch (error) {
                console.error('创建学科失败:', error);
            }
        },
        async updateSubject(subjectId: number, subjectData: Subject) {
            try {
                const updatedSubject = await SubjectService.updateSubject(subjectId, subjectData);
                if (updatedSubject) {
                    const index = this.subjects.findIndex(s => s.id === subjectId);
                    if (index !== -1) {
                        this.subjects[index] = updatedSubject;
                        this.setCurrentSubject(updatedSubject);
                    }
                }
            } catch (error) {
                console.error('更新学科信息失败:', error);
            }
        },
        async deleteSubject(subjectId: number) {
            try {
                await SubjectService.deleteSubject(subjectId);
                this.subjects = this.subjects.filter(s => s.id !== subjectId);
                if (this.currentSubject?.id === subjectId) {
                    this.currentSubject = null;
                }
            } catch (error) {
                console.error('删除学科失败:', error);
            }
        }
    }
});
