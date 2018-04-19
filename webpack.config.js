const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './src/index.jsx',
	module: {
		rules: [{
			test: /.(jsx|js)$/,
			use: ['babel-loader']
		}, {
			test: /.less$/,
			use: ['style-loader','css-loader','less-loader']
		}, {
			test: /.(jpe?g|png|gif|svg)$/,
			use: [{
				loader: 'url-loader',
				options: {
					limit: 8192 // 小于1kb的图片采用base64编码 并以DATAUrl的形式嵌入页面
				}
			}]
		}]
	},
	devtool: 'inline-source-map',
	devServer: {
		historyApiFallback: true,
		contentBase: false,
     	hot: true,
     	compress: true
	},
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './react-index.html'
		})
	]
}