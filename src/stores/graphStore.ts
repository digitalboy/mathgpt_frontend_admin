// stores/graphStore.ts
import { defineStore } from 'pinia';
import { GraphData, GraphService, Node, Edge } from '@/services/graphService';

export const useGraphStore = defineStore('graph', {
    state: () => ({
        nodes: [] as Node[],
        edges: [] as Edge[],
    }),
    actions: {
        async fetchNodesAndEdges() {
            try {
                const graphData = await GraphService.getNodesAndEdges();
                if (graphData) {
                    this.nodes = graphData.nodes;
                    this.edges = graphData.edges;
                }
            } catch (error) {
                console.error('获取节点和边失败：', error);
            }
        },
        async searchNodes(grade?: string, subject?: string) {
            try {
                const nodes = await GraphService.searchNodes(grade, subject);
                if (nodes) {
                    return nodes;
                }
            } catch (error) {
                console.error('搜索节点失败：', error);
                return [];
            }
        },
        async addNodesAndEdges(nodes: Node[], edges: Edge[]) {
            try {
                const graphData = await GraphService.addNodesAndEdges({ nodes, edges });
                if (graphData) {
                    this.nodes = graphData.nodes;
                    this.edges = graphData.edges;
                }
            } catch (error) {
                console.error('添加节点和边失败：', error);
            }
        },
        async updateNodesAndEdges(updates: any[]) {
            try {
                const graphData = await GraphService.updateNodesAndEdges(updates);
                if (graphData) {
                    this.nodes = graphData.nodes;
                    this.edges = graphData.edges;
                }
            } catch (error) {
                console.error('更新节点和边失败：', error);
            }
        },
        async deleteNode(uuid: string) {
            try {
                const response = await GraphService.deleteNode(uuid);
                if (response && response.message === '节点删除成功！') {
                    this.nodes = this.nodes.filter(node => node.elementId !== uuid);
                }
            } catch (error) {
                console.error('删除节点失败：', error);
            }
        },
        async deleteEdge(start_uuid: string, end_uuid: string, rel_type: string) {
            try {
                const response = await GraphService.deleteEdge(start_uuid, end_uuid, rel_type);
                if (response && response.message === '边删除成功！') {
                    this.edges = this.edges.filter(edge => !(edge.start_uuid === start_uuid && edge.end_uuid === end_uuid && edge.type === rel_type));
                }
            } catch (error) {
                console.error('删除边失败：', error);
            }
        },
        async getIsolationRank(limit: number) {
            try {
                const nodes = await GraphService.getIsolationRank(limit);
                if (nodes) {
                    return nodes;
                }
            } catch (error) {
                console.error('获取节点的隔离级别失败：', error);
                return [];
            }
        },
        async drawFigure(json_data: any, uuid: string) {
            try {
                const response = await GraphService.drawFigure(json_data, uuid);
                if (response) {
                    console.log('图形绘制成功！');
                    return response.message;
                }
            } catch (error) {
                console.error('图形绘制失败：', error);
                return '图形绘制失败';
            }
        }
    }
});
