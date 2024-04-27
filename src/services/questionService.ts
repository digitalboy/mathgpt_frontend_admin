// services/questionService.ts
import { BaseService } from './baseService';

export interface Question {
    id?: number;
    content: string;
    knowledge_point_uuid: string;
    subject_id: number;
    textbook_version_id: number;
    grade_id: number;
    description?: string;
}

export class QuestionService extends BaseService {
    // 创建题目
    public static async createQuestion(questionData: Question): Promise<Question | undefined> {
        try {
            const response = await this.axiosInstance.post<Question>('/question/new', questionData);
            console.log('题目创建成功！');
            return response.data;
        } catch (error) {
            console.error('创建题目失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取题目列表，可通过年级和科目ID过滤
    public static async getQuestions(grade_id?: number, subject_id?: number): Promise<Question[] | undefined> {
        try {
            const response = await this.axiosInstance.get<Question[]>('/question/get', { params: { grade_id, subject_id } });
            console.log('题目列表获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取题目列表失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取单个题目的详细信息
    public static async getQuestionByUUID(UUID: string): Promise<Question[] | undefined> {
        try {
            const response = await this.axiosInstance.get<Question[]>(`/question/get/${UUID}`);
            console.log('题目详细信息获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取题目信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 更新题目信息
    public static async updateQuestion(question_id: number, questionData: Question): Promise<Question | undefined> {
        try {
            const response = await this.axiosInstance.put<Question>(`/question/update/${question_id}`, questionData);
            console.log('题目信息更新成功！');
            return response.data;
        } catch (error) {
            console.error('更新题目信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除题目
    public static async deleteQuestion(question_id: number): Promise<{ success: string } | undefined> {
        try {
            const response = await this.axiosInstance.delete(`/question/delete/${question_id}`);
            console.log('题目删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除题目失败：', error);
            this.handleError(error);
            return undefined;
        }
    }
}
