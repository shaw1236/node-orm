const fetch = require('node-fetch');
/*
If you are using a Promise library other than native, set it through fetch.Promise:
*/
const Bluebird = require('bluebird'); 
fetch.Promise = Bluebird;

const session = "(S(haxn5bsmvbpkobd2f01jgbcd))";
const serviceHost = 'services.odata.org';
const servicePath = `/v4/${session}/TripPinServiceRW/`;
const newPerson = {
    UserName:'lewisblack',
    FirstName:'Lewis',
    LastName:'Black',
    Emails:[
        'lewisblack@example.com'
    ],
    AddressInfo:[
        {
            Address: '187 Suffolk Ln.',
            City: {
			CountryRegion: 'United States',
			Name: 'Boise',
			Region: 'ID'
            }
        }
    ],
    Gender: 'Male'
};

fetch(`https://${serviceHost}/${servicePath}/People`, {
        method: 'POST',
        body:    JSON.stringify(newPerson),
        headers: {'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(json => {
	console.log(json);
    });

