const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './src/index.jsx',
	module: {
		rules: [{
			test: /.jsx$/,
			use: ['babel-loader']
		},{
			test: /.less$/,
			use: ['style-loader','css-loader','less-loader']
		}]
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
     	hot: true
	},
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './react-index.html'
		})
	]
}