// Define the User type
export interface User {
    userid: number;
    fullname: string;
    email: string;
    username: string;
    password: string;
    isAdmin: boolean;
  }
  
  // Define the Node type
  export interface Node {
    nodeid: string;
    x: number;
    y: number;
  }
  
  // Define the Edge type
  export interface Edge {
    from_nodeid: string;
    to_nodeid: string;
  }
  
  // Define the Graph type
  export interface Graph {
    graphid: number;
    name: string;
    userid: number;
    description: string;
    created_at: string; // ISO 8601 string
    updated_at: string; // ISO 8601 string
    version: number;
    nodes: Node[];
    edges: Edge[];
  }
  