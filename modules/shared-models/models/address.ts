import {getConfig} from "./../../../index";
import {Document, Schema} from "mongoose";
import Coordinates, {ICoordinates} from "./coordinates";
import fetch from "node-fetch";
import MongoSchema from "../../../lib/MongoSchema";
const config = getConfig();


export interface IAddress extends Document {
    street: string,
    number: string,
    postalCode: string,
    city: string,
    country: string,
    coordinates: ICoordinates,
}

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
    timestamps: {createdAt: 'createdOn', updatedAt: 'updatedOn'}
});

if(config.main && config.main.google && config.main.google.addressRequiresCoordinates){
    const pre = async function(this: IAddress) {
        const address : IAddress = this;
        if(!address.coordinates || !address.coordinates.coordinates || !address.coordinates.coordinates.length){
            const request = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address.street)}+${encodeURI(address.number)}+${encodeURI(address.postalCode)}+${encodeURI(address.city)}&key=${config.main.google.apiKey}`);
            const response = await request.json();
            if(response && response.results && response.results.length){
                //Makes TS compiler happy, because Coordinates.model can be undefined because of the deleteModel function
                if(Coordinates.model) {
                    // @ts-ignore
                    address.coordinates = Coordinates.model.fromObject(response.results[0].geometry.location);
                }
            }

        }
    };
    AddressSchema.pre('save', pre);
}

const Address = new MongoSchema<IAddress>('Address', AddressSchema);

module.exports = Address;
