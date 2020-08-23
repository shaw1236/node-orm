// Purpose: Mongo Service class
// Author : Simon Li
// Date   : Auguest 20, 2020

'use strict';

const mongo = require('mongodb');
const host = process.env.MONGO_HOST || "localhost";
const port = +process.env.MONGO_PORT || 27017;

const default_url = `mongodb://${host}:${port}`;
//console.log(default_url);

class MongoService {
    constructor(url) {
        this.url = url || default_url;

        this.__client = null;
        this.__isOpen = false;

	this.__client = new mongo.MongoClient(this.url, {useNewUrlParser: true, useUnifiedTopology: true});
        this.__client.connect().then(c => this.__isOpen = true)
        .catch(err => { 
            console.error(`cannot connect to the mongoDb via ${this.url}`);
            //console.error(err);
        })
    }
    
    // Return Promise<client>
    async connect() {
        if (!this.__isOpen) {
            this.__client.connect();
            this.__isOpen = true;	
        }
        return this.__client;
    }

    // return current Promise<client>
    getClient() {
        return this.__client;
    }

    // return a boolean value
    isOpen() {
        return this.__isOpen;
    }

    close() {
        if (this.__isOpen) {
	    this.__client.close();
            this.__client = null;   // force GC
            this.__isOpen = false;
        }
    }
    
    // Return Promise<object> or Promise<list> for name only
    async listDatabases(nameOnly = false) {
	let dbo   = this.__client.db();
	let admin = dbo.admin();
	let databaseObj = await admin.listDatabases();
        if (nameOnly) 
             return databaseObj.databases.map(ea => ea.name);
        else
             return databaseObj;
    }      

    // Return Promise<ArrayOfCollection>
    async listCollections(dbName = "mydatabase", nameOnly = true) {
	let dbo = this.__client.db(dbName);
        let collections = await	dbo.listCollections().toArray();
	
        if (nameOnly)
            return collections.map(ea => ea.name);
        else
            return collections;
    }

    // Return Promise<ArrayOfDocument>
    async listDocuments(dbName = "mydatabase", collectionName = "heroes", query = {}, projection = {_id:0, __v:0}) {
	let dbo = this.__client.db(dbName);
	let collection = dbo.collection(collectionName);
        
	let data = collection.find(query, { projection: projection }).toArray();
        return data;
    }
}

module.exports = MongoService;

if (require.main === module) {
    (async () => { 
        try {
       	    let monS = new MongoService("mongodb://127.0.0.1:27017");

            console.dir(monS.url);

    	    let res = await monS.listDatabases(true);
            console.log("Database", res);

            res = await monS.listCollections("mydatabase");
            console.log("Collections of db mydatabase", res);

            res = await monS.listDocuments();
	    console.log("Documents", res);

            monS.close();
        }
        catch(ex) {
            console.error(ex);
        }
    })();
}
