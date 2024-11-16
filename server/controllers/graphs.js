const express = require('express');
const graphs = require('../models/graphs'); // Import the model
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

// POST (Add a new graph)
app.post('/', async (req, res, next) => {
    const { name, description, nodes, edges } = req.body;

    if (!name || !description || !Array.isArray(nodes) || !Array.isArray(edges)) {
        return res.status(400).send({
            isSuccess: false,
            message: 'Invalid graph data. Please include name, description, nodes, and edges.',
        });
    }

    const graph = { name, description, nodes, edges };

    try {
        const result = await graphs.add(graph);
        res.send({
            data: result,
            isSuccess: true,
        });
    } catch (err) {
        next(err);
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
