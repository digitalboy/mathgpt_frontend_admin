// stores/graphStore.ts
import { defineStore } from 'pinia';
import { GraphService, Node, Edge } from '@/services/graphService';

export const useGraphStore = defineStore('graph', {
    state: () => ({
        nodes: [] as Node[],
        edges: [] as Edge[],
        currentNode: null as Node | null,
        currentEdge: null as Edge | null,
        isDataLoading: false,
    }),
    getters: {
        currentNodeDetails: (state) => state.currentNode,
        currentEdgeDetails: (state) => state.currentEdge
    },
    actions: {
        setCurrentNode(node: Node | null) {
            this.currentNode = node;
        },
        setCurrentEdge(edge: Edge | null) {
            this.currentEdge = edge;
        },

        async fetchNodesAndEdges() {
            // console.log('Fetching nodes and edges...');
            this.isDataLoading = true;
            try {
                const graphData = await GraphService.getNodesAndEdges();
                if (graphData) {
                    // 直接使用从服务返回的节点和边数组
                    this.nodes = graphData.nodes;
                    this.edges = graphData.edges;
                    // console.log('Processed nodes:', this.nodes);
                    // console.log('Processed edges:', this.edges);
                    console.log('状态：成功获取节点和边。');
                }
            } catch (error) {
                console.error('状态：获取节点和边失败', error);
            } finally {
                this.isDataLoading = false;
            }
        },

        async searchNodes(grade?: string, subject?: string) {
            try {
                const nodesData = await GraphService.searchNodes(grade, subject);
                console.log(grade,subject)
                console.log('nodesData:', nodesData);
                if (nodesData) {
                this.nodes = nodesData;
            }
            } catch (error) {
                console.error('Failed to search nodes:', error);
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
                const updatePayload = { updates }; // 构造符合预期的对象
                const graphData = await GraphService.updateNodesAndEdges(updatePayload);
                if (graphData) {
                    this.nodes = graphData.nodes;
                    this.edges = graphData.edges;
                    console.log('Nodes and edges updated successfully!');
                }
            } catch (error) {
                console.error('Failed to update nodes and edges:', error);
            }
        },
        

        async deleteNode(uuid: string) {
            try {
                const response = await GraphService.deleteNode(uuid);
                if (response && response.message === '节点删除成功！') {
                    this.nodes = this.nodes.filter(node => node.elementId !== uuid);
                    if (this.currentNode?.elementId === uuid) {
                        this.currentNode = null;
                    }
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
                    if (this.currentEdge && this.currentEdge.start_uuid === start_uuid && this.currentEdge.end_uuid === end_uuid && this.currentEdge.type === rel_type) {
                        this.currentEdge = null;
                    }
                }
            } catch (error) {
                console.error('删除边失败：', error);
            }
        },
        async findNodeByUUID(uuid: string) {
            // 如果 nodes 是空的，则先从服务器获取数据
            if (this.nodes.length === 0) {
                await this.fetchNodesAndEdges();
            }
            // 现在 nodes 已有数据，查找相应节点
            const node = this.nodes.find(node => node.properties.uuid === uuid);
            if (node) {
                // 如果找到节点，设置为当前节点
                this.setCurrentNode(node);
            } else {
                // 否则设置当前节点为 null
                this.setCurrentNode(null);
            }
            return node || null;
        },
    }
});
