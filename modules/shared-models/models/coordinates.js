const {MongoSchema} = require('./../../../index');
const Coordinates = new MongoSchema('Coordinates', {
    type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: true
    }
}, {}, true);

Coordinates.fromObject = (coords) => {
    if(coords.lat && coords.lng)
        return new Coordinates({coordinates:[coords.lat, coords.lng]});
    if(coords.lat && coords.lon)
        return new Coordinates({coordinates:[coords.lat, coords.lon]});
    if(coords.latitude && coords.longitude)
        return new Coordinates({coordinates:[coords.latitude, coords.longitude]});
    throw new Error('Invalid coordinates object');
}

module.exports = Coordinates;
