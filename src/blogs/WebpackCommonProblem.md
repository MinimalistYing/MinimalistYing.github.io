# 记录配置 Webpack 过程中碰到的问题
Ps: 基于 Webpack V4

## Vue

### 未配置 VueLoaderPlugin
错误信息
```
ERROR in ./src/component/App.vue
Module Error (from ./node_modules/vue-loader/lib/index.js):
vue-loader was used without the corresponding plugin.
Make sure to include VueLoaderPlugin in your webpack config.
```
[参考文档](https://vue-loader.vuejs.org/guide/#manual-configuration)  
```js
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
	// ...
	plugins: [
		new VueLoaderPlugin() // 新增VueLoaderPlugin
	]
	// ...
}
```

### 未安装 vue-template-compiler
错误信息
```
ERROR in ./src/component/App.vue
Module build failed (from ./node_modules/vue-loader/lib/index.js):
Error: [vue-loader] vue-template-compiler must be installed as a peer dependency, 
or a compatible compiler implementation must be passed via options.
```
[参考文档](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#vue-template-compiler)  

由于 `vue-loader` 内部实现需要依赖 `vue-template-compiler` ，但我们通过 npm 安装 `vue-loader` 时并未同时安装 `vue-template-complier` ，所以需要显示的在本地项目安装一下：
```
npm i vue-template-complier --save-dev
```

### 未安装配置css-loader
错误信息
```
ERROR in ./src/component/App.vue?vue&type=style&index=0&lang=css& 
(./node_modules/vue-loader/lib??vue-loader-options!./src/component/App.vue?vue&type=style&index=0&lang=css&) 24:0
Module parse failed: Unexpected token (24:0)
You may need an appropriate loader to handle this file type.
|
|
> .app {
|       font-size: 24px;
|       margin-top: 50%;
```
由于默认的 `.vue` 文件中 `<style>` 的lang属性值为 `css`。  

所以 `vue-loader` 默认会将 `<style>` 块中的样式文件抽出作为 CSS 文件提供给 Webpack 加载。  

而不配置 `css-loader` 的话 Webpack 是无法正确加载 CSS 文件的：
```
npm i css-loader --save-dev
```
修改配置文件：
```js
// webpack.config.js
module.exports = {
	// ...
	module: {
		rules: [{
			test: /.css$/,
			use: 'css-loader'
		}]
	}
	// ...
}
```
凭以上配置虽然页面能正常访问，但会发现样式并不会生效
```
npm i style-loader --save-dev
```
修改配置文件：
```js
// webpack.config.js
module.exports = {
	// ...
	module: {
		rules: [{
			test: /.css$/,
			use: [
				'style-loader',
				'css-loader'
			]
		}]
	}
	// ...
}
```
[Style Loader](https://webpack.js.org/loaders/style-loader/)  

[CSS Loader](https://webpack.js.org/loaders/css-loader/)  

CSS Loader 的作用是使我们可以在 JS 文件中通过 `import style from 'xxx.css'` 来告诉 Webpack 这个文件对样式的依赖，这样当打包时这个 CSS 文件时也会将 xxx.css 算入其中，当这样并不能使样式文件被浏览器正确加载。  

Style Loader 正是起到将依赖的样式文件通过在页面上插入 `<style>` 标签的形式注入到页面中，所以简单来讲，不做其他特殊配置的话，一定要同时使用这俩个 Loader 才能使得样式正确加载。

### 未正确配置项目所使用的 Vue 文件
错误信息
```
// 页面报错
[Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. 
Either pre-compile the templates into render functions, or use the compiler-included build.
```
页面并未正常渲染，而是在 `HTML` 中出现了如下片段
```html
<html>
<head>
	<title>Vue</title>
</head>
<body>
	<!--function (a, b, c, d) { return createElement(vm, a, b, c, d, true); }-->
	<script type="text/javascript" src="main.js"></script>
</body>
</html>
```
[参考文档](https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds)  

这个问题出现主要是由于 Vue 对外提供了俩个版本的最终构造文件 Full(Runtime + Compiler) 以及 Runtime-only，俩者的区别就在于一个有 Compiler 另一个没有。  

此外，在 Vue 的 package.json 中可以看到 `"module": "dist/vue.runtime.esm.js"`  
也就是说在使用 webpack 打包时 `import Vue from 'vue'` 默认使用的是 vue.runtime.esm.js 也就是 Rutime-only 的版本。  

Compiler 的主要作用在于将文件中的模版字符串转化为 render 函数（注意这里的文件不包括 .vue 文件 因为他们会被 vue-loader 自动预编译）  

举例，在如下 Vue 应用的主入口文件中：  
```js
// main.js
import Vue from 'vue'

// 这种形式需要引用 Full(Runtime + Compiler)
new Vue({
	el: '#app',
	template: '<div></div>'
})

// 引用 Runtime-only 即可
new Vue({
	el: '#app',
	rendre(h) {
		return h('div')
	}
})
```
所以以上问题的解决方案有俩种，其一是如果我们确定不会在除 .vue 文件外使用 Vue 的 template，那么直接照常引入默认的 Runtime-only 版本即可，否则则需要我们显示的引入 Full(Runtime + Compiler) 版本。  
``` js
// main.js
import Vue from 'vue/dist/vue.esm.js'
```
可以利用 webpack 的别名功能简化这个操作，也是官方推荐的方式
```js
// webpack.config.js
module.exports = {
	// ...
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
			// Ps: 最后的 $ 意味着完全匹配 也就是说只有在 import xx from 'vue' 时这条规则才会生效
			// import xx from 'vue/xx.js' 并不会触发以上规则
		}
	}
	// ...
}
```
之后只要照常引用 `import Vue from 'vue'` 则会正确引入 Full(Runtime + Compiler) 版本

### ES6 代码未正确经过Babel编译
[参考文档](https://github.com/vuejs/babel-plugin-transform-vue-jsx)  

Ps: 基于 Babel V7  
```
npm install
  babel-plugin-syntax-jsx
  babel-plugin-transform-vue-jsx
  babel-helper-vue-jsx-merge-props
  babel-preset-env
  --save-dev
```

```js
// babel.config.js
module.exports = function (api) {
	api.cache(true)
	return {
		presets: ['env'],
		plugins: ['transform-vue-jsx']
	}
}

// webpack.config.js
module.exports = {
	// ...
	module: {
		rules: [{
			test: /.js$/,
			use: 'babel-loader'
		}]
	}
	// ...
}
```

### HMR未启用
错误信息
```
// 如果在 devServer 中开启了 hot 确并未配置 HotModuleReplacementPlugin 
// 浏览器控制台会出现如下报错
Uncaught Error: [HMR] Hot Module Replacement is disabled.
    at eval (webpack:///(:9000/webpack)/hot/dev-server.js?:7:8)
    at Object../node_modules/webpack/hot/dev-server.js (main.js:485)
    at __webpack_require__ (main.js:20)
    at eval (webpack:///multi_(:9000/webpack)-dev-server/client?:2:1)
    at Object.0 (main.js:578)
    at __webpack_require__ (main.js:20)
    at main.js:84
    at main.js:87
```
[参考文档](https://webpack.js.org/guides/hot-module-replacement/)  

```js
// webpack.dev.config.js
const webpack = require('webpack')

module.exports = {
	// ...
	devServer: {
		// ...
		hot: true
	},
	plugins: [
		// ...
		new webpack.HotModuleReplacementPlugin()
	]
	// ...
}
```

### CSS 中通过 `url(xxx)` 引入的的图片路径不正确
当我们通过配置使得输出的静态文件放到不同目录下时很容易碰到这个问题，例如我们将打包后的文件分别放到js/css/images三个目录下。  

这时如果没有特意配置过的话被 `url-loader` 处理过后的图片引用路径通常会变为 `images/xxx.png`。如果是在根目录下的 HTML 中的文件下这样访问图片不会有问题，但如果是在 CSS 中的  `url(images/xxx.png)` 则会出现找不到图片的问题。  

因为这种形式的 URL 是一种相对路径，而 CSS 文件时放在 css 目录下的，而这个路径下并没有 images 文件夹，所以当然找不到正确的图片。  

这时可通过配置 `url-loader` 的 `publicPath` 为相对服务器根目录的相对路径来解决。  

关于 `publicPath` 有如下这些[配置方式](https://webpack.js.org/configuration/output/#output-publicpath)  
```js
module.exports = {
	//...
	output: {
		// One of the below
		publicPath: 'https://cdn.example.com/assets/', // CDN (always HTTPS)
		publicPath: '//cdn.example.com/assets/', // CDN (same protocol)
		publicPath: '/assets/', // server-relative
		publicPath: 'assets/', // relative to HTML page
		publicPath: '../assets/', // relative to HTML page
		publicPath: '', // relative to HTML page (same directory)
	}
}
```

## React

### 优先引入 Polyfill
如果想要确保 Webpack 优先加载 Polyfill 代码，需要进行如下配置：
```js
app: ['babel-polyfill', './app.js']
```
详情可参见 `React` 的[Issue](https://github.com/facebook/react/issues/8379)

## 优化

### 关于 `optimization.moduleIds`
Webpack V4 新引入的这条配置其功能相当于之前的 `xxxModuleIdsPlugin`，一共有 `natural/named/hashed/size/total-size` 这五个可选值，默认为 `false` 即以一个自增的数字作为 moduleId。  

首先要理解在 Webpack 中 module 的含义就是我们在代码里每一处 `import xx from 'xx'` 中的 xx 模块，moduleId 即是 Webpack 在打包过程中赋予每一个模块的唯一 Id。  

个人认为在开发环境下将其设为 `named` 也就是每个模块的文件路径作为 Id 可以方便 Debug，在生产环境下将其设为 `hashed` 避免每次改动都导致所有模块的 Id 发生变化。

### 启用 Tree Shaking
Webpack 提供了 Tree Shaking 的功能，帮助我们在打包的过程把无用的代码块移除，进一步减小包的体积。在V4中要正确启用这个功能需要确保下列这几点：

* 使用 ES6 的 `import` 以及 `export` 来管理 Module
* `mode` 设为 `production`
* 在 `package.json` 中加入 `"sideEffects": false` 或者 `"sideEffects": ["*.css"]` 避免不小心移除样式文件
* 如果有使用 `@babel/preset-env` 注意在 .babelrc 中将其默认的配置 `"modules": "commonjs"` 
改为 `"modules": false` 也就是说不让 Babel 转义源码中的 ES6 Module 语法

### 关于 Moment.js
`moment`的国际化文件很大，所以在生产环境打包时要留意不要将不必要的国际化文件也包含进来，可以通过如下 Webpack 插件来解决这个问题：
```js
plugins: [
	// 以下的配置会使打包出来的文件只包含简体以及繁体中文的国际化
	new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|zh-tw/)
]
```

### URL Loader 以及 File Loader 的区别
Webpack中的 `url-loader` 和 `file-loader` 都是用于打包一些图片字体之类的静态资源文件，区别在于 URL Loader 会对一定大小限制内的图片进行 Base64 编码并采用 DataUrl 的形式嵌入页面或样式表。  

优点在于经过 URL Loader 编码后的图片不会占用 HTTP 请求。但在图片过大的情况下会增加文件的大小，得不偿失，更适用于处理一些项目中多处用到的小图片（1kb以下）。

### [hash] / [chunkhash] / [contenthash] 的区别
* [hash] 会在每一构建时都重新生成一个唯一的哈希值，会导致所有的静态资源文件都不会被浏览器缓存
* [chunkhash] 会根据不同的 entry 来计算hash值,如果一个 entry 中的文件被修改过则会产生不同的哈希值
缺点在于假设有一个 CSS 以及 JS 文件都来自同一 entry 会导致输出中的这俩个文件名包含的哈希值相同
也就是说，如果只变动了 CSS 文件也会同时影响到 JS 文件的缓存
* [contenthash] 会根据每个输出文件的内容来计算哈希值，只要有过改动则会产生不同的值，推荐使用这个
  
## 其它

### 使用 alias 时 eslint 报错
eslint 的 `import/no-unresolved` 规则并不会识别 alias。  

这时需要借助[eslint-import-resolver-webpack](https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers/webpack)，并在 	`.eslintrc` 文件中增加配置项：  
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

### 如何 Dubug DevServer
在使用 `devServer` 遇到问题时可以路由至URL `/webpack-dev-server`。  

通过观察打包出来的 bundle 文件详情来 Debug。
