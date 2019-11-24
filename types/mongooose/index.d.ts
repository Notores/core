import {StringKeyObject} from "../../Types";

declare module 'mongoose' {
    // @ts-ignore
    declare interface Model<IUser> {
        getUsernameField: () => string,
        findUserByUsernameField: (username: string) => Promise<IUser>,
        encryptString: (str: string) => string,
        authenticate: (email : string, password : string) => Promise<any>,
        register: (input : StringKeyObject) => Promise<string>,
        getUserById:  (id: string) => Promise<IUser>,
        verifyPassword: (pass : string) => Promise<any>,
        updatePassword: (oldPass : string, newPass : string) => Promise<any>
    }
}

