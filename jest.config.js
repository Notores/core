module.exports = {
    "automock": false,
    "testEnvironment": "node",
    "moduleDirectories": [
        "node_modules"
    ],
    "testPathIgnorePatterns": [
        "node_modules",
        ".idea"
    ],
    "collectCoverage": true,
    "collectCoverageFrom": [
        "lib/**/*.js",
        "modules/**/*.js",
        "database.js",
        "server.js",
        "ModuleHandler.js"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 5,
            "lines": 40,
            "functions": 25,
            "statements": -1000
        }
    },
    "preset": "@shelf/jest-mongodb",
    "setupFilesAfterEnv": [
        "./setupJest.js"
    ],
    "coverageDirectory": "coverage"
};