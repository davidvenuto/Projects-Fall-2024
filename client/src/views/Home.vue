<template>
  <div class="container">
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
    </div>

    <div class="workspace">
      <h2>Workspace</h2>
      <p>Drop items here</p>
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
