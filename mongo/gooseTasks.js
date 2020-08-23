const Promise = require('bluebird');
const mongoose = require('mongoose');

const database = 'mydatabase';
mongoose.connect(`mongodb://localhost:27017/${database}`, {
  	useNewUrlParser: true,
  	useUnifiedTopology: true
})
.then(() => console.log("connected"))
.catch(err => console.error(err))

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
    
async function test1() {
	let res = await myModel.create({title: "Test blog", body: "Test body"});
	console.log(res);
//myModel.findOne({title: "Test blog"}).then(console.log)
    await mongoose.connection.close();
}

async function query() {
	let res = await TaskModel.findAsync({}, {_id: 0, __v: 0});
    mongoose.connection.close();
    
    return res;
}

async function findOne(id) {
	let res = await TaskModel.findOneAsync({id: id}, {_id: 0, __v: 0});
    mongoose.connection.close();
    
    return res;
}

async function deleteOne(id) {
	let res = await TaskModel.deleteOneAsync({id: id});
    mongoose.connection.close();
    
    return res;
}

async function create(task) {
    let count = await TaskModel.countAsync();
    //console.log(count);
    task["id"]  = count + 1;
	let res = await TaskModel.createAsync(task)

    mongoose.connection.close();
    
    return res;
}

async function updateOne(task) {
    let {id}  = task;
    task["updatedAt"] = Date.now();
    delete task.id;
   
	let res = await TaskModel.updateOneAsync({id: 4}, {$set: task})

    mongoose.connection.close();
    
    return res;
}

//create().then(console.log)
//update().then(console.log)
//query().then(console.log)
findOne(4).then(console.log)
