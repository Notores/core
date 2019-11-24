"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../../../index");
const mongoose_1 = require("mongoose");
const coordinates_1 = __importDefault(require("./coordinates"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const MongoSchema_1 = __importDefault(require("../../../lib/MongoSchema"));
const config = index_1.getConfig();
const AddressSchema = new mongoose_1.Schema({
    street: { type: String, required: false },
    number: { type: String, required: false },
    postalCode: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    coordinates: { type: coordinates_1.default, required: false }
}, {
    minimize: false,
    strict: false,
    timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }
});
if (config.main && config.main.google && config.main.google.addressRequiresCoordinates) {
    const pre = async function () {
        const address = this;
        if (!address.coordinates || !address.coordinates.coordinates || !address.coordinates.coordinates.length) {
            const request = await node_fetch_1.default(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address.street)}+${encodeURI(address.number)}+${encodeURI(address.postalCode)}+${encodeURI(address.city)}&key=${config.main.google.apiKey}`);
            const response = await request.json();
            if (response && response.results && response.results.length) {
                //Makes TS compiler happy, because Coordinates.model can be undefined because of the deleteModel function
                if (coordinates_1.default.model) {
                    // @ts-ignore
                    address.coordinates = coordinates_1.default.model.fromObject(response.results[0].geometry.location);
                }
            }
        }
    };
    AddressSchema.pre('save', pre);
}
const Address = new MongoSchema_1.default('Address', AddressSchema);
module.exports = Address;
