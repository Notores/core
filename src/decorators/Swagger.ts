import {ClassType, Notores} from "../types/Notores";
import {NotoresApplication} from "../Notores";
import {isClassType, SwagEntityBuilder, isPrimitiveNonArrayType, isSwagPropRefOptions} from "../lib";
import {OpenAPIV3} from "openapi-types";

type SwagPropReturn = (target: any, key: string) => void

function getBuilder(target: any): Notores.SwagEntityBuilder {
    const app = NotoresApplication.app;
    let builder: Notores.SwagEntityBuilder | null = app.swaggerRegistry.entities.find((builder: Notores.SwagEntityBuilder) =>
        builder.entity === target.constructor
    );
    if (!builder) {
        builder = new SwagEntityBuilder(target.constructor);
        app.swaggerRegistry.entities.push(builder);
    }
    return builder;
}

function getType(input: any) {
    switch (input) {
        case String:
            return 'string';
        case Number:
            return 'number';
        case Boolean:
            return 'boolean'
        default:
            return input;
    }
}


export function SwagProp(): SwagPropReturn;
export function SwagProp(classType?: ClassType): SwagPropReturn;
export function SwagProp(refOptions?: Notores.SwagPropRefOptions): SwagPropReturn;
export function SwagProp(arrayOptions?: Notores.SwagPropOptions): SwagPropReturn;
export function SwagProp(input?: any): SwagPropReturn {
    return function SwagPropDoc(target: any, key: string) {
        const builder = getBuilder(target);

        const type: OpenAPIV3.NonArraySchemaObjectType | Function = getType(Reflect.getMetadata('design:type', target, key));

        /**
         * Default to string, because at runtime, `type` definitions are not converted to strings but to Objects.
         */
        const newProp: Notores.SwagPropOptions = {
            type: isPrimitiveNonArrayType(type) ? type : 'string',
        }

        if (input && input.required) builder.addRequired(key);

        if (isClassType(input) || isClassType(newProp.type)) {
            if (isClassType(newProp.type)) builder.addRef(key, newProp.type);
            else if (isClassType(input)) builder.addRef(key, input);
        } else {
            if (input) {
                const {required, ...restInput} = input as Notores.SwagPropOptions;
                const propEnum = input.enum;
                delete input.enum;

                if (Object.keys(input).includes('anyOf') || Object.keys(input).includes('allOf'))
                    newProp.type = undefined;

                Object.assign(newProp, restInput);

                if (propEnum) newProp.enum = Array.isArray(propEnum) ? propEnum : Object.values(propEnum).flat() as string[];
            }
            builder.addProperty(key, newProp)
        }
    }
}

export function SwagArrayProp(ref: ClassType): SwagPropReturn;
export function SwagArrayProp(refOptions?: Notores.SwagPropRefOptions): SwagPropReturn;
export function SwagArrayProp(swagPropArrayOptions: Notores.SwagPropArrayOptions): SwagPropReturn;
export function SwagArrayProp(input: any): SwagPropReturn {
    return function SwagArrayPropDoc(target: any, key: string) {
        const builder = getBuilder(target);

        if (input && input.required) builder.addRequired(key);

        if (isClassType(input)) {
            builder.addArrayRef(key, input);
            return;
        }

        if (isSwagPropRefOptions(input)) {
            builder.addArrayRef(key, input.type);
            return;
        }

        const {required, ...arrayOptions} = input;

        builder.addArrayProperty(key, arrayOptions);
    }
}