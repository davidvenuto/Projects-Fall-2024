const users = require('../models/users')
const express = require('express');
const app = express.Router();

app
    .get('/', (req, res, next) => {
        users.getAll()
        .then(all => {
            const response = {
                data: all,
                totalCount: all.length,
                isSuccess: true,
            }
            res.send(response);
        }).catch(next);
    })

    .post('/', (req, res, next) => {
        const user = req.body;
        users.add(user)
        .then(result => {
            const response = {
                data: result,
                isSuccess: true,
            }
            res.send(response);
        }).catch(next);
    })

    .patch('/:id', (req, res, next) => {
        const user = req.body;
        user.id = req.params.id;
        users.update(user)
        .then(result => {
            const response = {
                data: result,
                isSuccess: true,
            }
            res.send(response);
        }).catch(next);
    })

    .delete('/:id', (req, res, next) => {
        const id = req.params.id;
        users.remove(+id)
        .then(result => {
            const response = {
                data: result,
                isSuccess: true,
            }
            res.send(response);
        }).catch(next);
    })

module.exports = app
