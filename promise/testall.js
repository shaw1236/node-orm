const assert = require('assert');
const Promise = require('bluebird');
//import {Promise} from 'bluebird';

// Promise.promisify -- callback => then/catch
// Promise.promififyAll -- whole package

const call = require('./mycallback');

const add = Promise.promisify(call.add); 
const mul = Promise.promisify(call.mul); 
const sign = Promise.promisify(call.sign); 

Promise.resolve(console.log("Test"));

console.info("Promisify Each");

add(10, 23).then(result => {
    console.log(result);
})
.catch(err => console.error(err))

mul(10, 23).then(result => {
    console.log(result);
})
.catch(err => console.error(err))

sign(-Infinity).then(res => {
    console.log(res);
})
.catch(err => console.error(err))

console.info("Test Promise.map");
// Promise.map([...], function(ea) { return a promise(ea) })
Promise.map([1, -3, 4, -6, Infinity], num => {
    return sign(num + 10);
}).then(results => {
	console.log(results);
    console.info("Done with Promise.map");
})
.catch(err => console.log(err))
 
// A promise list 
const list = [add(23, 12), mul(2, 5), sign(-200), add(-10, 10)];
 
console.info("Test Promise.join"); // all listed promises all resovled
// Promise.join(promise1, promise2, ..., promise).then([result1, result2, ..., result] => {})  
Promise.join(list[0], list[1], list[2], (res1, res2, res3) => res1 + res2 + res3)
.then(v => v + 55)
.then(result => { // just for demo
   console.log(result);
   console.info("Done with Promise.join"); 	
},
err => {
   console.log(err)
})

console.info("Test Promise.all");
Promise.all(list.slice(1)).then(results => {
   console.log(results);
   console.info("Done with Promise.all"); 	
})

console.info("Test Promise.allSettled"); 
const promise1 = Promise.resolve(3); 
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo')); 
const promises = [promise1, promise2]; 
Promise.allSettled(promises).
  then(results => {
	  results.forEach(ea => {
         if (ea.isFulfilled())
	         console.log(ea.value());
         else
             console.log(ea.reason());
    })
});

console.log(list); 
Promise.allSettled(list).then(results => { 
	//console.log(results);
    results.map(ea => {
        if (ea.isFulfilled())
            console.log(ea.value());
        else
            console.log(ea.reason());
	})
    console.info("Done with Promise.allSettled"); 	
},
err => {
   console.log(err)
})

console.info("Test Promise.race");
Promise.race(list.slice(0)).then(result => {
   console.log(result);
   console.info("Done with Promise.race"); 	
},
err => {
   console.log(err)
})

console.info("Test Promise.any");
Promise.any(list.slice(0)).then(result => {
   console.log(result);
   console.info("Done with Promise.any"); 	
})

// Test Promise.resolve
Promise.resolve(mul(100, 20)).
//Promise.resolve(1200).
then(value => add(100, value))
.then(res => {
    console.log("2100: " + res); 
	console.log("test with Promise.resolve")
})

Promise.resolve(add(1000, 2000)).then(val => console.log(val));
Promise.resolve(list.slice(1,2).length > 2? -1000 : 20000).then(val=> val + 400).then(val => console.log(val));
Promise.resolve(Promise.resolve([-1000, 20, 1, 2])).then(val => Object.values(val)[0] + 1).then(val => val + 2).then(val=>val+100).then(val => console.log(val));
mysub(200, 10).then(val => console.log("mysub: " + val));
myex(1, 2).then(v => v).then(v => console.log("dummy"))
.catch(err => console.error(err))

function mysub(a, b) {
    return new Promise(resolve => resolve(a - b))
}
	
function myex(a, b) {
	return new Promise((_, reject) => reject("Error on purpose"))
}


/*
console.info("{PromisifyAll");
delete call.addAsync;   // This function is already promisified, has to be removed
const callA = Promise.promisifyAll(call);

callA.add(-10, -23).then(result => {
    console.log("-10 + -23 = " + result);
})
.catch(err => console.error(err))

callA.mul(-10, 23).then(result => {
    console.log("-10 * 23 = " + result);
})
.catch(err => console.error(err))

callA.sign(-Infinity).then(res => {
    console.log(res);
})
.catch(err => console.error(err))
*/

/** Conclusion
  Promise.promisifyAll(module) => convert functions with callback() to promise functions, one shot
  Promise.promisify(a function with callback) => a promise function can be ".then", each function

  Promise.resolve(value, promise) => a promise with the value passed by, chained 
  Promise.reject(error, promise).catch()

  Promise.all(listOfPromises).then(function(listOfResults){}), all fulfilled together
  Promise.any(listOfPromises).then(function(firstResult){}), one of list fulfilled
  Promise.allSettled(listOfPromises).then(function(listOfResults){}), all resolved together (fulfilled or rejected)
  Promise.race(listOfPromises).then(function(firstResult){}), one of list resolved(fullfilled or rejected)
  Promise.join(prom1, prom2, ..., prom, function(res1, res2, ..., res){}.then((result => {}}

  Promise.map(listOfData, function(each) {return a promise}).then(function(listOfResults){}) 
  Promise.each -> forEach
  Promise.reduce -> [].reduce((a, b) => ...)

  return new Promise(function(resolve, reject) {resolve(res) for ".then", reject(err) for ".catch"})
  async, await

  nodejs: callback/event handler, concurrent process, single thread, Chrome V8
  promise: strean, pipe, chain execution, resolve
*/
