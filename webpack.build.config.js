const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const path = require('path')
const category = require('./src/blogs/category.js')

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
		// publicPath: './dist/',
		filename: '[name].[contenthash].js',
		chunkFilename: '[name].[contenthash].bundle.js',
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
					name: '[path][name].[ext]',
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
			filename: "[name].[contenthash].css",
			chunkFilename: "[id].[contenthash].css"
		}),
		new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
		new PrerenderSPAPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: path.join(__dirname, 'dist'),
      // Required - Routes to render.
			routes: [ '/index.html', '/memo.html', '/messagedemo.html', '/tools.html', '/games.html' ].concat(category.map(item => `/${item}.html`)),
			postProcess(context) {
				// Remove /index.html from the output path if the dir name ends with a .html file extension.
				// For example: /dist/dir/special.html/index.html -> /dist/dir/special.html
				if (context.route.endsWith('.html')) {
					context.outputPath = path.join(__dirname, 'dist', context.route)
				}
			
				return context
			},
			// The actual renderer to use. (Feel free to write your own)
      // Available renderers: https://github.com/Tribex/prerenderer/tree/master/renderers
      renderer: new Renderer({
        // Optional - defaults to 0, no limit.
        // Routes are rendered asynchronously.
        // Use this to limit the number of routes rendered in parallel.
        maxConcurrentRoutes: 2,
      })
    })
	],
	optimization: {
		minimizer: [
			// 由于配置optimization会覆盖默认值 所以这里需要配一下UglifyJsPlugin
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
			}),
			// new OptimizeCSSAssetsPlugin({}) // 由于该插件好像会修改属性的顺序 暂时放弃使用
		]
	}
}