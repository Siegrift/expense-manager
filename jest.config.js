module.exports = {
  roots: ["<rootDir>/lib", "<rootDir>/pages", "<rootDir>/pages__tests"],
  preset: "ts-jest/presets/js-with-ts",
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.jest.json",
      diagnostics: false
    }
  }
};
