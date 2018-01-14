module.exports = {
  extends: 'airbnb-base',
  rules: {
    'space-in-parens': ['warn', 'always'],
    'array-bracket-newline': ['warn', { multiline: true, minItems: 3 }],
    'comma-dangle': ['warn', 'never'],
    'import/first': 0,
    'no-console': 0,
    'import/prefer-default-export': 0,
    'consistent-return': 0,
    'import/no-extraneous-dependencies': [
      'warn',
      {
        devDependencies: true,
        optionalDependencies: true,
        peerDependencies: true
      }
    ]
  },
  env: {
    mocha: true
  }
};
