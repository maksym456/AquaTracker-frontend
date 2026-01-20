module.exports = {
  testEnvironment: 'jsdom', 
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],  
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'  
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],  
  testMatch: ['**/tests/**/*.test.[jt]s?(x)'],  
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy' 
  }
};