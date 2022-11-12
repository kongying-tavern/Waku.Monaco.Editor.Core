/*eslint-env node*/
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:unicorn/recommended",
    "plugin:promise/recommended",
    "plugin:prettier/recommended"
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.eslint.json"]
  },
  plugins: ["@typescript-eslint", "unicorn", "promise"],
  rules: {
    "unicorn/prevent-abbreviations": [
      "error",
      {
        ignore: ["vite-env.d"] // ignore ONLY supports basename.
      }
    ]
  }
};
