const fetch = require('node-fetch');
const serviceRoot = 'https://services.odata.org/v4/TripPinServiceRW';

const queryEntitySet = `${serviceRoot}/People`;
const queryEntity = `${serviceRoot}/People('russellwhyte')`;
//const query = `${serviceRoot}/People?$top=2&$select=FirstName,LastName&$filter=Trips/any(d:d/Budget gt 3000)`;
const query = `${serviceRoot}/People('russellwhyte')/Trips(0)/Microsoft.OData.SampleService.Models.TripPin.GetInvolvedPeople()`;

// Json
fetch(query)
    .then(res => res.json())
    .then(json => console.log(json));

