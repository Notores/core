import { Document } from "mongoose";
import { ICoordinates } from "./coordinates";
export interface IAddress extends Document {
    street: string;
    number: string;
    postalCode: string;
    city: string;
    country: string;
    coordinates: ICoordinates;
}
//# sourceMappingURL=address.d.ts.map