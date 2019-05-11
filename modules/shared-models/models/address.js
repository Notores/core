const {MongoSchema} = require('./../../../index');

const Address = new MongoSchema('Address', {
    street: {type: String, required: false},
    number: {type: String, required: false},
    postalCode: {type: String, required: false},
    city: {type: String, required: false},
    country: {type: String, required: true}
}, {}, true);

module.exports = Address;
