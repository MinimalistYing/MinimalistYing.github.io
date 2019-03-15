# React 与 Vue 的一些对比
Ps: 根据个人经验总结 有些结论可能并不客观

## React
* 单向数据流 申明式视图
* 官方提供的 API 较为简单 大多数功能交给开源社区扩展 例如 Redux / React-Router 等
* CSS 样式文件与组件文件分离
* 实现表单以及表单验证时的写法较为繁琐
* 父子组件通信 Props Down 只能向下单向传递
* 推崇 JSX 语法 也就是 CSS HTML 全都写在 JSX 中
* React-Router 不支持钩子函数 需要自己实现

## Vue
* 数据双向绑定
* 核心团队统一维护较为全面的 API
* 支持单文件组件 CSS / HTML / Javascript 都可以写在同一文件中 个人更喜欢 Vue 提供的 `scoped` 样式特性  
相较于 React 借助 PostCSS 的 Style In CSS 写法感觉更简明一点
* 由于双向绑定的存在 可以更方便的实现表单以及表单验证功能
* 父子组件通信 Props Down / Events Up 可以双向通信
* 虽然都在单文件组件中 但是 CSS / HTML / Javascript 都是分开写的
* Vue-Router 支持钩子函数 用起来很方便
