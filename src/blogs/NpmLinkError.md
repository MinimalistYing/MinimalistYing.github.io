# 使用 NPM Link 导致 React 报错 Invalid Hook Call

最近在开发一个内部使用的 React 业务组件库，为了本地调试方便，所以使用了 `npm link` 直接将业务项目和组件库软链接到了一起。结果直接整个项目就跑不起来了，报错信息如下：

![错误信息](https://pic.imgdb.cn/item/60a761556ae4f77d3557906f.png)

再三确认了一下代码内的 Hook 使用没有问题，百度一下发现不少人都碰到过该问题，例如 [这里](https://blog.csdn.net/u011393161/article/details/107807496)、[这里](https://zhuanlan.zhihu.com/p/272694482)、[还有这里](https://blog.csdn.net/qq_38506368/article/details/113504759)。  

最终确定是因为 `npm link` 而引起的错误，实际上 [官方文档](https://reactjs.org/warnings/invalid-hook-call-warning.html) 有特意提到过这个问题和解决方案：

![解决方案](https://pic.imgdb.cn/item/60a765dc6ae4f77d3579b9e5.jpg)

完。