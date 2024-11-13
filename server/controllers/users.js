const users = require('../models/users');
const express = require('express');
const jwt = require('jsonwebtoken');
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

    app.post('/login', (req, res, next) => {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
    
        users.getAll()
            .then(all => {
                const user = all.find(u => u.email === email && u.password === password);
                if (user) {
                    // Generate JWT token
                    const token = jwt.sign({ userId: user.id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
                    
                    // Return response in the required format
                    res.json({
                        success: true,
                        token: token,
                        user: {
                            username: user.username  // Assuming `user.username` exists
                        }
                    });
                } else {
                    res.status(401).json({ success: false, message: 'Invalid email or password' });
                }
            })
            .catch(next);
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

module.exports = app;