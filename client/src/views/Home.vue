<template>
  <div class="container">
    <div class="workspace">
      <h2 class="workspace-title">Workspace</h2>
      <p>Drop items here</p>
      <div class="drop-box">
        <!-- Items will be dropped here -->
      </div>
    </div>
    <div class="toolbox">
      <h2>Toolbox</h2>
      <p>Drag items from here:</p>
      
      <div 
        class="toolbox-item" 
        draggable="true"
        @dragstart="onDragStart($event, 'state')"
      >
        State Bubble
      </div>

      <div 
        class="toolbox-item" 
        draggable="true"
        @dragstart="onDragStart($event, 'edge')"
      >
        Edge
      </div>
      
      <div 
        class="toolbox-item" 
        draggable="true"
        @dragstart="onDragStart($event, 'stateName')"
      >
        State Name
      </div>

      <div 
        class="toolbox-item" 
        draggable="true"
        @dragstart="onDragStart($event, 'selfLoop')"
      >
        Self Loop
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
  methods: {
    onDragStart(event: DragEvent, type: string) {
      event.dataTransfer?.setData('type', type);
    }
  }
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
}

.drop-box {
  width: 100%;
  height: 400px; /* Adjust the height as needed */
  border: 2px dashed #42b983;
  background-color: #f9f9f9;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
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
