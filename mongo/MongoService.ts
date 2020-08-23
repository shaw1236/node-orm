// Purpose: Mongo Service class
// Author : Simon Li
// Date   : Auguest 20, 2020

'use strict';

import * as mongo from 'mongodb';
const host: string = process.env.MONGO_HOST || "localhost";
const port: number = +process.env.MONGO_PORT || 27017;

const default_url: string = `mongodb://${host}:${port}`;
//console.log(default_url);

export default class MongoService {
    readonly url: string;
    private client: any = null;
    private _isOpen: boolean = false;

    constructor(url: string) {
        this.url = url || default_url;

	    this.client = new mongo.MongoClient(this.url, {useNewUrlParser: true, useUnifiedTopology: true});
        this.client.connect().then(c => this._isOpen = true)
        .catch(err => { 
             this._isOpen = false;
			 console.error(`cannot connect to the mongoDb via ${this.url}`);
             //console.error(err);
        })
    }
    
    // Return Promise<client>
    async connect(): Promise<object> {
        if (!this.isOpen) {
            this.client.connect();
            this._isOpen = true;	
        }
        return this.client;
    }

    // return current Promise<client>
    getClient(): Promise<object> {
        return this.client;
    }

    // return a boolean value
    isConnection(): boolean {
        return this._isOpen;
    }

	// return a boolean value
    isOpen(): boolean {
        return this._isOpen;
    }

    close(): void {
        if (this._isOpen) {
	    	this.client.close();
            this.client = null;   // force GC
            this._isOpen = false;
        }
    }
    
    // Return Promise<object> or Promise<list> for name only
    async listDatabases(nameOnly: boolean = false): Promise<object|Array<object>> {
	    let dbo   = this.client.db();
	    let admin = dbo.admin();
	    let databaseObj = await admin.listDatabases();
        if (nameOnly) 
             return databaseObj.databases.map(ea => ea.name);
        else
             return databaseObj;
    }      

    // Return Promise<ArrayOfCollection>
    async listCollections(dbName: string = "mydatabase", nameOnly: boolean = true): Promise<any[]> {
	    let dbo = this.client.db(dbName);
        let collections = await	dbo.listCollections().toArray();
	
        if (nameOnly)
            return collections.map(ea => ea.name);
        else
            return collections;
    }

    // Return Promise<ArrayOfDocument>
    async listDocuments(dbName: string = "mydatabase", collectionName: string = "heroes", query: object = {}, 
        projection: object = {_id:0, __v:0}): Promise<Array<object>> {
	    let dbo = this.client.db(dbName);
	    let collection = dbo.collection(collectionName);
        
	    let data = collection.find(query, { projection: projection }).toArray();
        return data;
    }
}

if (require.main === module) {
    (async () => { 
        try {
       	    let monS: MongoService = new MongoService("mongodb://127.0.0.1:27017");

            console.dir(monS.url);

    	    let res: any = await monS.listDatabases();
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
