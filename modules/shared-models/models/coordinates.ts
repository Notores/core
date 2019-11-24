import MongoSchema from "../../../lib/MongoSchema/MongoSchema";
import {Document} from "mongoose";

const mongoose = require('mongoose');

export interface ICoordinates extends Document {
    type: 'Point',
    coordinates: [number,number],
}

export interface CoordTypeLatLng {
    lat: number,
    lng: number
}
export interface CoordTypeLatLon {
    lat: number,
    lon: number
}
export interface CoordTypeLatitudeLongitude {
    latitude: number,
    longitude: number
}


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
    timestamps: {createdAt: 'createdOn', updatedAt: 'updatedOn'}
});

const Coordinates = new MongoSchema<ICoordinates>('Coordinates', CoordinatesSchema);
Coordinates.statics.fromObject = (coords : Partial<CoordTypeLatLng & CoordTypeLatLon & CoordTypeLatitudeLongitude>) => {
    if(Coordinates.model){ //Makes TS compiler happy, because Coordinates.model can be undefined because of the deleteModel function
        if(coords.lat && coords.lng)
            return new Coordinates.model({coordinates:[coords.lat, coords.lng]});
        if(coords.lat && coords.lon)
            return new Coordinates.model({coordinates:[coords.lat, coords.lon]});
        if(coords.latitude && coords.longitude)
            return new Coordinates.model({coordinates:[coords.latitude, coords.longitude]});
    }
    throw new Error('Invalid coordinates object');
};

Coordinates.loadModel();
export default Coordinates;
module.exports = Coordinates;
