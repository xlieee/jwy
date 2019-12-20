module.exports = {
  extends: [
    '@commitlint/config-conventional'
  ],
  rules: {
    'type-enum': [2, 'always', [
      'add', 'update', 'feat', 'fix', 'refactor', 'docs', 'chore', 'style', 'revert'
    ]]
  }
}