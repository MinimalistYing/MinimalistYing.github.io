# 关于 Source Map 以及 Webpack 中 Devtool 的相关配置

## Source Map 是什么
为了提升 Web App 的性能，通常我们会把源码压缩混淆后再发布到服务器上  
当 App 出现问题时这些压缩过后的代码就会使得我们很难具体定位到错误出现在哪  
Source Map 的出现正是为了解决这个难题  
通过在压缩后的代码中加入如下注释
```js
// 注意此处的 sourceMappingURL 支持 http uri 以及 data uri 俩种形式
//# sourceMappingURL=/path/to/script.js.map
```
并在压缩混淆同时生成相应的 map 文件
```js
{
    version: 3,
    file: "script.js.map",
    sources: [
        "a.js",
        "b.js",
        "c.js"
    ], // 所有源文件的路径
    sourceRoot: "/",
    names: ["foo", "bar", "func"], // 所有源文件中出现的变量名 函数名
	// 关键所在 具体原理就不管了 有点复杂 大致是通过 Base64-VQL 编码做映射
    mappings: "AABASD,ASDFDSA,OAAOC,OAAO..."
}
```
这样浏览器就可以反向定位到错误具体出现在源码中的哪个文件的哪一行中  
Ps: [关于原理](https://www.codercto.com/a/31149.html)

## 关于 Source Map 的几个问题以及解答
### 为什么在浏览器的 network 中看不到下载 .map 文件的请求
浏览器默认只会在打开开发者工具时才去请求 .map 文件  
所以在 network 中看不到记录
[Stackoverflow](https://stackoverflow.com/questions/44315460/when-do-browsers-download-sourcemaps#)

### 如果将 .map 文件也发布到公开的服务器上，普通用户能否利用 Source Map 看到源文件
很不幸，答案是会的  
更不幸的是，通过 .map 文件以及压缩后的代码可以反向生成源代码  
这意味着在公开的生产环境下我们不应该去使用 Source Map  
因为这样相当于把整个 App 的源码暴露在外，是一种很危险的行为  
建议在类似预发环境(也就是与正式环境相同但是是私有的环境)下来利用 Source Map 进行 Debug  
Ps: 还可以通过服务器端的配置来禁止普通用户下载 .map 文件，这样就可以安全的把 .map 文件也放到正式环境上

### Source Map 对开发环境的意义何在
开发环境我们通常不会采用混淆代码，对于简单的 Javascript 应用可能意义并不大  
但当我们在开发 React App 或者 Vue App 时  
Source Map 可以将我们 Webpack 打包后的文件直接映射为源代码中的 .jsx/.vue 文件  
而不利用 Source Map 我们就只能去 Debug 编译过后的文件  
所以即是在开发环境下，Source Map 也是能给我们提供很大帮助的

## Webpack 的 Devtool
Webpack 中可以通过这项配置来决定具体使用何种 Source Map  
默认值为 `false` 也就是不启用 Source Map  
从方便 Debug 的角度从差到好排列，Webpack 一共提供了如下几种形式的 Source Map
* bundled code // 不开启 浏览器中只能看到打包过后的代码
* generated code // 可以看到打包前的每个 Module 但是看到的是 Webpack 处理后的文件
* transformed code // 可以看到打包前的每个 Module 但是看到的是经过 Loader 编译过后的文件
* original source // 可以看到源码
* (lines only) // 只定位到行 不定位到列
* without source content // 不暴露源文件 但是仍会暴露目录结构 可以在错误信息中看到源码对应的出错行列

关于 Devtool 的配置大致由如下几种关键字组合而来，每个关键字代表着不同特性
* eval // 编译速度最快
* inline // 不生成 .map 文件 以DataURL的形式嵌入
* cheap // 只定位到行 transformed code
* cheap-module // 只定位到行 original source

就目前来说  
个人感觉在开发环境下设为 `cheap-module-eval-source-map`  
可以获得较好的 Debug 体验，以及较快的编译速度  
在预发环境下设为 `source-map` 可以获得最完整的映射  
在正式环境下设为 `false` 避免源文件暴露  
当然碰到具体问题时可以进行调整  
要记住 Source Map 的终极目的是为了方便开发者定位问题  
所以只要能帮助我们找到问题的配置就是好配置

Ps: Webpack V4 中，当 mode 设为 'production' 时  
默认使用的 `uglifyjs-webpack-plugin` 会默认设置 `sourceMap: true`  
当我们手动去新配置 `uglifyjs-webpack-plugin` 时会覆盖掉默认配置  
所以要注意像如下配置一样加上 `sourceMap: true` 否则 Souce Map 会不生效
```js
// webpack.prod.config.js
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

module.exports = {
	// ...
	mode: 'production',
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				// ...
				sourceMap: true // 注意这里!!!!!!
				// ...
			})
		]
	}
	// ...
}
```
