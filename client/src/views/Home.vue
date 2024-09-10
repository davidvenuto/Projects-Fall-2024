<template>
    <div class="container">
      <div class="workspace">
        <h2>Workspace</h2>
        <p>Drop items here</p>
      </div>
      <div class="toolbox">
        <h2>Toolbox</h2>
        <p>Drag items from here</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: 'Home',
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    height: 100vh;
  }
  
  .toolbox {
    width: 20%;
    background-color: #f0f0f0;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  .workspace {
    width: 80%;
    background-color: #ffffff;
    padding: 20px;
    border-left: 1px solid #ccc;
  }
  </style>
  