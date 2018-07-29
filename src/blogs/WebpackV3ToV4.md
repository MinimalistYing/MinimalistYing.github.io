# Webpack V3 升级至 V4
## 序
半年没关注，最近突然发现Webpack的版本已经升到4.16.2了，为了紧跟潮流的步伐，决定将项目中使用的3.10.0来个升级

## 步骤
1. 安装`webpack`以及`webpack-cli`
2. 将项目中所有用到的`loader`以及`plugin`升级到最新
3. 配置文件里新增 `mode: 'development'` or `mode: 'production'`
4. 移除`webpack.optimize.UglifyJsPlugin`，现在webpack会在生产环境默认对js进行压缩
5. 移除`extract-text-webpack-plugin`，v4推荐使用新的`mini-css-extract-plugin`来提取样式文件
6. 引入`optimize-css-assets-webpack-plugin`以及`uglifyjs-webpack-plugin`，并在生产环境的配置文件下新增

```js
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

module.exports = {
	optimization: {
		minimizer: [
			// 由于配置optimization会覆盖默认值 所以这里需要配一下UglifyJsPlugin
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	}
}
```
7. 搞定

## 总结
升级过后打包和编译速度大概提升了15%左右（粗略比较）

上述只是针对我之前项目配置的升级，并不完整，仅供参考

Webpack官方有提供详细的迁移[文档](https://webpack.js.org/migrate/4/)

遇到问题也可以通过报错信息很快定位到原因，再去相应的Github库上找一找解决办法，迁移过程还是比较顺利的
