import MongoSchema from "../../../lib/MongoSchema";
import { Document } from "mongoose";
export interface IUser extends Document {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    roles: Array<string>;
}
declare const User: MongoSchema<IUser>;
export default User;
//# sourceMappingURL=user.d.ts.map