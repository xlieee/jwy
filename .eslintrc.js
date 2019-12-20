module.exports = {
  root: true,
  env : {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console'                 : 'off',
    'no-debugger'                : process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 最多空1行
    'no-multiple-empty-lines'    : [2, { 'max': 1 }],
    // 对象首尾有空格
    'object-curly-spacing'       : [2, 'always'], 
    // 箭头函数前后空格
    'arrow-spacing'              : [2, { 'before': true, 'after': true }], 
    // 运算符前后空格
    'space-unary-ops'            : 2, // 1 / 2
    'space-before-function-paren': [2, 'always'], 
    // 括号内前后禁止空格
    'space-in-parens'            : 2,
    // a()b{} a,b处空格
    'space-before-blocks'        : 2,
    'keyword-spacing'            : 2,
    // (){ab} a,b处空格
    'block-spacing'              : 2,
    // 等号前后空格
    'space-infix-ops'            : 2, 
    // 键值对冒号前后空格
    'key-spacing'                : [2, { 'beforeColon': false, 'afterColon': true, 'align': 'colon' }], 
    // []前后去空格([2, "always"]加空格)
    'array-bracket-spacing'      : 2,
    // 逗号后空格
    'comma-spacing'              : 2,
    // 结尾禁止逗号
    'comma-dangle'               : 2,
    'indent'                     : [2, 2],
    'quotes'                     : [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
