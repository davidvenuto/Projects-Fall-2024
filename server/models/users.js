const fs = require('fs/promises');

const fileName = __dirname + '/../data/users.json';

/** @type { Promise< { items: User[] } > } */
const dataP = fs
        .access(fileName, fs.constants.F_OK)
        .then(() => fs.readFile(fileName, 'utf8'))
        .then(content => JSON.parse(content))


async function save() {
    const data = await dataP;
    return fs.writeFile(fileName, JSON.stringify(data, null, 2));
}

/**
 * @typedef {import('../../client/src/model/users').User} User
 * */

/**
 * @returns {Promise<User[]>}
 * */
// Return a promise of a list of all users
async function getAll() {
    const data = await dataP;
    return data.items.map(x=> ({
        ...x, password: undefined,
    }))
}

/**
 * @param {number} id
 * @returns {Promise<User>}
 * */
// Return a specific user by id
async function get(id) {
    const data = await dataP;
    return data.items.find(item => item.id == id);
}

/**
 * @param {string} q
 * @returns {Promise<User[]>}
 * */
// Search a user by a certain attribute
async function search(q) {
    return (await getAll()).filter(item => 
        new RegExp(q, 'i').test(item.name) ||
        new RegExp(q, 'i').test(item.email) ||
        new RegExp(q, 'i').test(item.gender) )
}

/**
 * @param {User} user
 * @returns {Promise<User>}
 * */
// Add a user
async function add(user) {
    const data = await dataP;
    user.id = data.items.length;
    data.items.push(user);
    console.log("2: About to save");
    
    await save()        
    console.log("3: Saved")

    console.log("4: About to return user");
    return user;
}

/**
 * @param {User} user
 * @returns {Promise<User>}
 * */
// Update an existing user
async function update(user) {
    const data = await dataP;
    const index = data.items.findIndex(item => item.id == user.id);
    if (index >= 0) {
        data.items[index] = {
            ...data.items[index],
            ...user
        };
        await save()
        return user;
    }
    return null;
}

/**
 * @param {number} id
 * @returns {Promise<User | null>}
 * */
// Remove a user
async function remove(id) {
    const data = await dataP;
    const index = data.items.findIndex(item => item.id == id);
    if (index >= 0) {
        const deleted = data.items.splice(index, 1);
        await save()
        return deleted[0];
    }
    return null;
}

module.exports = {
    getAll, get, search, add, update, remove
}