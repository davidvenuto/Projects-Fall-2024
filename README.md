# Projects-Fall-2024
This repository will serve as a workspace for my project during the Fall 2024 Semester.

# Project Proposal
We are proposing the development of a full-stack web application designed as a versatile
graph generator, suitable for creating various types of graphs ( non-finite automata, deterministic
finite automata, etc.) This application will incorporate a drag-and-drop interface that enables
users to interactively construct and customize graphs by manipulating nodes, edges, and loops.
For the development of this project, we plan to utilize a technology stack that includes Vue.js for
the frontend, Node.js for the backend, and SQL for database management. The app will include
several key features, including the ability for users to save their graphs in PNG or JPG format,
and to generate LaTeX code corresponding to each graph, using Python to convert from the
image to LaTex.

# Business Context
The business context for this project is to provide a tool that simplifies the process of creating finite automata graphs for students and teachers. This web application will address the need for an interactive, user-friendly platform where users can design and customize graphs through a drag-and-drop interface. By enabling the generation of XML and LaTeX code directly from the created graphs, the application will streamline the workflow for users who need to incorporate these graphs in academic settings, reducing the time required for such tasks. The tool will be designed to enhance the educational experience by making graph creation more accessible and efficient.

# INSTRUCTIONS FOR RUNNING THE APPLICATION ON YOUR MACHINE
1. Download Project Zip File
2. Unzip the Zip File
3. Open the unzipped file in Visual Studio (recommended)
4. cd into the project folder
5. Run the following commands:
  a. cd client
  a. npm install
  b. npm run build
  c. npm run dev
5. The project should start up on localhost:3000