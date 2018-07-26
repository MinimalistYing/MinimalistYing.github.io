const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require('path')

module.exports = {
	mode: 'production',
	entry: './src/index.jsx',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src/components/'),
			'@blog': path.resolve(__dirname, 'src/blogs/')
		},
		extensions: ['*', '.wasm', '.mjs', '.js', '.json', '.jsx']
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: './dist/',
		filename: '[name].[hash].js',
		chunkFilename: '[name].[hash].bundle.js',
	},
	module: {
		rules: [{
			test: /\.js|\.jsx$/,
			exclude: /node_modules/,
			use: ['babel-loader']
		}, {
			test: /.less$/,
			exclude: /node_modules/,
			use: [{
				loader: MiniCssExtractPlugin.loader
			}, {
	            loader: 'css-loader',
	            options: {
	                minimize: true,
	                sourceMap: true
	            }
	        }, {
	            loader: 'less-loader',
	            options: {
	                sourceMap: true
	            }
	        }]
		}, {
			test: /.css$/,
			use: [{
				loader: MiniCssExtractPlugin.loader
			}, {
	            loader: 'css-loader',
	            options: {
	                minimize: true,
	                sourceMap: true
	            }
	        }]
		}, {
			test: /.(jpe?g|png|gif|svg)$/,
			exclude: /node_modules/,
			use: [{
				loader: 'url-loader',
				options: {
					name: '[hash].[ext]',
					outputPath: 'images/',
					publicPath: './dist/images',
					limit: 8192 // 小于1kb的图片采用base64编码 并以DATAUrl的形式嵌入页面
				}
			}]
		}, {
			test: /.md$/,
			use: ['raw-loader']
		}]
	},
	devtool: 'source-map',
	plugins: [
		new webpack.NamedModulesPlugin(),
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			template: './react-index.html',
			filename: 'index.html',
			favicon: 'favicon.ico'
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].[hash].css",
			chunkFilename: "[id].[hash].css"
		}),
		new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') })
	],
	optimization: {
		minimizer: [
			// 由于配置optimization会覆盖默认值 所以这里需要配一下UglifyJsPlugin
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	}
}