import { NotoresApplication } from "../Notores";
import { isClassType, SwagEntityBuilder, isPrimitiveNonArrayType, isSwagPropRefOptions } from "../lib";
function getBuilder(target) {
    const app = NotoresApplication.app;
    let builder = app.swaggerRegistry.entities.find((builder) => builder.entity === target.constructor);
    if (!builder) {
        builder = new SwagEntityBuilder(target.constructor);
        app.swaggerRegistry.entities.push(builder);
    }
    return builder;
}
function getType(input) {
    switch (input) {
        case String:
            return 'string';
        case Number:
            return 'number';
        case Boolean:
            return 'boolean';
        default:
            return input;
    }
}
export function SwagProp(input) {
    return function SwagPropDoc(target, key) {
        const builder = getBuilder(target);
        const type = getType(Reflect.getMetadata('design:type', target, key));
        /**
         * Default to string, because at runtime, `type` definitions are not converted to strings but to Objects.
         */
        const newProp = {
            type: isPrimitiveNonArrayType(type) ? type : 'string',
        };
        if (input && input.required)
            builder.addRequired(key);
        if (isClassType(input) || isClassType(newProp.type)) {
            if (isClassType(newProp.type))
                builder.addRef(key, newProp.type);
            else if (isClassType(input))
                builder.addRef(key, input);
        }
        else {
            if (input) {
                const { required, ...restInput } = input;
                const propEnum = input.enum;
                delete input.enum;
                if (Object.keys(input).includes('anyOf') || Object.keys(input).includes('allOf'))
                    newProp.type = undefined;
                Object.assign(newProp, restInput);
                if (propEnum)
                    newProp.enum = Array.isArray(propEnum) ? propEnum : Object.values(propEnum).flat();
            }
            builder.addProperty(key, newProp);
        }
    };
}
export function SwagArrayProp(input) {
    return function SwagArrayPropDoc(target, key) {
        const builder = getBuilder(target);
        if (input && input.required)
            builder.addRequired(key);
        if (isClassType(input)) {
            builder.addArrayRef(key, input);
            return;
        }
        if (isSwagPropRefOptions(input)) {
            builder.addArrayRef(key, input.type);
            return;
        }
        const { required, ...arrayOptions } = input;
        builder.addArrayProperty(key, arrayOptions);
    };
}
