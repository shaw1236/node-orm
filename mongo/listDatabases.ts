// Purpose: List databases
// Author : Simon Li
// Date   : April 16, 2020

'use strict';

import * as assert from 'assert';
import { Promise } from 'bluebird';
import * as mongo from 'mongodb';

const url = "mongodb://localhost:27017";

const getDatabases: Promise<object> = async () => {
	console.dir('Connect to mongoDb');
	let client = await mongo.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

	let db = client.db('admin');        
    let admin = db.admin();    	

    let data = await admin.listDatabases();
	client.close();
    
    /** 
 	  Check the total size
    console.log("Verify the size on disk");     
    let sizeOnDisk: number = 0;
    data.databases.map(ea => sizeOnDisk += ea.sizeOnDisk);
    assert.equal(data.totalSize, sizeOnDisk);
    */
 
    return data;
}
//getDatabases().then(res => console.log("\nResult", res))
//.catch(console.error)

let client = new mongo.MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect()
.then(client => client.db()) 
.then(db => db.admin())
.then(admin => admin.listDatabases())
.then(console.log)
.catch(console.error)
.finally(() => client.close())	
