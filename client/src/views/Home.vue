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
        <div 
          v-for="(item, index) in droppedItems" 
          :key="index" 
          :style="{
            position: 'absolute',
            left: item.x + 'px',
            top: item.y + 'px'
          }" 
          class="workspace-item" 
          draggable="true" 
          @dragstart="onItemDragStart($event, index)"
        >
          {{ item.type }}
        </div>
      </div>
    </div>

    <div class="toolbox">
      <h2>Toolbox</h2>
      <p>Drag items from here:</p>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'State Bubble')">
        State Bubble
      </div>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'Edge')">
        Edge
      </div>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'State Name')">
        State Name
      </div>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'Self Loop')">
        Self Loop
      </div>
    </div>
  </div>
</template>




<script lang="ts">
import html2canvas from 'html2canvas';

export default {
  name: 'Home',
  data() {
    return {
      droppedItems: [] as { type: string; x: number; y: number }[],
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
      dataTransfer.setData('type', type);
      dataTransfer.setData('movingItemIndex', '');
    },

    onItemDragStart(event: DragEvent, index: number) {
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;
      dataTransfer.setData('movingItemIndex', index.toString());
      dataTransfer.setData('type', '');
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

      if (movingItemIndex !== '') {
        const index = parseInt(movingItemIndex);
        if (!isNaN(index) && this.droppedItems[index]) {
          this.droppedItems[index].x = x;
          this.droppedItems[index].y = y;
        }
      } else {
        const itemType = dataTransfer.getData('type');
        if (itemType) {
          this.droppedItems.push({ type: itemType, x, y });
        }
      }
    },

  },
};
</script>


<style scoped>
html, body {
  margin: 0;
  padding: 0;
}

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
  padding: 10px;
  background-color: #42b983;
  color: white;
  border-radius: 5px;
  text-align: center;
  width: fit-content;
  cursor: grab;
}

.toolbox {
  width: 20%; 
  background-color: #f0f0f0;
  padding: 20px;
}

.toolbox-item {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #42b983;
  color: white;
  text-align: center;
  cursor: grab;
}
</style>



