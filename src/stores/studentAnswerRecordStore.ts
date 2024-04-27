// stores/studentAnswerRecordStore.ts
import { defineStore } from 'pinia';
import { StudentAnswerRecord, StudentAnswerRecordService } from '@/services/studentAnswerRecordService';

export const useStudentAnswerRecordStore = defineStore('studentAnswerRecord', {
    state: () => ({
        studentAnswerRecords: [] as StudentAnswerRecord[],
        currentRecord: null as StudentAnswerRecord | null,
    }),
    actions: {
        setCurrentRecord(record: StudentAnswerRecord) {
            this.currentRecord = record;
        },
        async fetchStudentAnswerRecords() {
            try {
                const records = await StudentAnswerRecordService.getStudentAnswerRecords();
                if (records) {
                    this.studentAnswerRecords = records;
                }
            } catch (error) {
                console.error('加载答案记录失败:', error);
            }
        },
        async fetchStudentAnswerRecordsByStudent(studentId: number) {
            try {
                const records = await StudentAnswerRecordService.getStudentAnswerRecordsByStudent(studentId);
                if (records) {
                    this.studentAnswerRecords = records;
                }
            } catch (error) {
                console.error('获取学生答案记录失败:', error);
            }
        },
        async createStudentAnswerRecord(recordData: StudentAnswerRecord) {
            try {
                const newRecord = await StudentAnswerRecordService.createStudentAnswerRecord(recordData);
                if (newRecord) {
                    this.studentAnswerRecords.push(newRecord);
                    this.setCurrentRecord(newRecord);
                }
            } catch (error) {
                console.error('创建答案记录失败:', error);
            }
        },
        async updateStudentAnswerRecord(recordId: number, updates: Partial<StudentAnswerRecord>) {
            try {
                const updatedRecord = await StudentAnswerRecordService.updateStudentAnswerRecord(recordId, updates);
                if (updatedRecord) {
                    const index = this.studentAnswerRecords.findIndex(record => record.id === recordId);
                    if (index !== -1) {
                        this.studentAnswerRecords[index] = updatedRecord;
                        this.setCurrentRecord(updatedRecord);
                    }
                }
            } catch (error) {
                console.error('更新答案记录失败:', error);
            }
        },
        async deleteStudentAnswerRecord(recordId: number) {
            try {
                await StudentAnswerRecordService.deleteStudentAnswerRecord(recordId);
                this.studentAnswerRecords = this.studentAnswerRecords.filter(record => record.id !== recordId);
                if (this.currentRecord?.id === recordId) {
                    this.currentRecord = null;
                }
            } catch (error) {
                console.error('删除答案记录失败:', error);
            }
        }
    }
});