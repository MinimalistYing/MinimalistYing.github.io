在开启Webpack `devServer` 遇到问题时可以路由至URL `/webpack-dev-server` 
来观察打包出来的bundle文件详情来Debug

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
