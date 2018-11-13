# 记录配置 Webpack 过程中碰到的问题以及解决方案
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
解决方案
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
由于`vue-loader`内部实现需要依赖`vue-template-compiler`  
但我们通过 npm 安装`vue-loader`时并未同时安装`vue-template-complier`  
所以需要显示的在本地项目安装一下
解决方案
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
由于默认的`.vue`文件中`<style>`的lang属性值为`css`  
所以`vue-loader`默认会将`<style>`块中的样式文件抽出作为 Css 文件提供给`webpack`加载  
而不配置`css-loader`的话`webpack`是无法正确加载 Css 文件的
解决方案
```
npm i css-loader --save-dev
```
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
[Css Loader](https://webpack.js.org/loaders/css-loader/)  
Css Loader 的作用是使我们可以在 Js 文件中通过 `import style from 'xxx.css'` 来告诉 webpack 这个文件对样式的依赖  
这样当打包这个 Css 文件时也会将 xxx.css 算入其中  
当这样并不能使样式文件被浏览器正确加载  
Style Loader 正是启到将依赖的样式文件通过在页面上插入 `<style>` 标签的形式注入到页面中  
所以简单来讲 不做其他特殊配置的话 一定要同时使用这俩个 Loader 才能使得样式正确加载

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
这个问题出现主要是由于 Vue 对外提供了俩个版本的最终构造文件 Full(Runtime + Compiler) 以及 Runtime-only   
俩者的区别就在于一个有 Compiler 另一个没有  
此外，在 Vue 的 package.json 中可以看到 `"module": "dist/vue.runtime.esm.js"`  
也就是说在使用 webpack 打包时 `import Vue from 'vue'` 默认使用的是 vue.runtime.esm.js 也就是 Rutime-only 的版本  
Compiler 的主要作用在于将文件中的模版字符串转化为 render 函数（注意这里的文件不包括 .vue 文件 因为他们会被 vue-loader 自动预编译）  
举例，在如下 Vue 应用的主入口文件中  
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
所以以上问题的解决方案有俩种  
其一是如果我们确定不会在除 .vue 文件外使用 Vue 的 template  
那么直接照常引入默认的 Runtime-only 版本即可  
否则则需要我们显示的引入 Full(Runtime + Compiler) 版本  
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
解决方案
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
解决方案
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

## React
