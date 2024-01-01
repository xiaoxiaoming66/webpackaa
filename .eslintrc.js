module.exports = {
  // 继承 Eslint规则
  extends:["eslint:recommended"],
  env: {
    node: true,//启用node全局变量
    browser: true,//启用浏览器全局变量
    "es2020": true
  },
  parserOptions: {
    ecmaVersion: 6, //es6
    sourceType:'module',//es module
    allowImportExportEverywhere: true
  },
  ignorePatterns: ['dist'],
  rules: {
    "no-var":0, //不能使用var定义变量  2代表开启  0代表关闭
    "no-unused-vars": 0
  },
  plugins:['import']
}