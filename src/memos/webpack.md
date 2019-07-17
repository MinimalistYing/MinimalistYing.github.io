在开启Webpack `devServer` 遇到问题时可以路由至URL `/webpack-dev-server` 
来观察打包出来的bundle文件详情来Debug

---

Webpack中的 `url-loader` 和 `file-loader` 都是用于打包一些图片字体之类的静态资源文件，
区别在于 `url-loader` 会对一定大小限制内的图片进行Base64编码并采用DataUrl的形式嵌入页面或css，
这些编码后的图片不会占用HTTP请求。但在图片过大的情况下会增加文件的大小，得不偿失，
更适用于处理一些项目中多处用到的小图片（1kb以下）

---

关于webpack devServer 的 `historyApiFallback` 在使用 类似 `vue-router` 或 `react-router` 来开发SPA时，
如果将模式设为history模式需要将此项设为 `true` 
为了将404的页面请求重定向至index.html以显示相应的404错误提示页面

---

webpack配置中的 `optput.publicPath` 也会同时影响到webpack-dev-server去何处读取静态资源，
如果配置错误会导致页面或静态资源无法加载，页面报错404或 `Cannot get /index.html`

---

通过webpack引入相关polyfill时要留意，polyfill需要确保在所有bundle之前引入，
而webpack并不会确保主entry中的
```js
import xx from xx
```
会按顺序引入，所以需要采取在entry中进行类似
```js
app: ['babel-polyfill', './app.js']
```
这样的形式确保依赖顺序。
详情可参见 `React` 的[Issue](https://github.com/facebook/react/issues/8379)

---

`moment`的国际化资源文件很大，所以在生产环境打包时要留意不要将不必要的国际化文件也包含进来
可以通过在webpack生产环境的配置文件中新增如下插件来解决这个问题
```js
plugins: [
	// 以下的配置会使打包出来的文件只包含简体以及繁体中文的国际化
	new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|zh-tw/)
]
```

---

在使用webpack提供的alias特性时，如果配置了eslint的import/no-unresolved规则  
会发现eslint并不会识别alias，然后当你使用alias时会报错  
这时需要借助[eslint-import-resolver-webpack](https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers/webpack)  
然后再.eslintrc文件中增加配置项  
```js
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
```

---

关于 Webpack output 配置中的 [hash]/[chunkhash]/[contenthash]  
[hash] 会在每一构建时都重新生成一个唯一的哈希值，会导致所有的静态资源文件都不会被浏览器缓存  
[chunkhash] 会根据不同的 entry 来计算hash值,如果一个 entry 中的文件被修改过则会产生不同的哈希值  
缺点在于假设有一个 Css 以及 JS 文件都来自同一 entry 会导致输出中的这俩个文件名包含的哈希值相同  
也就是说，如果只变动了 Css 文件也会同时影响到 JS 文件的缓存  
[contenthash] 会根据每个输出文件的内容来计算哈希值，只要有过改动则会产生不同的值，推荐使用这个

---

Webpack 中 `resolve.extensions` 的默认值为 `['.wasm', '.mjs', '.js', '.json']`  
当我们自定义这个值时，会把默认规则覆盖  
为了确保默认值仍可使用，可以把默认值也加入新定义的规则中  
例如  `['.vue', '.wasm', '.mjs', '.js', '.json']` 

---

`UslifyJs` 不支持压缩 ES6 的代码，所以当我们想不经过 `Babel` 编译直接压缩混淆 ES6 代码时  
需要使用 [TerserWebpackPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/)  
而不是通常用的 [UglifyjsWebpackPlugin](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/)
