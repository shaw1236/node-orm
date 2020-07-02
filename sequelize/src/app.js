// Node/Sequelize Service for tasks 
//
// Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, 
// SQLite and Microsoft SQL Server.
'use strict';

import {Promise} from "bluebird";
import Model from "./model/taskModel";

function initilize() {
    const tasks = [
        {
            'title': 'Buy groceries',
            'description': 'Milk, Cheese, Pizza, Fruit, Tylenol', 
            'done': false
        },
        {
            'title': 'Learn Python',
            'description': 'Need to find a good Python tutorial on the web', 
            'done': false
        },
        {
            "title": "Use flask",
            "description": "Use flask to build RESTful service",
            "done": true
        },
        {
            "title": "Learn OData",
            "description": "Learn OData to build Restful APIU",
            "done": false
        } 
    ];

    Model.sync({force: true})
    .then(() => Promise.map(tasks, task => Model.create(task)))
    .then(results => console.log(results.map(ea => ea.dataValues))) 
    .catch(err => console.error(err))
    .finally(() => console.log("done"));
}

async function getAll() {
    //await Model.sync();
    let result = await Model.findAll({});
    return result.map(ea => ea.dataValues);
}

// Get a task per id (GET)
async function get(id) {
    //await Model.sync();
    let result = await Model.findOne({ where: { id: id } });
    return result? result.dataValues : null;
}

// Insert a task (POST)
async function post(data) {
    //await Model.sync();
    // a document instance
    data["done"] = false;
    try {
	    let result = await Model.create(data);
        return result.dataValues;  // record
    }
    catch(ex) {
        return null;
    }
}

// Update the task (PUT)
async function put(data) {
   	//await Model.sync();
   	let updateSet = {};
   	if (data.hasOwnProperty("title"))
    	updateSet["title"] = data["title"];

   	if (data.hasOwnProperty("description"))
       	updateSet["description"] = data["description"];

   	if (data.hasOwnProperty("done"))
       	updateSet["done"] = data["done"]
      
	let result = await Model.update(updateSet, {where: {id: data.id}});
    return result;  // true - updated, false - no update
}

// Delete a task (DELETE)
async function deleteit(id) {
    //await Model.sync();

    let result = await Model.destroy({where: {id: id}});
    return result;  // true - deleted, false - no deletion
}

//initilize();
getAll().then(result => console.log(result))
//get(10).then(result => console.log(result))
//post({title: "New Book", description: "very funny"}).then(result => console.log(result))
//put({id: 6, title: "New Book Again", description: "very funny"}).then(result => console.log(result))
//deleteit(6).then(result => console.log(result))
//.catch(err => console.error(err))
