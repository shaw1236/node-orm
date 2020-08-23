// Purpose: List collections
// Author : Simon Li
// Date   : April 16, 2020

'use strict';

import * as assert from 'assert';
import { Promise } from 'bluebird';
import * as mongo from 'mongodb';

const url = "mongodb://localhost:27017";

const getCollections: Promise<string[]> = async (dbName = 'test') => {
    let client = null, res: Array<string>;
    console.log("Database:", dbName);

    try {
		console.dir('Connect to mongoDb');
		client = await mongo.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    	
		let dbo = client.db(dbName);
        let data = await dbo.listCollections().toArray();
        //let data = await dbo.listCollections({name: "dummy"}).toArray();
	    client.close();
        client = null;
        res = data.map(ea => ea.name);
    }
    catch(ex) {
		if (client)
		    client.close();

        throw ex;
    }

    return res;
}
//getCollections("mydatabase").then(res => console.log("\nResult", res))
//.catch(console.error)

let dbName = 'mydatabase';
let client = new mongo.MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect()
.then(client => client.db(dbName))
.then(dbo => dbo.listCollections().toArray())
.then(arr1 => arr1.map(ea => ea.name))
.then(console.log)
.catch(console.error)
.finally(() => client.close())
