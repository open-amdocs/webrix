module.exports = async () => ({
    testEnvironment: 'jsdom',
    verbose: true,
    coverageReporters: ['lcov', 'text-summary', 'html'],
    collectCoverageFrom: ['src/**/*.{js,jsx}', '!**/index.js', '!**/*.props.js', '!**/*.context.js', '!src/utility/mocks/mocks.js'],
    coverageThreshold: {
        global: {
            'branches': 90,
            'functions': 90,
            'lines': 90,
            'statements': 90,
        },
    },
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    moduleNameMapper: {
        '.(css)$': '<rootDir>/test/mocks/styleMock.js',
    },
});
