// services/studentAnswerRecordService.ts
import { BaseService } from './baseService';

export interface StudentAnswer {
    id: number;
    created_at: string;
    is_fully_correct: boolean;
    is_partially_correct: boolean;
    student_answer: string;
}

export interface QuestionOption {
    option_id: string;
    option_text: string;
}

export interface Question {
    id: number;
    text: string;
    type: string;
    correct_answer: string[];
    knowledge_point_name: string;
    knowledge_point_uuid: string;
    options: QuestionOption[];
}

export interface Student {
    id: number;
    name: string;
    class_id: number;
}

export interface AnswerRecordResponse {
    answers: StudentAnswer[];
    question: Question;
    student: Student;
}

export interface StudentAnswerRecord {
    id?: number;
    student_id: number;
    question_id: number;
    student_answer: string;
    knowlage_point_uuid?: string;
    question_content?: string;
    is_partially_correct?: boolean;
    is_fully_correct?: boolean;
    created_at?: string;
}

export class StudentAnswerRecordService extends BaseService {
    static async createStudentAnswerRecord(recordData: StudentAnswerRecord): Promise<StudentAnswerRecord | undefined> {
        try {
            const response = await this.axiosInstance.post<StudentAnswerRecord>('/student_answer_record/new', recordData);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return undefined;
        }
    }

    static async getStudentAnswerRecords(): Promise<StudentAnswerRecord[] | undefined> {
        try {
            const response = await this.axiosInstance.get<StudentAnswerRecord[]>('/student_answer_record/get');
            return response.data;
        } catch (error) {
            this.handleError(error);
            return undefined;
        }
    }

    static async getStudentAnswerRecordsByStudent(studentId: number): Promise<StudentAnswerRecord[] | undefined> {
        try {
            const response = await this.axiosInstance.get<StudentAnswerRecord[]>(`/student_answer_record/get_by_student/${studentId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return undefined;
        }
    }

    static async updateStudentAnswerRecord(recordId: number, updates: Partial<StudentAnswerRecord>): Promise<StudentAnswerRecord | undefined> {
        try {
            const response = await this.axiosInstance.put<StudentAnswerRecord>(`/student_answer_record/update/${recordId}`, updates);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return undefined;
        }
    }

    static async deleteStudentAnswerRecord(recordId: number): Promise<void | undefined> {
        try {
            const response = await this.axiosInstance.delete(`/student_answer_record/delete/${recordId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return undefined;
        }
    }

    // 新增方法：根据学生和题目ID获取回答记录
    static async getAnswerRecordByStudentAndQuestion(student_id: number, question_id: number): Promise<AnswerRecordResponse | undefined> {
        try {
            const response = await this.axiosInstance.get<AnswerRecordResponse>('/student_answer_record/get_by_student_and_question', {
                params: { student_id, question_id }
            });
            console.log('获取某道题目的历史记录成功！');
            return response.data;
        } catch (error) {
            console.error('获取某道题目的历史记录失败：', error);
            this.handleError(error);
            return undefined;
        }
    }
}
