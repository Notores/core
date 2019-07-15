const {MongoSchema, getConfig} = require('./../../../index');
const {Schema} = require('mongoose');
const Coordinates = require('./coordinates');
const config = getConfig();
const fetch = require('node-fetch');

const AddressSchema = new Schema({
    street: {type: String, required: false},
    number: {type: String, required: false},
    postalCode: {type: String, required: false},
    city: {type: String, required: false},
    country: {type: String, required: false},
    coordinates: {type: Coordinates, required: false}
}, {
    minimize: false,
    strict: false,
    timestamps: {createdOn: 'createdOn', updatedOn: 'updatedOn'}
});

if(config.main && config.main.google && config.main.google.addressRequiresCoordinates){
    const pre = async function() {
        const address = this;
        if(!address.coordinates || !address.coordinates.coordinates || !address.coordinates.coordinates.length){
            const request = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address.street)}+${encodeURI(address.number)}+${encodeURI(address.postalCode)}+${encodeURI(address.city)}&key=${config.main.google.apiKey}`);
            const response = await request.json();
            address.coordinates = Coordinates.model.fromObject(response.results[0].geometry.location);
        }
    };
    AddressSchema.pre('save', pre);
}

const Address = new MongoSchema('Address', AddressSchema);

module.exports = Address;
