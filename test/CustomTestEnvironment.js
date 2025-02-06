const TestEnvironment = require('jest-environment-jsdom');

module.exports = class CustomTestEnvironment extends TestEnvironment {
    async setup() {
        await super.setup();
        this.global.TextEncoder = TextEncoder;
        this.global.TextDecoder = TextDecoder;
        this.global.Response = Response;
        this.global.Request = Request;
        this.global.ReadableStream = ReadableStream;
    }
};