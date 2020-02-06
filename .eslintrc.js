module.exports = {
  parser:'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "comma-dangle": ["error", "never"],
        "linebreak-style": 0,
        "global-require": 0,
        "eslint linebreak-style": [0, "error", "windows"],
        "no-console": "off",
        "react/prop-types": 0,
        "no-labels": "off",
        "no-unused-expressions" : "off",
        "no-unused-vars": "warn",
        "max-len": ["error", { "code": 150 }],
        "jsx-a11y/anchor-is-valid": "off",
        "react/jsx-props-no-spreading": "off",
        "class-methods-use-this": "off",
        "array-callback-return": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off"
  },
};
