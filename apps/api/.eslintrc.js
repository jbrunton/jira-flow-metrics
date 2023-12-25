module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "boundaries"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:boundaries/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "boundaries/element-types": [
      2,
      {
        default: "disallow",
        rules: [
          {
            from: "entities",
            allow: ["entities"],
          },
          {
            from: "lib",
            allow: ["lib"],
          },
          {
            from: "usecases",
            allow: ["entities", "usecases", "lib"],
          },
          {
            from: "data",
            allow: ["entities", "usecases", "lib", "data"],
          },
          {
            from: "app",
            allow: ["entities", "usecases", "lib", "app"],
          },
          {
            from: "main",
            allow: ["app", "data", "main"],
          },
        ],
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    "boundaries/elements": [
      {
        type: "entities",
        pattern: "src/domain/entities",
      },
      {
        type: "usecases",
        pattern: ["src/domain/usecases"],
      },
      {
        type: "lib",
        pattern: "src/lib",
      },
      {
        type: "data",
        pattern: "src/data",
      },
      {
        type: "app",
        pattern: ["src/app"],
      },
      {
        type: "main",
        pattern: ["src/main.ts", "src/main-module.ts"],
        mode: "file",
      },
      {
        type: "test",
        pattern: ["test"],
      },
    ],
    "boundaries/ignore": ["**/*.spec.ts", "**/*.e2e-spec.ts", "test/**/*"],
  },
};
