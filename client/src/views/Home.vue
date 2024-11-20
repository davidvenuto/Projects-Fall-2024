<template>
  <div class="container">
    <div class="left-side">
      <div class="workspace-header">
        <h2 class="workspace-title">Workspace</h2>
        <p>Drop items here</p>
        <button @click="openSaveModal">Save Graph</button>
        <button @click="saveAsImage">Save Graph as Image</button>
        <button @click="loadGraph">Load Saved Graph</button>
        <button @click="saveGraphsAsJSON">Save Graphs Data</button>
        <button @click="importJSON">Import JSON File</button>
      </div>

      <div class="workspace" ref="workspace" @dragover.prevent="onDragOver" @drop="onDrop">
        <svg class="edges-layer" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="20" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>

          <path v-for="edge in edges" :key="edge.id" :d="edge.isSelfLoop
            ? 'M ' + edge.x1 + ',' + edge.y1 + ' a 20,20 0 1,1 40,0 a 20,20 0 1,1 -40,0'
            : 'M' + edge.x1 + ',' + edge.y1 + ' L' + edge.x2 + ',' + edge.y2" stroke="#333" stroke-width="2"
            fill="none" :marker-end="edge.isSelfLoop ? '' : 'url(#arrowhead)'" />

          <text v-for="edge in edges" :key="edge.id + '-label'"
            :x="edge.isSelfLoop ? edge.x1 + 20 : (edge.x1 + edge.x2) / 2"
            :y="edge.isSelfLoop ? edge.y1 - 30 : ((edge.y1 + edge.y2) / 2) - 10" fill="#333" font-size="14"
            text-anchor="middle">
            {{ edge.label }}
          </text>
        </svg>

        <div v-for="(item, index) in nodes" :key="index" :style="{
          position: 'absolute',
          left: item.x + 'px',
          top: item.y + 'px'
        }" :class="item.isInitial ? 'initial-state' : 'node'" class="workspace-item" draggable="true"
          @dragstart="onItemDragStart($event, index)">
          <div v-if="item.type === 'Node'" :class="{ 'node-circle': !item.isInitial, 'double-circle': item.isInitial }">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>

      <div v-if="showGraphModal" class="modal-overlay" @click="showGraphModal = false">
        <div class="modal-content" @click.stop>
          <h2>Select a Graph to Load</h2>
          <ul class="graph-list">
            <li v-for="graph in savedGraphs" :key="graph.graphid">
              <label>
                <input type="radio" :value="String(graph.graphid)" v-model="selectedGraphId" />
                {{ graph.name }} - {{ graph.description }}
              </label>
            </li>
          </ul>
          <button @click="loadSelectedGraph" :disabled="selectedGraphId === null">Load Graph</button>
          <button @click="showGraphModal = false">Cancel</button>
        </div>
      </div>

      <div v-if="showSaveModal" class="modal-overlay" @click="closeSaveModal">
        <div class="modal-content" @click.stop>
          <h2>Save Graph</h2>
          <form @submit.prevent="submitSaveGraph">
            <div class="form-group">
              <label for="graphTitle">Title</label>
              <input type="text" id="graphTitle" v-model="graphTitle" required />
            </div>
            <div class="form-group">
              <label for="graphDescription">Description</label>
              <textarea id="graphDescription" v-model="graphDescription" required></textarea>
            </div>
            <button type="submit">Save</button>
            <button type="button" @click="closeSaveModal">Cancel</button>
          </form>
        </div>
      </div>

    </div>

    <div class="toolbox">
      <h2>Toolbox</h2>
      <p>Drag items from here:</p>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'SelfLoop')">
        <svg width="60" height="60">
          <path d="M 20,40 C 10,20, 50,20, 40,40" stroke="#333" stroke-width="2" fill="none" />
          <polygon points="37,36 45,40 37,44" fill="#333" />
        </svg>
      </div>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'Node')">
        <div class="node-circle"></div>
      </div>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'InitialNode')">
        <div class="double-circle"></div>
      </div>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'Edge')">
        <svg width="60" height="10">
          <defs>
            <marker id="toolbox-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
            </marker>
          </defs>
          <line x1="0" y1="5" x2="50" y2="5" stroke="#333" stroke-width="2" marker-end="url(#toolbox-arrowhead)" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';

interface Node {
  id: string;
  type: string;
  x: number;
  y: number;
  name: string;
  isInitial?: boolean;
}

interface Edge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  isSelfLoop?: boolean;
}

