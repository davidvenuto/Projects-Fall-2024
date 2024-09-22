<template>
  <div class="container">
    <div 
      class="workspace"
      @dragover.prevent="onDragOver"
      @drop="onDrop"
    >
      <h2 class="workspace-title">Workspace</h2>
      <p>Drop items here</p>
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
    <div class="toolbox">
      <h2>Toolbox</h2>
      <p>Drag items from here:</p>
      
      <div 
        class="toolbox-item" 
        draggable="true"
        @dragstart="onDragStart($event, 'State Bubble')"
      >
        State Bubble
      </div>

      <div 
        class="toolbox-item" 
        draggable="true"
        @dragstart="onDragStart($event, 'Edge')"
      >
        Edge
      </div>
      
      <div 
        class="toolbox-item" 
        draggable="true"
        @dragstart="onDragStart($event, 'State Name')"
      >
        State Name
      </div>

      <div 
        class="toolbox-item" 
        draggable="true"
        @dragstart="onDragStart($event, 'Self Loop')"
      >
        Self Loop
      </div>
    </div>
  </div>
</template>


<script lang="ts">
export default {
  name: 'Home',
  data() {
    return {
      droppedItems: [] as { type: string; x: number; y: number }[], 
    };
  },
  methods: {
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
.container {
  display: flex;
  height: 100vh;
}

.workspace {
  width: 80%;
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  padding: 20px;
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
