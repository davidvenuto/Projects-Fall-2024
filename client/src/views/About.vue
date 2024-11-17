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
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Open+Sans&display=swap');

/* Container Styling */
.about-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

/* Card Styling */
.about-card {
  max-width: 900px;
  background-color: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Image Section */
.about-image {
  background-image: url('https://source.unsplash.com/collection/190727/900x300');
  background-size: cover;
  background-position: center;
  padding: 80px 20px;
  text-align: center;
  position: relative;
}

.about-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
}

.about-image h1 {
  position: relative;
  color: #ffffff;
  font-size: 48px;
  margin: 0;
  z-index: 1;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: fadeInDown 1s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Content Section */
.about-content {
  padding: 40px 30px;
}

.about-content p {
  color: #555;
  line-height: 1.8;
  margin-bottom: 24px;
  font-size: 18px;
  font-family: 'Open Sans', sans-serif;
}

.about-content p:first-letter {
  font-size: 30px;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 8px;
  color: #379eff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .about-card {
    margin: 20px;
  }

  .about-image h1 {
    font-size: 36px;
  }

  .about-content {
    padding: 30px 20px;
  }

  .about-content p {
    font-size: 16px;
  }
}
</style>