export default {
  name: 'Home',
  data() {
    return {
      nodes: [] as Node[],
      edges: [] as Edge[],
      hasInitialState: false,
      stateCounter: 0,
      savedGraphs: [] as any[],
      showGraphModal: false,
      selectedGraphId: null as string | null,
      showSaveModal: false,
      graphTitle: '',
      graphDescription: '',
    };
  },
  methods: {
    async importJSON() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No user information found. Please log in again.');
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const text = await file.text();
        let jsonData;

        try {
          jsonData = JSON.parse(text);
        } catch (parseError) {
          console.error('Invalid JSON format:', parseError);
          alert('The selected file contains invalid JSON.');
          return;
        }

        // Check if jsonData is an array
        if (Array.isArray(jsonData)) {
          if (jsonData.length === 0) {
            alert('The JSON array is empty.');
            return;
          }

          // For simplicity, take the first graph in the array
          jsonData = jsonData[0];
          // Alternatively, you can implement logic to select which graph to import
        }

        // Validate JSON Structure
        if (!jsonData.nodes || !Array.isArray(jsonData.nodes)) {
          alert('Invalid JSON structure: "nodes" array is missing.');
          return;
        }

        if (!jsonData.edges || !Array.isArray(jsonData.edges)) {
          alert('Invalid JSON structure: "edges" array is missing.');
          return;
        }

        // Map and Assign Nodes
        this.nodes = jsonData.nodes.map((nodeData: any) => {
          // Assign a unique ID if missing
          const nodeId = nodeData.nodeid || uuidv4();

          // Ensure required properties are present
          return {
            id: nodeId,
            type: nodeData.type || 'Node',
            x: nodeData.x || 0,
            y: nodeData.y || 0,
            name: nodeData.name || `q${this.stateCounter++}`,
            isInitial: nodeData.isInitial || false,
          };
        });

        // Check for initial state
        this.hasInitialState = this.nodes.some(node => node.isInitial);

        // Map and Assign Edges
        this.edges = jsonData.edges.map((edgeData: any) => {
          // Assign a unique ID if missing
          const edgeId = uuidv4();

          // Determine if it's a self-loop
          const isSelfLoop = edgeData.isSelfLoop !== undefined
            ? edgeData.isSelfLoop
            : edgeData.from_nodeid === edgeData.to_nodeid;

          return {
            id: edgeId,
            fromNodeId: edgeData.fromNodeid,
            toNodeId: edgeData.to_nodeid,
            x1: 0, // Will be set in updateEdges
            y1: 0,
            x2: 0,
            y2: 0,
            label: edgeData.label || '',
            isSelfLoop: isSelfLoop,
          };
        });

        // Update Edge Positions
        this.updateEdges();

        // Optional: Reset selectedGraphId if necessary
        this.selectedGraphId = null;

        // Notify the user
        alert('Graph imported successfully!');
      }
    };
    fileInput.click();
  } catch (error) {
    console.error('Error importing JSON:', error);
    alert('An error occurred while importing the JSON file.');
  }
}
,

    async saveGraphsAsJSON() {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          alert('No user information found. Please log in again.');
          return;
        }

        const response = await fetch('/api/graphs/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.isSuccess) {
          const dataStr = JSON.stringify(result.data, null, 2);
          const blob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = 'my_graphs.json';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          alert('Failed to load graphs.');
        }
      } catch (error) {
        console.error('Error saving JSON:', error);
        alert('An error occurred while saving the JSON file.');
      }
    },

    async loadGraph() {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          alert('No user information found. Please log in again.');
          return;
        }

        const response = await fetch('/api/graphs/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.isSuccess) {
          this.savedGraphs = result.data;
          this.showGraphModal = true;
        } else {
          alert('Failed to load graphs.');
        }
      } catch (error) {
        console.error('Error loading graphs:', error);
        alert('An error occurred while loading graphs.');
      }
    },

    loadSelectedGraph() {
      const graph = this.savedGraphs.find((g) => String(g.graphid) === this.selectedGraphId);
      if (graph) {
        this.nodes = [];
        this.edges = [];
        this.stateCounter = graph.nodes.length;
        this.hasInitialState = false;

        graph.nodes.forEach((nodeData: any) => {
          const node: Node = {
            id: nodeData.nodeid,
            type: 'Node',
            x: nodeData.x,
            y: nodeData.y,
            name: nodeData.name || `q${this.stateCounter++}`,
            isInitial: nodeData.isInitial || false,
          };
          if (node.isInitial) {
            this.hasInitialState = true;
          }
          this.nodes.push(node);
        });

        graph.edges.forEach((edgeData: any) => {
          const edge: Edge = {
            id: uuidv4(),
            fromNodeId: edgeData.from_nodeid,
            toNodeId: edgeData.to_nodeid,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            label: edgeData.label || '',
            isSelfLoop: edgeData.from_nodeid === edgeData.to_nodeid,
          };
          this.edges.push(edge);
        });

        this.updateEdges();

        this.showGraphModal = false;
        this.selectedGraphId = null;
      }
    },

    saveAsImage() {
      const workspace = this.$refs.workspace as HTMLElement;
      if (!workspace) return;

      html2canvas(workspace).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'workspace.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    },

    openSaveModal() {
      this.showSaveModal = true;
    },

    closeSaveModal() {
      this.showSaveModal = false;
      this.graphTitle = '';
      this.graphDescription = '';
    },

    async submitSaveGraph() {
      try {
        const token = localStorage.getItem('token');
        const userid = localStorage.getItem('userid');

        if (!token || !userid) {
          alert('No user information found. Please log in again.');
          return;
        }

        const graphData = {
          name: this.graphTitle || 'Untitled Graph',
          description: this.graphDescription || 'No description provided.',
          nodes: this.nodes.map((node) => ({
            nodeid: node.id,
            x: node.x,
            y: node.y,
            isInitial: node.isInitial || false,
            name: node.name,
          })),
          edges: this.edges.map((edge) => ({
            from_nodeid: edge.fromNodeId,
            to_nodeid: edge.toNodeId,
            label: edge.label || '',
            isSelfLoop: edge.isSelfLoop || false,
          })),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
        };

        const response = await fetch('/api/graphs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(graphData),
        });

        const result = await response.json();

        if (result.isSuccess) {
          alert('Graph saved successfully!');
        } else {
          alert('Failed to save graph.');
        }
      } catch (error) {
        console.error('Error saving graph:', error);
        alert('An error occurred while saving the graph.');
      } finally {
        this.closeSaveModal();
      }
    },


    onDragStart(event: DragEvent, type: string) {
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;
      dataTransfer.setData('type', type);

      const img = document.createElement('div');
      img.style.width = '0px';
      img.style.height = '0px';
      document.body.appendChild(img);
      dataTransfer.setDragImage(img, 0, 0);
      setTimeout(() => document.body.removeChild(img), 0);
    },

    onItemDragStart(event: DragEvent, index: number) {
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;
      dataTransfer.setData('movingItemIndex', index.toString());
    },

    onDragOver(event: DragEvent) {
      event.preventDefault();
    },

    onDrop(event: DragEvent) {
      event.preventDefault();
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;

      const workspaceRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = event.clientX - workspaceRect.left;
      const y = event.clientY - workspaceRect.top;

      const movingItemIndex = dataTransfer.getData('movingItemIndex');
      const itemType = dataTransfer.getData('type');

      if (movingItemIndex) {
        const index = parseInt(movingItemIndex);
        if (!isNaN(index) && this.nodes[index]) {
          this.nodes[index].x = x;
          this.nodes[index].y = y;
          this.updateEdges();
        }
        return;
      }

      if (!this.hasInitialState && itemType !== 'InitialNode') {
        alert('Please place an initial state first.');
        return;
      }

      switch (itemType) {
        case 'InitialNode':
          if (!this.hasInitialState) {
            this.nodes.push({
              id: uuidv4(),
              type: 'Node',
              x,
              y,
              name: `q${this.stateCounter++}`,
              isInitial: true,
            });
            this.hasInitialState = true;
          }
          break;

        case 'Node':
          this.nodes.push({
            id: uuidv4(),
            type: itemType,
            x,
            y,
            name: `q${this.stateCounter++}`,
            isInitial: false,
          });
          break;

        case 'Edge':
          if (this.nodes.length >= 2) {
            const fromNode = this.nodes[this.nodes.length - 2];
            const toNode = this.nodes[this.nodes.length - 1];
            const label = prompt("Enter label for this edge (e.g., 'a' for q0 to q1 transition):", '') || '';

            this.edges.push({
              id: uuidv4(),
              fromNodeId: fromNode.id,
              toNodeId: toNode.id,
              x1: fromNode.x + 20,
              y1: fromNode.y + 20,
              x2: toNode.x + 20,
              y2: toNode.y + 20,
              label,
            });
          }
          break;

        case 'SelfLoop':
          const targetNode = this.nodes[this.nodes.length - 1];
          if (targetNode) {
            const label = prompt("Enter label for this self-loop (e.g., 'a'):", '') || '';
            this.edges.push({
              id: uuidv4(),
              fromNodeId: targetNode.id,
              toNodeId: targetNode.id,
              x1: targetNode.x,
              y1: targetNode.y,
              x2: targetNode.x,
              y2: targetNode.y,
              label,
              isSelfLoop: true,
            });
          }
          break;

        default:
          break;
      }
    },

    updateEdges() {
      this.edges.forEach((edge) => {
        const fromNode = this.nodes.find((node) => node.id === edge.fromNodeId);
        const toNode = this.nodes.find((node) => node.id === edge.toNodeId);
        if (fromNode && toNode) {
          const offset = 25;
          edge.x1 = fromNode.x + offset;
          edge.y1 = fromNode.y + offset;
          edge.x2 = toNode.x + offset;
          edge.y2 = toNode.y + offset;
        }
      });
    },
  },
};
</script>

<style scoped src="./css/home.css"></style>
