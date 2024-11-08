<template>
  <div class="container">
    <div class="left-side">
      <div class="workspace-header">
        <h2 class="workspace-title">Workspace</h2>
        <p>Drop items here</p>
        <button @click="saveAsImage">Save Workspace as Image</button>
      </div>

      <div 
        class="workspace" 
        ref="workspace" 
        @dragover.prevent="onDragOver" 
        @drop="onDrop"
      >
        <!-- Render edges as SVG lines -->
        <svg class="edges-layer" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;">
          <line 
            v-for="edge in edges" 
            :key="edge.id" 
            :x1="edge.x1" 
            :y1="edge.y1" 
            :x2="edge.x2" 
            :y2="edge.y2" 
            stroke="black" 
            stroke-width="2"
          />
        </svg>

        <!-- Render nodes -->
        <div 
          v-for="(item, index) in nodes" 
          :key="index" 
          :style="{
            position: 'absolute',
            left: item.x + 'px',
            top: item.y + 'px'
          }" 
          :class="item.type === 'Node' ? 'node' : 'edge'" 
          class="workspace-item" 
          draggable="true" 
          @dragstart="onItemDragStart($event, index)"
        >
          <div v-if="item.type === 'Node'" class="node-circle"></div>
        </div>
      </div>
    </div>

    <div class="toolbox">
      <h2>Toolbox</h2>
      <p>Drag items from here:</p>

      <!-- Toolbox items with only visual elements -->
      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'Node')">
        <div class="node-circle"></div>
      </div>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'Edge')">
        <div class="edge-line"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'Home',
  data() {
    return {
      nodes: [] as { id: string; type: string; x: number; y: number }[],
      edges: [] as { id: string; fromNodeId: string; toNodeId: string; x1: number; y1: number; x2: number; y2: number }[],
    };
  },
  methods: {
    saveAsImage() {
      const workspace = this.$refs.workspace as HTMLElement;

      if (!workspace) {
        console.error('Workspace element not found');
        return;
      }

      html2canvas(workspace).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'workspace.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch((error) => {
        console.error('Could not save image', error);
      });
    },

    onDragStart(event: DragEvent, type: string) {
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;

      // Set the type of item being dragged
      dataTransfer.setData('type', type);
      
      // Use a transparent image to hide the drag preview box
      const img = document.createElement('div');
      img.style.width = '0px';
      img.style.height = '0px';
      document.body.appendChild(img);
      dataTransfer.setDragImage(img, 0, 0);
      setTimeout(() => document.body.removeChild(img), 0); // Clean up
    },

    onItemDragStart(event: DragEvent, index: number) {
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;

      // Indicate that we're moving an existing item by setting its index
      dataTransfer.setData('movingItemIndex', index.toString());
    },

    onDragOver(event: DragEvent) {
      event.preventDefault();
    },

    onDrop(event: DragEvent) {
      event.preventDefault();
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;

      // Get drop coordinates relative to the workspace
      const workspaceRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = event.clientX - workspaceRect.left;
      const y = event.clientY - workspaceRect.top;

      // Check if we're moving an existing item or adding a new one
      const movingItemIndex = dataTransfer.getData('movingItemIndex');
      if (movingItemIndex !== '') {
        // Move existing item
        const index = parseInt(movingItemIndex);
        if (!isNaN(index) && this.nodes[index]) {
          this.nodes[index].x = x;
          this.nodes[index].y = y;
          this.updateEdges(); // Update edges when a node moves
        }
      } else {
        // Add a new item
        const itemType = dataTransfer.getData('type');
        if (itemType === 'Node') {
          this.nodes.push({ id: uuidv4(), type: itemType, x, y });
        } else if (itemType === 'Edge' && this.nodes.length >= 2) {
          // Automatically connect the last two nodes as an example
          const fromNode = this.nodes[this.nodes.length - 2];
          const toNode = this.nodes[this.nodes.length - 1];
          if (fromNode && toNode) {
            this.edges.push({
              id: uuidv4(),
              fromNodeId: fromNode.id,
              toNodeId: toNode.id,
              x1: fromNode.x + 20,
              y1: fromNode.y + 20,
              x2: toNode.x + 20,
              y2: toNode.y + 20,
            });
          }
        }
      }
    },

    updateEdges() {
      this.edges.forEach(edge => {
        const fromNode = this.nodes.find(node => node.id === edge.fromNodeId);
        const toNode = this.nodes.find(node => node.id === edge.toNodeId);
        if (fromNode && toNode) {
          edge.x1 = fromNode.x + 20; // Offset for center of node
          edge.y1 = fromNode.y + 20;
          edge.x2 = toNode.x + 20;
          edge.y2 = toNode.y + 20;
        }
      });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.left-side {
  display: flex;
  flex-direction: column;
  width: 80%; 
}

.workspace-header {
  padding: 20px; 
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
}

.workspace {
  flex: 1; 
  background-color: #ffffff;
  border: 1px solid #ddd;
  position: relative;
}

.workspace-item {
  cursor: grab;
}

.node {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #42b983;
  border: 2px solid #333;
}

.edge-line {
  width: 60px;
  height: 2px;
  background-color: #333;
  margin-top: 20px;
}

.toolbox {
  width: 20%; 
  background-color: #f0f0f0;
  padding: 20px;
}

.toolbox-item {
  cursor: grab;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbox-item .node-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #42b983;
  border: 2px solid #333;
}

.toolbox-item .edge-line {
  width: 60px;
  height: 2px;
  background-color: #333;
}
</style>