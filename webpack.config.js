const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
	mode: 'development',
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
		chunkFilename: '[name].[contenthash].bundle.js',
		filename: '[name].[hash].js'
	},
	module: {
		rules: [{
			test: /.(jsx|js)$/,
			exclude: /node_modules/,
			use: ['babel-loader']
		}, {
			test: /.less$/,
			exclude: /node_modules/,
			use: ['style-loader','css-loader','less-loader']
		}, {
			test: /.css$/,
			use: ['style-loader','css-loader']
		}, {
			test: /.md$/,
			use: ['raw-loader']
		}, {
			test: /.(jpe?g|png|gif|svg)$/,
			exclude: /node_modules/,
			use: [{
				loader: 'url-loader',
				options: {
					name: '[path][name].[ext]',
					limit: 8192 // 小于1kb的图片采用base64编码 并以DATAUrl的形式嵌入页面
				}
			}]
		}]
	},
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		historyApiFallback: true,
		contentBase: false,
     	hot: true,
     	compress: true,
     	open: true
	},
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './react-index.html'
		})
	]
}