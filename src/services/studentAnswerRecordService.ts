// services/studentAnswerRecordService.ts
import { BaseService } from './baseService';

export interface StudentAnswerRecord {
    id?: number;
    student_id: number;
    question_id: number;
    student_answer: string;
    // Include any additional properties returned by the backend
    question_content?: string;
    is_partially_correct?: boolean;
    is_fully_correct?: boolean;
    created_at?: string;
}

export class StudentAnswerRecordService extends BaseService {
    static async createStudentAnswerRecord(recordData: StudentAnswerRecord): Promise<any> {
        try {
            const response = await this.axiosInstance.post('/student_answer_record/new', recordData);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async getStudentAnswerRecords(): Promise<any> {
        try {
            const response = await this.axiosInstance.get('/student_answer_record/get');
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async getStudentAnswerRecordsByStudent(studentId: number): Promise<any> {
        try {
            const response = await this.axiosInstance.get(`/student_answer_record/get_by_student/${studentId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async updateStudentAnswerRecord(recordId: number, updates: Partial<StudentAnswerRecord>): Promise<any> {
        try {
            const response = await this.axiosInstance.put(`/student_answer_record/update/${recordId}`, updates);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async deleteStudentAnswerRecord(recordId: number): Promise<any> {
        try {
            const response = await this.axiosInstance.delete(`/student_answer_record/delete/${recordId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }
}