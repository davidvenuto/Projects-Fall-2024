<template>
    <div class="container">
      <div class="workspace">
        <h2>Workspace</h2>
        <p>Drop items here</p>
        <!-- Workspace where users will drop items -->
      </div>
      <div class="toolbox">
        <h2>Toolbox</h2>
        <p>Drag items from here</p>
        <!-- Add toolbox items here -->
      </div>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: 'Home',
  };
  </script>
  
  <style scoped>
  /* Container for both the toolbox and workspace */
  .container {
    display: flex;
    height: 100vh; /* Full viewport height */
  }
  
  /* Toolbox styling */
  .toolbox {
    width: 20%; /* 20% of the width for toolbox */
    background-color: #f0f0f0;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  /* Workspace styling */
  .workspace {
    width: 80%; /* 80% of the width for workspace */
    background-color: #ffffff;
    padding: 20px;
    border-left: 1px solid #ccc;
  }
  </style>
  