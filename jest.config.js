module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testPathIgnorePatterns: ["/node_modules/", "/dist/", "/examples"],
    globals: {
        "ts-jest": {
            tsConfig: {
                target: "ES2019"
            }
        }
    }
};
