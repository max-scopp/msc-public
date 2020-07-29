module.exports = {
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    "plugin:@stencil/recommended"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "project": "./tsconfig.json"
  },
  plugins: ['@typescript-eslint', 'prettier', '@stencil/eslint-plugin'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      },
      typescript: {},
    },
  },
  rules: {
    "max-len": 'off',
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'import/no-extraneous-dependencies': [2, { devDependencies: ['**/test.tsx', '**/test.ts'] }],

    "no-unused-vars": "off",
    "no-undef": "off",
    "@typescript-eslint/interface-name-prefix": "off",

    "import/extensions": [2, {
      ".ts": "never",
      ".tsx": "never",
    }],

    "no-underscore-dangle": [1, {
      "allowAfterThis": true
    }],

    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-unused-vars": 1,

    "@stencil/strict-boolean-conditions": 0,
    "@stencil/required-jsdoc": 1,
    "@stencil/decorators-style": [2, {
      prop: "multiline"
    }],

    "react/prop-types": 0,

    // the rules below are because React can suck my dick
    // (Avoids misleading errors and @stencil plugin will handle this approirately)
    "import/prefer-default-export": 0,
    "react/react-in-jsx-scope": 0,
    "react/no-unknown-property": 0
  },
};