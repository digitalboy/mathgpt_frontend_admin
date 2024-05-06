// services/KPExplanationService.ts
import { BaseService } from './baseService';

export interface KPExplanationContent {
    welcome_message: string;
    response: {
        relationship?: string;
        definition?: string;
        popular_definition?: string;
        math_definition?: string;
        confusion?: string;
        example?: string;
        symbols?: string;
        popular_example?: string;
        basic_math_example?: string;
        visual_aid?: string;
        real_life_connection?: string;
    };
    diagram?: string;
    conclusion_suggestion?: string;
}

export interface KPExplanation {
    id?: number;
    knowledge_point_uuid: string;
    content: KPExplanationContent;
    grade_id: number;
    subject_id: number;
    rating?: number;    
}

export class KPExplanationService extends BaseService {
    // 根据 knowledge_point_uuid 创建知识点解释
    public static async createExplanation(explanationData: KPExplanation): Promise<KPExplanation | undefined> {
        try {
            const response = await this.axiosInstance.post('/knowlage_point_explanation/new', explanationData);
            return response.data;
        } catch (error) {
            console.error('createExplanation:', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取所有知识点解释
    public static async getExplanations(): Promise<KPExplanation[] | undefined> {
        try {
            const response = await this.axiosInstance.get('/knowlage_point_explanation/get');
            return response.data;
        } catch (error) {
            console.error('getExplanations:', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取单个知识点解释详情
    public static async getExplanationById(explanationId: number): Promise<KPExplanation | undefined> {
        try {
            const response = await this.axiosInstance.get(`/knowlage_point_explanation/get/${explanationId}`);
            return response.data;
        } catch (error) {
            console.error(`getExplanationById ${explanationId}:`, error);
            this.handleError(error);
            return undefined;
        }
    }

    // 更新知识点解释
    public static async updateExplanation(explanationId: number, explanationData: KPExplanation): Promise<KPExplanation | undefined> {
        try {
            const response = await this.axiosInstance.put(`/knowlage_point_explanation/update/${explanationId}`, explanationData);
            return response.data;
        } catch (error) {
            console.error(`updateExplanation ${explanationId}:`, error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除知识点解释
    public static async deleteExplanation(explanationId: number): Promise<void | undefined> {
        try {
            await this.axiosInstance.delete(`/knowlage_point_explanation/delete/${explanationId}`);
        } catch (error) {
            console.error(`deleteExplanation ${explanationId}:`, error);
            this.handleError(error);
            return undefined;
        }
    }
}
