在开启Webpack `devServer` 遇到问题时可以路由至URL `/webpack-dev-server` 
来观察打包出来的bundle文件详情来Debug

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
