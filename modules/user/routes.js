const UserRouter = require('./Router');
const passport = require('./passport');
const {routeWithHandle, checkParamIsObjectId, checkEmptyParams, checkInput} = require("./../../index");

//TODO: Fix the edit and delete routes can only be done by the user, not by other users
routeWithHandle(
    'notores-login',
    '/login',
    [
        passport.authenticate('local'),
        UserRouter.login,
    ], {
        method: 'post',
        accepts: ['html', 'json'],
    },
);

routeWithHandle(
    'notores-registerUser',
    '/register',
    [
        UserRouter.register
    ], {
        method: 'post',
    },
);

routeWithHandle(
    'notores-logout',
    '/logout',
    [
        UserRouter.logout
    ]
);

routeWithHandle(
    'notores-readUser',
    '/profile',
    [
        UserRouter.getProfile,
    ], {
        authenticated: true
    }
);

routeWithHandle(
    'notores-admin-readUsers',
    '/users',
    [
        UserRouter.get,
    ],
    {
        accepts: ['html', 'json'],
        admin: true,
    },
);

routeWithHandle(
    'notores-admin-readUserFromId',
    '/user/:userId',
    [
        checkEmptyParams,
        checkParamIsObjectId('userId'),
        UserRouter.getById,
    ], {
        accepts: ['html', 'json'],
        admin: true,
    },
);

routeWithHandle(
    'notores-createUser',
    '/user',
    [
        UserRouter.post
    ], {
        method: 'post',
    },
);


routeWithHandle(
    'notores-updateUser',
    '/user/:userId',
    [
        checkEmptyParams,
        checkParamIsObjectId('userId'),
        checkInput([
            {key: 'password', type: String},
            {key: 'repeatPassword', type: String},
        ], 'body'),
        UserRouter.patch
    ], {
        method: 'patch',
    },
);

routeWithHandle(
    'notores-deleteUser',
    '/user/:usedId',
    [
        checkEmptyParams,
        checkParamIsObjectId('userId'),
        UserRouter.delete
    ], {
        method: 'delete',
    },
);
