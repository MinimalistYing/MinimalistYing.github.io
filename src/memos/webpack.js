export default [{
	date: `2017/10/27`,
	content: `
在开启Webpack \`devServer\` 遇到问题时可以路由至URL \`/webpack-dev-server\` 
来观察打包出来的bundle文件详情来Debug
`
}, {
	date: `2017/10/27`,
	content: `
Webpack中的 \`url-loader\` 和 \`file-loader\` 都是用于打包一些图片字体之类的静态资源文件，
区别在于 \`url-loader\` 会对一定大小限制内的图片进行Base64编码并采用DataUrl的形式嵌入页面或css，
这些编码后的图片不会占用HTTP请求。但在图片过大的情况下会增加文件的大小，得不偿失，
更适用于处理一些项目中多处用到的小图片（1kb以下）
`
}, {
	date: `2017/11/3`,
	content: `
在开发环境中可配置 \`devtool: 'cheap-module-eval-source-map'\` 来获得更快的编译速度，
在生产环境中可配置 \`devtool: 'cheap-module-source-map'\` 以便于更好的排查线上问题
`
}, {
	date: `2017/12/5`,
	content: `
关于webpack devServer 的 \`historyApiFallback\` 在使用 类似 \`vue-router\` 或 \`react-router\` 来开发SPA时，
如果将模式设为history模式需要将此项设为 \`true\` 
为了将404的页面请求重定向至index.html以显示相应的404错误提示页面
`
}, {
	date: `2018/1/15`,
	content: `
webpack配置中的 \`optput.publicPath\` 也会同时影响到webpack-dev-server去何处读取静态资源，
如果配置错误会导致页面或静态资源无法加载，页面报错404或 \`Cannot get /index.html\`
`
}, {
	date: `2018/1/16`,
	content: `
通过webpack引入相关polyfill时要留意，polyfill需要确保在所有bundle之前引入，
而webpack并不会确保主entry中的
\`\`\`js
import xx from xx
\`\`\`
会按顺序引入，所以需要采取在entry中进行类似
\`\`\`js
app: ['babel-polyfill', './app.js']
\`\`\`
这样的形式确保依赖顺序。
详情可参见 \`React\` 的[Issue](https://github.com/facebook/react/issues/8379)
`
}, {
	date: `2018/7/27`,
	content: `
\`moment\`的国际化资源文件很大，所以在生产环境打包时要留意不要将不必要的国际化文件也包含进来
可以通过在webpack生产环境的配置文件中新增如下插件来解决这个问题
\`\`\`js
plugins: [
	// 以下的配置会使打包出来的文件只包含简体以及繁体中文的国际化
	new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|zh-tw/)
]
\`\`\`
`
}, {
	date: `2018/8/27`,
	content: `
在使用webpack提供的alias特性时，如果配置了eslint的import/no-unresolved规则  
会发现eslint并不会识别alias，然后当你使用alias时会报错  
这时需要借助[eslint-import-resolver-webpack](https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers/webpack)  
然后再.eslintrc文件中增加配置项  
\`\`\`js
{
	settings: {
		'import/resolver': {
			webpack: {
				// 配置alias的文件路径
				config: './webpack.base.js'
			}
		}
	}
}
\`\`\`
`
}]
