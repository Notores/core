const {MongoSchema} = require('./../../../index');
const mongoose = require('mongoose');

const CoordinatesSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
    },
    coordinates: {
        type: [Number]
    }
}, {
    minimize: false,
    strict: false,
    timestamps: {createdOn: 'createdOn', updatedOn: 'updatedOn'}
});

const Coordinates = new MongoSchema('Coordinates', CoordinatesSchema);
Coordinates.statics.fromObject = (coords) => {
    if(coords.lat && coords.lng)
        return new Coordinates.model({coordinates:[coords.lat, coords.lng]});
    if(coords.lat && coords.lon)
        return new Coordinates.model({coordinates:[coords.lat, coords.lon]});
    if(coords.latitude && coords.longitude)
        return new Coordinates.model({coordinates:[coords.latitude, coords.longitude]});
    throw new Error('Invalid coordinates object');
};
Coordinates.loadModel();
module.exports = Coordinates;
