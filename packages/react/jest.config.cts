module.exports = {
  displayName: 'runtime-react',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'html'],
  setupFilesAfterEnv: ['<rootDir>/../web-components/jest-setup.cjs'],
  coverageDirectory: '../../coverage/packages/react',
};
