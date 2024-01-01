module.exports = {
  // 预设 处理es兼容语法箭头函数等语法
  presets: [
    [
      '@babel/preset-env',
      {
        "useBuiltIns": "usage",//按需加载自动引入
        "corejs": 3  //解决js中promise等新语法的兼容性问题
      }//自动引入按需引入core-js
    ]
  ],

}