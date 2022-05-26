module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["@typescript-eslint"],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },

  rules: {
    "max-len": ["warn", { code: 120 }],
    "object-curly-spacing": ["error", "always"],
    "eol-last": ["error", "always"],
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
    "@typescript-eslint/explicit-function-return-type": "on",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-use-before-define": "on",
    "prefer-template": "error",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-explicit-any": "on",
    "@typescript-eslint/no-unused-vars": "on",
  },
};
