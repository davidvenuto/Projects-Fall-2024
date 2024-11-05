const fs = require('fs/promises');

const fileName = __dirname + '/../data/users.json';

const dataP = fs
        .access(fileName, fs.constants.F_OK)
        .then(() => fs.readFile(fileName, 'utf8'))
        .then(content => JSON.parse(content))

async function save() {
    const data = await dataP;
    return fs.writeFile(fileName, JSON.stringify(data, null, 2));
}

async function getAll() {
    const data = await dataP;
    return data.items; // Return all user data, including passwords
  }  

async function get(userid) {
    const data = await dataP;
    return data.items.find(item => item.userid == userid);
}

async function search(q) {
    return (await getAll()).filter(item => 
        new RegExp(q, 'i').test(item.name) ||
        new RegExp(q, 'i').test(item.email) )
}

async function add(user) {
    const data = await dataP;
    user.userid = data.items.length;
    data.items.push(user);
    await save();
    return user;
  }
  

async function update(user) {
    const data = await dataP;
    const index = data.items.findIndex(item => item.id == user.userid);
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

async function remove(userid) {
    const data = await dataP;
    const index = data.items.findIndex(item => item.userid == userid);
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
