// https://www.glassdoor.ca/Job/toronto-full-stack-engineer-jobs-SRCH_IL.0,7_IC2281069_KO8,27.htm?fromAge=7&jl=3606982922&ja=129964702&guid=00000172e133170d8b3faa35d725611a&pos=106&srs=EMAIL_JOB_ALERT&s=224&ao=389273&utm_source=jobalert&utm_medium=email&utm_campaign=jobAlertAlert&utm_content=ja-jobtitle&utm_term=
const fetch = require('node-fetch');
const assert = require('assert');
const Promise = require('bluebird');
fetch.Promise = Promise;   // Use bluebird's promise instead of the native promise

const snacker_data_uri = 'https://s3.amazonaws.com/misc-file-snack/MOCK_SNACKER_DATA.json';
const our_products_uri = 'https://ca.desknibbles.com/products.json?limit=250';
//const our_products_uri = 'https://ca.desknibbles.com/products.json';

// Get a promise with json formatted data from the provided URI
async function getDataFromUri(url) {
   let res = await fetch(url);
   let json = await res.json();   
   return json;
}

// Promise.join(promise1, promise2, function(res1, res2) {..}).then(function(res) {}) 
Promise.join(getDataFromUri(snacker_data_uri), getDataFromUri(our_products_uri), (res1, res2) => {
    console.info("== Data validation and preparation - started ==");
 
    /**
	   The first returned is an array for snacker list
    */
 	let snackers = res1;
    assert(Array.isArray(snackers), 'snackers is not a list');
    
    /**
       The second returned is an object containing an attribute "products"
    */
    if (typeof res2 !== "object" || !res2.hasOwnProperty("products"))
       throw new "Wrong data format for our products";
    
	let products = res2["products"];
    assert(Array.isArray(products), 'data["products"] is not a list');    
    
    let avail_products = [];	
    products.filter(p => p.hasOwnProperty("variants") && Array.isArray(p["variants"]))
    .map(product => {
        product["variants"].filter(v => v.available)
		.forEach(v => avail_products.push({
                                          	"product_type": product.product_type,
                                           	"price": Number(v.price)
						}))
    });

    console.info("== Data validation and preparation - passed ==");
    return [snackers, avail_products];  // return a promise with two list
}).then(resultSet => {
    console.info("== Data processing - started ==");

    const [snackers, products] = resultSet;  
    /**
       Two lists: snackers & products
    */
    /*
      a) List the real stocked snacks you found under the snacker's 'fave_snack'?	
      b) What're the emails of the snackers who listed those as a 'fave_snack'?
      c) If all those snackers we're to pay for their 'fave_snack'what's the total price?
    */

    // Find all emails of snackers with a 'fave_snack'of a product we stock:
    //snackers.map(snacker => console.log(snacker.email));
    let totalPrice = 0.0;
    snackers.map(snacker => { // checking each snacker 
	let l_products = products.filter(p => p.product_type === snacker.fave_snack);
        l_products.map(p => totalPrice += p.price);
        if (l_products.length > 0) { // find
            console.log("Stocked snack: " + snacker.fave_snack);
            console.log("email: " + snacker.email);
	}	
    });
 
    if (totalPrice > 0) {
        let factor = 10 ** 2;  // round to 2 decimals
	let totalPriceFinal = Math.round(totalPrice * factor) / factor; 
    	console.log("Total price: " + totalPriceFinal);
    }

    console.info("== Data processing - completed ==");
})
//.catch(err => console.error(err.errmsg))
.finally(() => console.dir("Done"));
