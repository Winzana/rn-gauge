module.exports = {
  preset: 'react-native',
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', '.js.map'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native/*|@shopify/react-native-skia|)/)',
  ],
  verbose: true,
  bail: true,
};
