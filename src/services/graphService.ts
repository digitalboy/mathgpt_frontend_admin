// services/graphService.ts
import { BaseService } from './baseService';

export interface Node {    
    labels: string;
    properties: {
        description: string;
        grade: string;
        node_name: string;
        publisher: string;
        subject: string;
        uuid: string;  // 确保包括这个属性
    };
    elementId?: string;  // 如果这个是用于某些特定逻辑，保留它
    
}

export interface Edge {
    type: string;
    start_uuid: string;
    end_uuid: string;
    properties: {
        since: number;  // 明确属性的类型
    };
}

export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}


export class GraphService extends BaseService {
    // 获取节点和边
    public static async getNodesAndEdges(): Promise<GraphData | undefined> {
        console.log('获取节点和边...');
        try {
            const response = await this.axiosInstance.get<GraphData>('/graph/get_nodes_edges');
            console.log('服务：节点和边获取成功！');
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('获取节点和边失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 搜索节点
    public static async searchNodes(grade?: string, subject?: string): Promise<Node[] | undefined> {
        try {
            const response = await this.axiosInstance.get<Node[]>('/graph/search_nodes', { params: { grade, subject } });
            console.log('节点搜索成功！');
            return response.data;
        } catch (error) {
            console.error('节点搜索失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 添加节点和边
    public static async addNodesAndEdges(data: { nodes: Node[], edges: Edge[] }): Promise<GraphData | undefined> {
        try {
            const response = await this.axiosInstance.post<GraphData>('/graph/add_nodes_edges', data);
            console.log('节点和边添加成功！');
            return response.data;
        } catch (error) {
            console.error('添加节点和边失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 更新节点和边
    public static async updateNodesAndEdges(data: { updates: any[] }): Promise<GraphData | undefined> {
        try {
            const response = await this.axiosInstance.put<GraphData>('/graph/update_nodes_edges', data);
            console.log('节点和边更新成功！');
            return response.data;
        } catch (error) {
            console.error('更新节点和边失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除节点
    public static async deleteNode(uuid: string): Promise<{ message: string } | undefined> {
        try {
            const response = await this.axiosInstance.delete(`/graph/delete_node/${uuid}`);
            console.log('节点删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除节点失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除边
    public static async deleteEdge(start_uuid: string, end_uuid: string, rel_type: string): Promise<{ message: string } | undefined> {
        try {
            const response = await this.axiosInstance.delete('/graph/delete_edge', { data: { start_uuid, end_uuid, rel_type } });
            console.log('边删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除边失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取节点的隔离级别
    public static async getIsolationRank(limit: number): Promise<Node[] | undefined> {
        try {
            const response = await this.axiosInstance.get<Node[]>('/graph/isolation_rank', { params: { limit } });
            console.log('节点的隔离级别获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取节点的隔离级别失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 绘制数学图形
    public static async drawFigure(json_data: any, uuid: string): Promise<{ message: string } | undefined> {
        try {
            const response = await this.axiosInstance.post('/graph/draw_figure', { json_data, uuid });
            console.log('图形绘制成功！');
            return response.data;
        } catch (error) {
            console.error('图形绘制失败：', error);
            this.handleError(error);
            return undefined;
        }
    }
}
