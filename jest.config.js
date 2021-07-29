module.exports = async () => {
    return {
        testEnvironment: 'jsdom',
        verbose: true,
        coverageReporters: ['lcov', 'text-summary', 'html'],
        collectCoverageFrom: ['src/**/*.{js,jsx}', '!**/index.js', '!**/*.props.js', '!**/*.context.js', '!src/utility/mocks/mocks.js'],
        coverageThreshold: {
            global: {
                'branches': 80,
                'functions': 80,
                'lines': 80,
                'statements': 80,
            },
        },
        setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
        moduleNameMapper: {
            '.(css)$': '<rootDir>/test/mocks/styleMock.js',
        },
    };
};
