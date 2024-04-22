// services/textbookVersionService.ts
import { BaseService } from './baseService';

interface TextbookVersion {
    id?: number;
    publisher: string;
    subject_id: number;
    publish_year: number;
}

export class TextbookVersionService extends BaseService {
    // 创建教材版本
    public static async createTextbookVersion(textbookVersionData: TextbookVersion): Promise<TextbookVersion | undefined> {
        try {
            const response = await this.axiosInstance.post<TextbookVersion>('/textbook_version/new', textbookVersionData);
            console.log('教材版本创建成功！');
            return response.data;
        } catch (error) {
            console.error('创建教材版本失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取所有教材版本的列表
    public static async getTextbookVersions(): Promise<TextbookVersion[] | undefined> {
        try {
            const response = await this.axiosInstance.get<TextbookVersion[]>('/textbook_version/get');
            console.log('教材版本列表获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取教材版本列表失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取单个教材版本的详细信息
    public static async getTextbookVersionById(textbookVersionId: number): Promise<TextbookVersion | undefined> {
        try {
            const response = await this.axiosInstance.get<TextbookVersion>(`/textbook_version/get/${textbookVersionId}`);
            console.log('教材版本详细信息获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取教材版本信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 更新教材版本信息
    public static async updateTextbookVersion(textbookVersionId: number, textbookVersionData: TextbookVersion): Promise<TextbookVersion | undefined> {
        try {
            const response = await this.axiosInstance.put<TextbookVersion>(`/textbook_version/update/${textbookVersionId}`, textbookVersionData);
            console.log('教材版本信息更新成功！');
            return response.data;
        } catch (error) {
            console.error('更新教材版本信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除教材版本
    public static async deleteTextbookVersion(textbookVersionId: number): Promise<void | undefined> {
        try {
            const response = await this.axiosInstance.delete(`/textbook_version/delete/${textbookVersionId}`);
            console.log('教材版本删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除教材版本失败：', error);
            this.handleError(error);
            return undefined;
        }
    }
}
