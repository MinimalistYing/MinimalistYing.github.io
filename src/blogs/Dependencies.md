# 聊聊 package.json 中的各类依赖

## 引子
相信有很多同学对 `package.json` 中的 `dependencies|devDependencies|optionalDependencies|peerDependencies|bundledDependencies` 都有过疑惑，为啥一个依赖包也要分这么多类型呢？  

Emmmm...对日常开发来讲可能还真没有那么必要，大不了影响到每次部署时的安装时间，但是如果你想自己开发一个库或者框架的话可能就需要去好好研究一下了。

## dependencies
你的代码在生产环境运行时必须的依赖包，如果安装失败则会报错，因为会导致程序无法正常执行。  

假设你在写一个 React 的前端项目，那么类似 `react` `react-dom` `react-router` 这些都应该属于 `dependencies`。

## devDependencies
只在开发时需要的依赖，`yarn install --production` 不会安装列在 `devDependencies` 中的依赖。个人感觉主要是 node 项目可能会用到这个，因为前端项目其实在 build 时也是需要这些依赖的。  

类似 `Babel` `Webpack` 等开发用的工具都应该属于 `devDependencies`。

## optionalDependencies
这个比较少见，指的是可选的依赖，如果安装失败也不会对程序的运行或打包造成影响。

## peerDependencies
如果你在开发一些开源库的框架或者组件，那么你可能会用到这个。  

假设我们想发布一个 React 实现的日历组件，如果想正常使用你的组件就需要先安装好 React 相关的资源。但是想必你发布包的时候不会想把整个 React 也一起打包进去，这个时候就需要一种途径来声明说如果你想使用我的组件，那么需要你自己项目里已经安装了相应依赖供我使用。

## bundledDependencies
这个更罕见，通常指的是一些不存在于 NPM Registry 中的一些包，类似于一些二进制文件之类的。  

举个不恰当的例子，你有一份教学视频文件需要和你的代码一起被打包发布，那么你就可以将这个文件放入 `bundledDependencies`。
  
## 总结
总的来说，如果你在开发一份前端的业务项目，那么这些东西的意义不大，你把所有的依赖都当作 `dependencies` 问题也不大。  

如果你在开发一份 Node 的后端项目，那么你可能需要把一些工具类的依赖放到 `devDependencies` 中，这样可以减少最终包的体积，加快安装速度。  

如果你在开发一份给他人使用的库或框架，那么你可能需要更全面的去管理你的依赖来达成使用方既能正确调用同时包体积尽可能小的目的。