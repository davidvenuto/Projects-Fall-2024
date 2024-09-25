<template>
    <div class="about-container">
      <div class="about-card">
        <div class="about-image">
          <h1>About This Project</h1>
        </div>
        <div class="about-content">
          <p>
            The goal of this project is to provide a tool that simplifies the process of creating finite automata graphs for students and teachers.
            This application addresses the need for an interactive, user-friendly platform where users can design and customize graphs through a drag-and-drop interface.
          </p>
          <p>
            By enabling the generation of XML and LaTeX code directly from the created graphs, the application streamlines the workflow for users who need to incorporate these graphs in academic settings, reducing the time required for such tasks.
            The tool is designed to enhance the educational experience by making graph creation more accessible and efficient.
          </p>
        </div>
      </div>
    </div>
  </template>
  

<script lang="ts">
export default {
    name: 'About',
};
</script>

<style scoped>
.about-container {
  display: flex;
  justify-content: center;
  padding: 50px 20px;
  background-color: #f0f4f8;
}

.about-card {
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.about-image {
  background-image: url('https://source.unsplash.com/collection/190727/800x200');
  background-size: cover;
  background-position: center;
  padding: 60px 20px;
  text-align: center;
}

.about-image h1 {
  color: #ffffff;
  font-size: 36px;
  margin: 0;
}

.about-content {
  padding: 20px;
}

.about-content p {
  color: #333;
  line-height: 1.6;
  margin-bottom: 16px;
}

.about-content button {
  background-color: #42b983;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.about-content button:hover {
  background-color: #369d72;
}
</style>
