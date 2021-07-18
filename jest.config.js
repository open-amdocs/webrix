  module.exports = async () => {
    return {
        verbose: true,
        setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
        moduleNameMapper: {
            '\.(css)$': '<rootDir>/test/mocks/styleMock.js',
        }
    };
};
