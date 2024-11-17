const fs = require('fs/promises');
const fileName = __dirname + '/../data/graphs.json';

// Helper function to load data
async function loadData() {
    try {
        const content = await fs.readFile(fileName, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // If file doesn't exist, return a default structure
            return { items: [] };
        }
        throw err;
    }
}

// Helper function to save data
async function saveData(data) {
    await fs.writeFile(fileName, JSON.stringify(data, null, 2));
}

async function getAll() {
    const data = await loadData();
    return data.items;
}

async function get(graphid) {
    const data = await loadData();
    return data.items.find(item => item.graphid == graphid);
}

async function add(graph) {
    const data = await loadData();
    const newGraph = {
      ...graph,
      graphid: data.items.length, // Generate a unique ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      userid: graph.userid, // Ensure userid is saved
    };
  
    data.items.push(newGraph);
    await saveData(data);
    return newGraph;
  }
  

async function update(graph) {
    const data = await loadData();
    const index = data.items.findIndex(item => item.graphid == graph.graphid);

    if (index >= 0) {
        data.items[index] = {
            ...data.items[index],
            ...graph,
            updated_at: new Date().toISOString(), // Update timestamp
        };
        await saveData(data);
        return data.items[index];
    }
    return null;
}

async function remove(graphid) {
    const data = await loadData();
    const index = data.items.findIndex(item => item.graphid == graphid);

    if (index >= 0) {
        const [deleted] = data.items.splice(index, 1);
        await saveData(data);
        return deleted;
    }
    return null;
}

async function getAllByUserId(userid) {
    const data = await loadData();
    return data.items.filter(item => item.userid == userid);
  }
  
  module.exports = {
    getAll,
    get,
    add,
    update,
    remove,
    getAllByUserId, // Export the new function
  };
  