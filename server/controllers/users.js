// The Controller acts as intermediary between model and client. For web app, the controller is responsible for:
// Receiving and handling requests from the client 
// Calling methods in the model to retrieve data or execute operations
// Formatting and sending responses back to the client
const users = require('../models/users')
const express = require('express');
const app = express.Router();

/** 
 * @typedef {import('../../client/src/model/users').User} User 
 * // Data Envelope helps standardize the format of all respones from the API
 * @typedef {import('../../client/src/model/transportTypes').DataEnvelope<User> } UserDataEnvelope
 * @typedef {import('../../client/src/model/transportTypes').DataListEnvelope<User> } UserDataListEnvelope
 * */

app
    // Retrieve a list of all users by calling the "getAll" method
    .get('/', (req, res, next) => {
        users.getAll()
        .then(all => {
            /** @type { UserDataListEnvelope } */
            const response = {
                data: all,
                totalCount: all.length,
                isSuccess: true,
            }
            res.send(response);
        }).catch(next);
        
    })

    // Search the list of users by their attribute, see users.js in model folder for specific 
    .get('/search', (req, res, next) => {

        const search = req.query.q;
        if(typeof search !== 'string' ) throw new Error('search is required');
        users.search(search)
        .then(result => {
            /** @type { UserDataListEnvelope } */
            const response = {
                data: result,
                totalCount: result.length,
                isSuccess: true,
            }
            res.send(response);
        }).catch(next);
    })

    // Ensure this is correctly defined in your controller
app.get('/search', (req, res, next) => {
    const search = req.query.q;
    if (typeof search !== 'string') throw new Error('search is required');
    users.search(search)
      .then(result => {
        const response = {
          data: result,
          totalCount: result.length,
          isSuccess: true,
        };
        res.json(response); // Ensure this sends a JSON response
      }).catch(next);
  })

    // Search for a specific user by id
    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        users.get(+id)
        .then(result => {
            /** @type { UserDataEnvelope } */
            const response = {
                data: result,
                isSuccess: true,
            }
            res.send(response);
        }).catch(next);
    })

    // Add a new user to the data
    .post('/', (req, res, next) => {
        const user = req.body;
        users.add(user)
        .then(result => {
            /** @type { UserDataEnvelope } */
            const response = {
                data: result,
                isSuccess: true,
            }
            res.send(response);
        }).catch(next);
    })

    // Used to make partial updates to an existing piece of data
    .patch('/:id', (req, res, next) => {
        const user = req.body;
        user.id = req.params.id;
        users.update(user)
        .then(result => {
            /** @type { UserDataEnvelope } */
            const response = {
                data: result,
                isSuccess: true,
            }

            res.send(response);
        }).catch(next);
    })

    // Delete a user
    .delete('/:id', (req, res, next) => {
        const id = req.params.id;
        users.remove(+id)
        .then(result => {
            /** @type { UserDataEnvelope } */
            const response = {
                data: result,
                isSuccess: true,
            }
            res.send(response);
        }).catch(next);
    })

module.exports = app