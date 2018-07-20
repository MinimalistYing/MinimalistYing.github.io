const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

module.exports = {
	entry: './src/index.jsx',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src/components/')
		},
		extensions: ['*', '.wasm', '.mjs', '.js', '.json', '.jsx']
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: './dist',
		filename: '[name].[hash].js'
	},
	module: {
		rules: [{
			test: /\.js|\.jsx$/,
			exclude: /node_modules/,
			use: ['babel-loader']
		}, {
			test: /.less$/,
			exclude: /node_modules/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [{
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
	        })
		}, {
			test: /.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [{
		            loader: 'css-loader',
		            options: {
		                minimize: true,
		                sourceMap: true
		            }
		        }]
	        })
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
		new ExtractTextPlugin({
			filename: 'css/[name].[contenthash].css'
		}),
		new HtmlWebpackPlugin({
			template: './react-index.html',
			filename: 'index.html',
			favicon: 'favicon.ico'
		}),
		new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
}