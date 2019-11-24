"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoSchema_1 = __importDefault(require("../../../lib/MongoSchema/MongoSchema"));
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
    timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }
});
const Coordinates = new MongoSchema_1.default('Coordinates', CoordinatesSchema);
Coordinates.statics.fromObject = (coords) => {
    if (Coordinates.model) { //Makes TS compiler happy, because Coordinates.model can be undefined because of the deleteModel function
        if (coords.lat && coords.lng)
            return new Coordinates.model({ coordinates: [coords.lat, coords.lng] });
        if (coords.lat && coords.lon)
            return new Coordinates.model({ coordinates: [coords.lat, coords.lon] });
        if (coords.latitude && coords.longitude)
            return new Coordinates.model({ coordinates: [coords.latitude, coords.longitude] });
    }
    throw new Error('Invalid coordinates object');
};
Coordinates.loadModel();
exports.default = Coordinates;
module.exports = Coordinates;
