module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    moduleNameMapper: {
        "\\.(css|sass)$": "identity-obj-proxy",
    }
};