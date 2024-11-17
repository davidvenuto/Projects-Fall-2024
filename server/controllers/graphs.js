const express = require('express');
const graphs = require('../models/graphs'); // Import the model
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const app = express.Router();

// GET all graphs
app.get('/', async (req, res, next) => {
    try {
        const all = await graphs.getAll();
        res.send({
            data: all,
            totalCount: all.length,
            isSuccess: true,
        });
    } catch (err) {
        next(err);
    }
});

// Add this route to handle GET /api/graphs/user
app.get('/user', async (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token
  
    if (!token) {
      return res.status(401).send({
        isSuccess: false,
        message: 'No token provided. Please log in again.',
      });
    }
  
    try {
      // Ensure the secret key matches the one used during token generation
      const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
  
      // Extract 'userid' from the token payload
      const userid = decoded.userid;
  
      if (!userid) {
        return res.status(401).send({
          isSuccess: false,
          message: 'Invalid token. User ID not found.',
        });
      }
  
      // Get all graphs for this user
      const userGraphs = await graphs.getAllByUserId(userid);
  
      res.send({
        data: userGraphs,
        isSuccess: true,
      });
    } catch (err) {
      console.error('Error in fetching user graphs:', err);
      res.status(500).send({
        isSuccess: false,
        message: 'Error fetching user graphs.',
      });
    }
  });
  

// POST (Add a new graph)
app.post('/', async (req, res, next) => {
    const { name, description, nodes, edges } = req.body;

    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).send({
            isSuccess: false,
            message: 'No token provided. Please log in again.',
        });
    }

    try {
// Ensure the secret key matches the one used during token generation
const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');

// Extract 'userid' from the token payload
const userid = decoded.userid;

if (!userid) {
  return res.status(401).send({
    isSuccess: false,
    message: 'Invalid token. User ID not found.',
  });
}

// Include 'userid' in the graph object
const graph = { name, description, nodes, edges, userid };


        // Validate the incoming data
        if (!name || !description || !Array.isArray(nodes) || !Array.isArray(edges)) {
            return res.status(400).send({
                isSuccess: false,
                message: 'Invalid graph data. Please include name, description, nodes, and edges.',
            });
        }

        const result = await graphs.add(graph);
        res.send({
            data: result,
            isSuccess: true,
        });
    } catch (err) {
        console.error('Error in saving graph:', err);
        res.status(500).send({
            isSuccess: false,
            message: 'Error saving graph.',
        });
    }
});

// PATCH (Update an existing graph)
app.patch('/:id', async (req, res, next) => {
    const graph = req.body;
    graph.graphid = +req.params.id;

    try {
        const result = await graphs.update(graph);
        if (result) {
            res.send({
                data: result,
                isSuccess: true,
            });
        } else {
            res.status(404).send({ isSuccess: false, message: 'Graph not found.' });
        }
    } catch (err) {
        next(err);
    }
});

// DELETE a graph by ID
app.delete('/:id', async (req, res, next) => {
    const id = +req.params.id;

    try {
        const result = await graphs.remove(id);
        if (result) {
            res.send({
                data: result,
                isSuccess: true,
            });
        } else {
            res.status(404).send({ isSuccess: false, message: 'Graph not found.' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = app;
