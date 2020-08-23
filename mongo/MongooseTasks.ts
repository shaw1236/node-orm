import {Promise} from 'bluebird';
import * as mongoose from 'mongoose';

const database: string = 'mydatabase';
mongoose.connect(`mongodb://localhost:27017/${database}`, {
  	useNewUrlParser: true,
  	useUnifiedTopology: true
})
.then(() => console.log("connected"))
.catch(err => console.error(err))

interface ITask {
	id: number,
    title: string,
    description: string,
    done: boolean,
}
    
const Schema = mongoose.Schema;
//console.log(Schema);
const ObjectId = Schema.ObjectId;
 
const Task = new Schema({
    id: {type: Number},
	title: {type: String},
    description: {type: String},
    done: { type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now },
    updatedAt: {type: Date},
});
const TaskModel = Promise.promisifyAll(mongoose.model("Task", Task));
//console.log(TaskModel);
    
async function query(): Promise<Array<object>> {
	let res = await TaskModel.findAsync({}, {_id: 0, __v: 0});
    //mongoose.connection.close();
    
    return res;
}

async function findOne(id: number): Promise<object> {
	let res = await TaskModel.findOneAsync({id: id}, {_id: 0, __v: 0});
    //mongoose.connection.close();
    
    return res;
}

async function deleteOne(id: number): Promise<object> {
	let res = await TaskModel.deleteOneAsync({id: id});
    //mongoose.connection.close();
    
    return res;
}

async function create(task: ITask): Promise<object> {
    let count: number = await TaskModel.countDocumentsAsync();
    //console.log(count);
    task["id"]  = count + 1;
	let res = await TaskModel.createAsync(task)

    //mongoose.connection.close();
    
    return res;
}

async function updateOne(task: ITask): Promise<object> {
    let {id, title, description, done}  = task;
    let update = {title, description, done}
    update["updatedAt"] = Date.now();
   
	let res = await TaskModel.updateOneAsync({id: id}, {$set: update})

    //mongoose.connection.close();
    
    return res;
}

Promise.all([
	//create({id: -Infinity, title: "will be deleted", description: "No use", done: false}),
	//updateOne({id: 5, title: "will be deleted", description: "update", done: true}),
	//deleteOne(5),
	//findOne(4),
	query(),
])
.then(results => results.map(ea => console.log(ea)))
.finally(() => mongoose.connection.close());


