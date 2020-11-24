# @notores/core #

This is the core package for the Notores framework.  
Notores helps you build REST api's with ease and allows you to use a themed website with it (optional).

## Table of contents ##
  - [Getting started](#getting-started)
    - [Setup](#setup)
    - [Creating a module](#creating-a-module)
    - [Notores.json](#notoresjson)
  - [API](#api)
    - [@Module](#module)
    - [REST decorators](#rest-decorators)
    - [REST settings](#rest-settings)
    - [Property decorators](#property-decorators)
      - [ParamTypes enum](#paramtypes-enum)
  - [Examples](#examples)
    - [ProductModule](#productmodule)

## Getting started ##
Notores helps you build REST api's with ease. This does not mean we think we should tell you if and with database to use.
To use a database connection with built in Notores functionality, please check our Git account if we have what you need. If we don't, please tell us what you need or create your own!

### Setup ###
1. Please make sure to use the latest major version of [Node.js](https://github.com/nvm-sh/nvm#install--update-script).
2. Run `npm i @notores/core` (The Notores framework is still in development and in Beta)
3. Make sure you have `experimentalDecorators` and `emitDecoratorMetadata` set to `true` in your `tsconfig.json`

        "experimentalDecorators": true,
        "emitDecoratorMetadata": true

4. Add a file to your root called `notores.json` with an empty object as content (`{}`). With this file, you can control application settings like:  
    • JWT settings  
    • Should your application use cookies  
    • Should your application use the default passport module for authentication en authorization  
    • Frontend/ backend themes
5. (Optional) Install a database connection module that works with Notores like  
    • `npm i notores/typegoose`  
    • [`npm i notores/typeorm`](https://github.com/Notores/typeorm)
6. In your `app.ts`, all you need to add is:

        async function setup() {
            const modules = [];
            const app = await NotoresApplication.create(modules);
            app.start(/* Insert port */); // E.g. process.env.PORT || 3000
        }

7. You now have the basis of a Notores based REST application!  
   To add REST routes all you have to do is create a module.
    
### Creating a module ###
To create a module, do the following
1. Add a folder called `app` or `modules`. Anything you like is fine.
2. Within the app folder, create a new folder for the module you'd like to create, like `products`.
3. Create a file in the module's folder called `index.ts`.
4. Add a class in `index.ts` with the following code (this example uses MongoDB with notores/typegoose):

        /* EXAMPLE */
        import {Module, Get} from "@notores/core";
        import ProductModel, {Product} from "./Product";
        
        @Module({
            prefix: 'product', // DOMAIN.TLD/product
            dataKey: 'products', // JSON returns {products: /* return value */}
        })
        export default class ProductModule {
        
            @Get()
            async getProducts(): Promise<Product[]> {
                /* Insert code */
            }
        }

5. Open your root `app.ts` and import the newly created module and add it to NotoresApplication.create:
        
        /* EXAMPLE */
        import { NotoresApplication } from "@notores/core";
        import ProductModule from "./app/product";

        async function setup() {
            const app = await NotoresApplication.create([
                ProductModule
            ]);           
            app.start(/* Insert port */); // E.g. process.env.PORT || 3000
        }
        
6. You now have a working REST api for a GET request to `DOMAIN.TLD/product`!

You can always add more routes by adding new functions or properties to the class.
Example:

    @Authenticated() // This checks if the user is authenticated
    @DeleteId() // This adds `/:id` to the route prefix. This is the same as adding `@Delete('/:id')`
    async deleteProduct(@param('id') productId: string) {
        /* Insert code */
    }`

### Notores.json ###
This is the configuration file for the Notores application.
Most of these can be changed during the applications runtime, like theme and content-type, saltRounds, cookie and jwt.
JSON structure is as followed:

    {
      "main": {
        "useCookie": true, // Should the application use cookies. Cookies are set on "notores". Deffault: false
        "cookieSecret": "PleaseChangeThisCookieOrYouWillBeInDeepTrouble", // Application Cookie secret for securing the cookie
        "server": {
          "requestSizeLimit": "10mb" // Max body size. Default: 1mb
        },
        "authentication": {
          "saltRounds": 10 // Rounds of salting you can pass to modules like bcrypt
        },
        "jwt": {
          "secretOrKey": "PleaseChangeThisSecretOrYouWillBeInDeepTrouble", // JWT Secret or Key
          "issuer": "example.com", // JWT issuer
          "audience": "example.com" // JWT audience
        }
      },
      "content-types": [ // Allowed content types. Options: ["html", "json"]
        "html",
        "json"
      ],
      "theme": { // Theme config. Accepts properties "public" and "admin".
        "public": {
          "name": "notores", // Theme folder name. Path: * App location */public/themes/* theme.public.name */public
          "isApp": false // If the theme is a React or Angular app, the index.html must be served instead
        },
        "admin": {
          "name": "notores", // Theme folder name. Path: * App location */public/themes/* theme.private.name */private
          "isApp": false // If the theme is a React or Angular app, the index.html must be served instead
        }
      }
    }

## API ##

### @Module ###

`function Module(settings?: ModuleDecoratorOptions | string): ClassDecorator;`

| Property | DataType | Required | Default | Description |
|----------|----------|----------|---------|-------------|
| prefix   | string   | false    |''    |REST route prefix for all REST api's in this module (class)|
| dataKey  | string   | false    | ClassName - Module (Calculated). E.g.:  ProductModule -> product ProdMod -> prodmod | The property key return values are placed in e.g. `{prodmod: returnValue}` |
| entity   | any      | false    | null | When using a Notores module for a database connection, the entity is passed to be loaded by the database and can be used in function on `this.entity` |
| entities | any[]    | false    | null | The same as entity, but these entities are not accessible in functions |
| repository | any    | false    | null | This should be used for a database repository class. This can be used in functions on `this.repository` |


### REST decorators ###
The REST decorators should always be at the bottom as they define the default settings for a REST route.

GOOD:

    @Admin()
    @Get()
    async getSomething()
    
BAD:

    @Get()
    @Admin()
    async broken()

Out of the box, there are the following decorators.

| Decorator     	| Parameters                                        	| Description                                                                                                    	|
|---------------	|---------------------------------------------------	|----------------------------------------------------------------------------------------------------------------	|
| @Get()        	| settings?: ModuleMethodDecoratorOptions \| string 	| Creating a GET route                                                                                           	|
| @GetId()      	| settings?: ModuleMethodDecoratorOptions \| string 	| Creating a GET route with "/:id" added to the route                                                            	|
| @Post()       	| settings?: ModuleMethodDecoratorOptions \| string 	| Creating a POST route                                                                                          	|
| @Put()        	| settings?: ModuleMethodDecoratorOptions \| string 	| Creating a PUT route                                                                                           	|
| @PutId()      	| settings?: ModuleMethodDecoratorOptions \| string 	| Creating a PUT route with "/:id" added to the route                                                            	|
| @Patch()      	| settings?: ModuleMethodDecoratorOptions \| string 	| Creating a PATCH route                                                                                         	|
| @PatchId()    	| settings?: ModuleMethodDecoratorOptions \| string 	| Creating a PATCH route with "/:id" added to the route                                                          	|
| @Delete()     	| settings?: ModuleMethodDecoratorOptions \| string 	| Creating a DELETE route                                                                                         	|
| @DeleteId()   	| settings?: ModuleMethodDecoratorOptions \| string 	| Creating a DELETE route with "/:id" added to the route                                                         	|

### REST settings ###

| Decorator     	| Parameters                                        	| Description                                                                                                    	|
|---------------	|---------------------------------------------------	|----------------------------------------------------------------------------------------------------------------	|
| @Page()       	| pages: string \| string[]                         	| If the theme is not an app, it checks (e.g. theme is Notores frontend) /notores/public/pages/ * page *           	|
| @Middleware() 	| middlewares: MiddlewareFunction                   	| Adds a middleware function before this function.                                                               	|
| @Authenticated() 	| settings?: {redirect: boolean}                     	| Check if the user is authenticated. If the user isn't and is on a website, it can redirect the user to `/login`. Default: false |
| @Authorized() 	| roles: string[]                                      	| Check if the user is authenticated and has the required roles.                                                    |
| @Roles()       	| roles: string[]                                      	| Check if the user has the required roles.                                                                         |
| @Restricted()   	| roles: string[] | string                             	| Check if the user has the required role/roles.                                                                    |
| @Private()      	|                                                   	| Private route ('/n-admin') that is only accessible for users that are authenticated.                            	|
| @Admin()        	|                                                   	| Private route ('/n-admin') that is only accessible for users that are authenticated and have the 'admin' role. 	|

### Property decorators ###
To make your life a lot easier, Notores/core also has a few method decorators.  

| Decorator 	| Parameters                          	| Usage                                           	| Description                                                                                               	|
|-----------	|-------------------------------------	|-------------------------------------------------	|-----------------------------------------------------------------------------------------------------------	|
| @config   	|                                     	| @config config: object                          	| The contents of notores.config directly instead of req.notores                                            	|
| @user     	|                                     	| @user user: User                                	| The requests user from req.user if authenticated (should only be used with authenticated routes)          	|
| @body     	|                                     	| @body body: IBody                               	| The requests body from req.body                                                                           	|
| @query    	|                                     	| @query query: any                               	| The requests query from req.query                                                                         	|
| @params   	|                                     	| @params params: any                             	| The requests params from req.params                                                                       	|
| @param()  	| paramKey: string, type?: ParamTypes 	| @param('id', ParamTypes.int) databaseId: number 	| Retrieves the given key from req.params and if a second parameter is given, parses the value to that type 	|
| @request  	|                                     	| @request req: Request                           	| The express request object                                                                                	|
| @response 	|                                     	| @response res: Response                         	| The express response object                                                                               	|
| @next     	|                                     	| @next next: NextFunction                        	| The express next function                                                                                 	|

#### ParamTypes enum ####
You can use the following ParamTypes that Notores can convert your values to.
If you need any other, please open a ticket or a PR.

    enum ParamTypes {
        int = 'int',
        integer = 'int',
        float = 'float',
        bool = 'boolean',
        boolean = 'boolean',
    }

## Examples ##

### ProductModule ###
    @Module({
        prefix: 'product',
        dataKey: 'products',
        entity: Product,
        repository: ProductRepository,
    })
    export default class ProductModule {
    
        @Get() // Route: /product
        async getProducts(): Promise<Product[]> {
            // code
        }
    
        @Get('/:name') // Route: /product/:name
        async getProductByName(@param('name') productName: string): Promise<Product> {
            // code
            return [product1, product2];
            /*
            e.g.
                {
                    products: [product1, product2,] 
                }
             */
        }
    
        @GetId() // Route: /product/:id
        async getProductById(@param('id', ParamTypes.int) productId: number): Promise<Product> {
            // code
            return product;
            /*
            e.g.
                {
                    products: product 
                }
             */
        }
    
        @Authorized(['admin', 'sales'])
        @Private()
        @Post() // Route: /n-admin/product
        async addNewProduct(@body body: Omit<Product, '...args'>, @user user: User): Promise<Product> {
            // Add product with a reference to who added it
            return newProduct;
            /*
            e.g.
                {
                    products: newProduct 
                }
             */
        }
    
        @Authorized(['admin', 'sales', 'warehouse'])
        @Private()
        @PutId() // Route: /n-admin/product/:id
        async updateProduct(@param('id', ParamTypes.int) productId: number, @body body: Partial<Product>, @user user: User): Promise<Product> {
            // Updated product by id with a reference to who updated it
            return updatedProduct;
            /*
            e.g.
                {
                    products: updatedProduct 
                }
             */
        }
    
        @Admin()
        @DeleteId() // Route: /n-admin/product/:id
        async removeProduct(@param('id', ParamTypes.int) productId: number, @user user: User) {
            // Remove product by id and save a reference to who did
            return 'Removed'
            /*
            e.g.
                {
                    products: 'Removed' 
                }
             */
        }
    }

