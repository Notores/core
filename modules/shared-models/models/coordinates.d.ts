import MongoSchema from "../../../lib/MongoSchema/MongoSchema";
import { Document } from "mongoose";
export interface ICoordinates extends Document {
    type: 'Point';
    coordinates: [number, number];
}
export interface CoordTypeLatLng {
    lat: number;
    lng: number;
}
export interface CoordTypeLatLon {
    lat: number;
    lon: number;
}
export interface CoordTypeLatitudeLongitude {
    latitude: number;
    longitude: number;
}
declare const Coordinates: MongoSchema<ICoordinates>;
export default Coordinates;
//# sourceMappingURL=coordinates.d.ts.map