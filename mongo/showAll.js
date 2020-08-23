// Purpose: List databases/collections/documents
// Author : Simon Li
// Date   : April 16, 2020

'use strict';

const mongo = require('mongodb');
const host = process.env.MONGO_HOST || "localhost";
const port = +process.env.MONGO_PORT || 27017;

const url = `mongodb://${host}:${port}`;
console.log(url);

module.exports.list1 = function(dbName = 'mydatabase', collectionName = 'tasks') {
	let client = new mongo.MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
	client.connect()
	.then(client => client.db())
	.then(dbo => dbo.admin())
	.then(admin => admin.listDatabases())
	.then(res => console.log("Database", res))
	.catch(console.error)
	.finally(() => client.close())

	let client2 = new mongo.MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
	client2.connect()
	.then(client => client.db(dbName))
	.then(dbo => dbo.listCollections().toArray())
	.then(arr1 => arr1.map(ea => ea.name))
	.then(res => console.log(`Collections of db ${dbName}`, res))
	.catch(console.error)
	.finally(() => client2.close())

	let client3 = new mongo.MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
	client3.connect()
	.then(client => client.db(dbName))
	.then(dbo => dbo.collection(collectionName))
	.then(collection => collection.find({}, {projection: {_id:0, __v:0}}).toArray())
	.then(res => console.log(`Documents of collection ${collectionName} on db ${dbName}`, res))
	.catch(console.error)
	.finally(() => client3.close());
}

module.exports.list2 = function(dbName = 'mydatabase', collectionName = 'tasks') {
	let client = new mongo.MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
	client.connect()
	.then(client => {
		let dbo = client.db(dbName);
		//let dbo = client.db();		
		let admin = dbo.admin();
		admin.listDatabases().then(res => console.log("Database", res))
		.catch(console.error)
    
	    dbo.listCollections().toArray()
		.then(arr => arr.map(ea => ea.name))
		.then(res => console.log(`Collections of db ${dbName}`, res))
		.catch(console.error)

		let collection = dbo.collection(collectionName);
		collection.find({}, {projection: {_id:0, __v:0}}).toArray()
		.then(res => console.log(`Documents of collection ${collectionName} on db ${dbName}`, res))
		.catch(console.error)
	})
	.catch(console.error)
	.finally(() => client.close());
}

if (require.main === module) {
	//this.list1();
	this.list2();
}
