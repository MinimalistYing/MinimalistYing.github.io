# Webpack(v3.8.1)
```
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pkg = require(path.join(__dirname, 'package.json'))// package.json

// 定义项目中的一些文件夹路径
const APP_PATH = path.resolve(__dirname, 'src')

let theme = {}
// pkg.theme存的是项目中antd主题文件的路径
// 这里是 ./antd-theme.js
if (pkg.theme && typeof(pkg.theme) === 'string') {
  theme = require(path.resolve(__dirname, pkg.theme))
}

module.exports = {
  entry: path.resolve(APP_PATH, 'index.jsx'),
  // 暂时本地开发环境的不配output好像影响不大
  // 后期遇到问题再配
  resolve: {
    // 配置这个后引用node_modules中的依赖包不用加路径 直接import xx from ('antd')即可
    modules: [
      'node_modules'
    ],
    //后缀 配了这个就可以在import时 import xx from (./test) 而不用 import xx from (./test.jsx)
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  module: {
    rules: [{
      test: /\.js|\.jsx$/,
      use: [
        'babel-loader',
        'eslint-loader'
      ],
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: ['css-loader']
    }, {
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      },{
        loader: 'css-loader'
      },{
        loader: 'less-loader',
        options: {
          sourceMap: true,
          modifyVars: theme // 用于自定义antd主题 覆盖其less变量
        }
      }],
      include: path.resolve(__dirname, 'node_modules')
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ],
      include: APP_PATH
    }, {
      // 字体文件之类的需要这个loader支持
      test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
      use: ['file-loader'],
      include: APP_PATH
    }, {
      test: /\.(jpe?g|png|gif|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192// 小于1kb的图片采用base64编码 并以DATAUrl的形式嵌入页面
        }
      }],
      include: APP_PATH
    }]
  },
  devServer: {
    contentBase: './build',
    historyApiFallback: true,
    hot: true,// 开启HMR
    inline: true,
    compress: true,// 开启gzip
    port: 8080
  },
  plugins: [
    new webpack.NamedModulesPlugin(),// 用于确保多次build生成的bundle名称不变
    new HtmlWebpackPlugin({
      template: 'index.html'// 以根目录下的index.html为模版
    }),
    new webpack.HotModuleReplacementPlugin()// HMR所需
  ],
  devtool: 'cheap-module-eval-source-map'
}

```
生产环境
```
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ROOT_PATH = path.resolve(__dirname)
const APP_PATH = path.resolve(ROOT_PATH, 'src')

const pkg = require(path.join(__dirname, 'package.json'))// package.json
let theme = {}
// pkg.theme存的是项目中antd主题文件的路径
// 这里是 ./antd-theme.js
if (pkg.theme && typeof(pkg.theme) === 'string') {
  theme = require(path.resolve(__dirname, pkg.theme))
}
// 用于提取自己写的css
const appExtract = new ExtractTextPlugin({filename: 'app.[contenthash].css', allChunks: true})
// 用于提取依赖包的css(主要是Antd)
const vendorExtract = new ExtractTextPlugin({filename: 'vendor.css', allChunks: true})

module.exports = {
  entry: {
    app: path.resolve(APP_PATH, 'index.jsx'),
    vendor: ['react', 'axios']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash:5].chunk.js',
  },
  resolve: {
    // 配置这个后引用node_modules中的依赖包不用加路径 直接import xx from ('antd')即可
    modules: [
      'node_modules'
    ],
    //后缀 配了这个就可以在import时 import xx from (./test) 而不用 import xx from (./test.jsx)
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // 与NamedModulesPlugin 但更适用于生成环境
    new webpack.HashedModuleIdsPlugin(),
    // 部分依赖包(React)会在非生产环境中包含一些提示、警告的代码来帮助开发者解决问题
    // 在生产环境通过配置这个可以阻止生成这些代码 减小bundle的size
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    // 变动频率小的外部依赖包
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // webpack的运行环境所需
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'// 以根目录下的index.html为模版
    }),
    new CleanWebpackPlugin('build'),
    appExtract,
    vendorExtract,
  ],
  module: {
    rules: [{
      test: /\.js|\.jsx$/,
      use: [
        'babel-loader',
        'eslint-loader'
      ],
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: vendorExtract.extract(['css-loader'])
    }, {
      test: /\.less$/,
      use: vendorExtract.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader'
        },{
          loader: 'less-loader',
          options: {
            sourceMap: true,
            modifyVars: theme // 用于自定义antd主题 覆盖其less变量
          }
        }]
      }),
      include: path.resolve(__dirname, 'node_modules')
    }, {
      test: /\.scss$/,
      use: appExtract.extract({
        fallback: 'style-loader',
        use: ['css-loader','sass-loader']
      }),
      include: APP_PATH
    }, {
      // 字体文件之类的需要这个loader支持
      test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
      use: ['file-loader'],
      include: APP_PATH
    }, {
      test: /\.(jpe?g|png|gif|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          outputPath: 'images/',// 将图片放入build/images/目录下
          limit: 8192// 小于1kb的图片采用base64编码 并以DATAUrl的形式嵌入页面
        }
      }],
      include: APP_PATH
    }]
  }
};

```
