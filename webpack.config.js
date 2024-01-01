const path = require('path')
const HtmlWebpackPlug = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// css压缩支持缓存和并发
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// 打包后压缩js去除js注释和conso.log
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 需要安装eslint eslint-plugin-import eslint-webpack-plugin
const EslintWebpackPlugin = require('eslint-webpack-plugin')
// 项目大的时候开启多进程打包

const os = require('os')
// webpack内置的插件 terser-webpack-plugin 压缩js
// const TerserWebpackPlugin = require('terser-webpack-plugin')
const threads = os.cpus().length


module.exports = {
  mode: 'production',
  entry: './index.js',
  // devtool: 'cheap-module-source-map',
  // resolve:{
  //   extensions:['.jsx','js','.json','.css']//自动补全文件扩展名的配置
  // },
  optimization: {
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin({}),//注意此配置只有在生产环境下才生效
      new UglifyJsPlugin({
        // 在这里添加UglifyJS的配置选项
        // 例如：压缩时去除注释
        uglifyOptions: {
          comments: false,
          compress: {
            drop_console: true,
          },
        },
      }),
      // 压缩图片 有损压缩和无损压缩
    ],
    splitChunks: {
      chunks:'all',
      minSize:20000,//分割代码的大小
      // 分组打包
      cacheGroups: {
        lodash: {
          test:/[\\/]node_modules[\\/]lodash/,
          name: 'chunk-lodash',
          priority:40//增加打包的权重必须比node_modules高
        },
        libs: { //排除配置了的包打包到libs中
          test:/[\\/]node_modules[\\/]/,
          name: 'chunk-libs',
          priority:30//增加打包的权重必须比node_modules高
        },
        // default:{
        //   // minSize: 0,
        //   minChunks:2 ,//至少被引用的次数
        //   reuseExistingChunk: true
        // }
      }
    },
    // 文件之间的依赖关系单独提取成一个文件保管
    runtimeChunk: {
      name: (a) => 'runtime~'+ a.name+ '.js'
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash:5].js',
    // 统一对其他图片字体等通过type:asset处理资源的命名方式
    // assetModuleFilename:'static/[hash:10][ext]',
    // 这是给动态导入的文件打包输出的名字 import()
    chunkFilename:'js/[name].[contenthash:5].js',
    clean: true
  },
  devServer: {
    host: 'localhost',
    port: '5555',
    hot: true,//只能用于开发环境
    open: true,
    historyApiFallback: true //解决 h5路由刷新404
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-preset-env'
                ],
              }
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-preset-env'
                ],
              }
            }
          },
          'less-loader']
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/images/[name].[hash:10][ext][query]'
        }
      },
      {
        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash:10][ext][query]'
        }
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          {
            loader:'thread-loader',
            options: {
              works: threads, //指定进程数量
            }
          },
          {
            loader: 'babel-loader',
            options: {
              // .babelrc.js文件中有了
              // presets: ['@babel/preset-env'],
              // 开启babel缓存 ，并关闭缓存的压缩
              cacheDirectory: true,
              cacheCompression: false,
              // plugins: ['@babel/plugin-transform-runtime'] //babel使用tree-sharking
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlug({
      template: path.resolve(__dirname, './public/index.html')
    }),
    // contenthash根据文件内容生成hash更好的利用缓存  配合runtime使用
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:10].css',
      // 动态导入的css
      chunkFilename:'css/[name].chunk.[contenthash:10].css'
    }),
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, './src'),
      exclude: 'node_modules',
      // 开启缓存
      cache: true,
      threads //开启多进程
      // 可以选择指定缓存目录
      // cacheLocation:path.resolve(__dirname,"./node_modules/.cache/eslintcache")
    }),
    // new TerserWebpackPlugin({
    //   parallel:threads
    // })
  ],



}