# 记一次引入依赖路径未注意大小写导致的问题

## 起因
由于是 TS 项目，所以除了正常引用 Antd 组件之外还需要额外引入一些类型申明。
```js
import { TablePaginationConfig } from 'antd/lib/Table'
```
在 Mac 上本地构建、测试都没有问题，但是试着在测试环境构建就抛出如下错误：

![错误信息](https://pic.imgdb.cn/item/60b5a2dd39f6859bc27f714e.jpg)

从报错信息上来看是找不到相关依赖，但是登上服务器确认在 node_modules 下是有相关依赖的，并且在本地删了 node_modules 重装后构建仍然正常。  

这种本地都正常，但是一上线就出问题的情况确实比较让人头疼。

## 解决方案
经过再三检查，突然发现 node_modules 下 Antd 相关目录都是小写的，所以修改如下：
```js
import { TablePaginationConfig } from 'antd/lib/table'
```
Emmmmmm...  

明明大小写错了，为什么本地可以正常工作呢？网上搜了下，发现碰到相关问题的人还不少，因为 Mac OSX 默认对文件路径的大小写不敏感，而服务器使用的 Unix 是对大小写敏感的。  

甚至有人专门写了个 [Webpack Plugin](https://github.com/Urthen/case-sensitive-paths-webpack-plugin) 来强制在所有操作系统上对引入依赖的路径进行大小写敏感的全等校验。


