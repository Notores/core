import { OpenAPIV3 } from "openapi-types";
import { ApiPath, ClassType, CombinedPathOptions, PathOptions, TargetReturnType } from "../types/Notores";
export declare function SwaggerRequestBody(body: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject): TargetReturnType;
export declare function SwaggerParameters(parameter: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject): TargetReturnType;
export declare function SwaggerResponse(statusCode: number, response: ClassType, description?: string): TargetReturnType;
export declare function SwaggerResponse(statusCode: number, response: ClassType[], description?: string): TargetReturnType;
export declare function SwaggerResponse(statusCode: number, response: OpenAPIV3.ResponseObject): TargetReturnType;
export declare function SwaggerDoc({ operationId, ...operations }: OpenAPIV3.OperationObject): TargetReturnType;
export declare function ContentType(type: string): TargetReturnType;
export declare function Accepts(type: string): TargetReturnType;
export declare function Accepts(type: string[]): TargetReturnType;
export declare function Accepts(...type: string[]): TargetReturnType;
export declare function Restricted(role: string): TargetReturnType;
export declare function Restricted(roles: string[]): TargetReturnType;
export declare function Roles(roles: string[]): (target: any, propertyKey: string) => void;
export declare function Authorized(roles: string[]): (target: any, propertyKey: string) => void;
export declare function Authenticated(settings?: {
    redirect: boolean;
}): (target: any, propertyKey: string) => void;
export declare function SwaggerHideRoute(): (target: any, propertyKey: string) => void;
export declare function Admin(): (target: any, propertyKey: string) => void;
/**
 * @deprecated Since version 0.6.0 Will be deleted in version 1.0. Use @Restricted instead.
 */
export declare function Private(): (target: any, propertyKey: string) => void;
export declare function PreMiddleware(middleware: Function): TargetReturnType;
export declare function PreMiddleware(functionName: string): TargetReturnType;
export declare function PreMiddleware(middlewares: Array<Function>): TargetReturnType;
export declare function PreMiddleware(functionNames: Array<string>): TargetReturnType;
export declare function PreMiddleware(middlewaresAndFunctionNames: Array<Function | string>): TargetReturnType;
export declare function PostMiddleware(middleware: Function): TargetReturnType;
export declare function PostMiddleware(functionName: string): TargetReturnType;
export declare function PostMiddleware(middlewares: Array<Function>): TargetReturnType;
export declare function PostMiddleware(functionNames: Array<string>): TargetReturnType;
export declare function PostMiddleware(middlewaresAndFunctionNames: Array<Function | string>): TargetReturnType;
export declare function Get(): any;
export declare function Get(path?: ApiPath): any;
export declare function Get(options?: CombinedPathOptions): any;
export declare function Get(path: ApiPath, options: PathOptions): any;
export declare function Post(path?: ApiPath): (target: any, propertyKey: string) => void;
export declare function Put(path?: ApiPath): (target: any, propertyKey: string) => void;
export declare function Patch(path?: ApiPath): (target: any, propertyKey: string) => void;
export declare function Delete(path?: ApiPath): (target: any, propertyKey: string) => void;
export declare function GetId(path?: string): (target: any, propertyKey: string) => void;
export declare function PutId(path?: string): (target: any, propertyKey: string) => void;
export declare function PatchId(path?: string): (target: any, propertyKey: string) => void;
export declare function DeleteId(path?: string): (target: any, propertyKey: string) => void;
