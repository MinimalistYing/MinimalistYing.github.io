const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

module.exports = {
	entry: './src/index.jsx',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: './dist',
		filename: '[name].[hash].bundle.js'
	},
	module: {
		rules: [{
			test: /.(jsx|js)$/,
			exclude: /node_modules/,
			use: ['babel-loader']
		}, {
			test: /.less$/,
			exclude: /node_modules/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'less-loader']
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
		}]
	},
	devtool: 'inline-source-map',
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
		})
	]
}