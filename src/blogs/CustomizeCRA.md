# 如何基于 Create-React-App 定制自己的前端脚手架

## 前言
相信大家多多少少都自己搭建过前端项目，不管是拷贝一个老项目删干净还是从头开始搭一个空项目都会进行不少重复的无意义工作。这也就是为什么现在会有各种各样的脚手架来帮助我们快速搭建一个前端项目，`create-react-app` 是官方维护的一个脚手架，它的思想是尽可能的把配置文件隐藏起来，让我们的项目看起来更干净，也能阻止团队成员去随意修改。  

但是通常来说，企业级的项目往往会需要我们去调整一些配置。我们可以借助 `npm run eject` 这个指令来把隐藏的配置文件暴露出来，但是这个操作是不可恢复的，所以如果我们通过这种方式来自定义配置的话就违背了 `create-react-app` 的设计思想。另外，如果每有一个新项目都这么操作一遍仍然会让我们做很多重复工作。  

所以下面就让我们来看看怎么根据公司不同的需求来定制一个通用的脚手架。

## 准备工作
* 首先我们需要 Fork 一份 [creat-react-app](https://github.com/facebook/create-react-app) 仓库
* 找到 `packages/cra-template`，脚手架产出的模版需要从这里修改
* 找到 `packages/react-scripts`，一些 Webpack 的配置需要从这里修改
  
## 修改模版
假设公司内部使用 UI 库是 `Ant Design` 格式规范用的是 `Standard`，我们希望脚手架生成的项目直接就能使用不需要我们再去 `npm install`。  

首先需要修改一下 `packages/cra-template/template.json`
```json
{
  "package": {
    "dependencies": {
      "antd": "^4.3.0"
    },
    "devDependencies": {
      "standard": "^14.3.4",
      "standard-loader": "^7.0.0",
      "babel-eslint": "^10.1.0"
    },
    "scripts": {
      "lint": "standard",
      "fix": "standard --fix"
    },
    "standard": {
      "parser": "babel-eslint"
    }
  }
}
```
`template.json` 中的 `dependencies` 以及 `scripts` 会被 merge 进脚手架生成项目的 `package.json`，其余的字段也会自动加入 `package.json` 中。所以如果公司有什么通用的依赖需要安装，或者一些 `babel` 以及 `eslint` 的配置也可以在在这里进行修改。

此外我们还可以调整脚手架产出项目的目录结构，`packages/cra-template/template` 下的所有文件都会被拷贝到产出项目的根目录。

## 修改构建相关配置
`create-react-app` 默认使用 `eslint` 来进行代码规范限制，我们现在希望改成使用 `Standard`。  

修改 `packages/react-scripts/config/webpack.config.js`，找到之前配置 eslint 的地方修改为：
```js
// First, run the linter.
// It's important to do this before Babel processes the JS.
{
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  enforce: 'pre',
  use: [
    {
      options: {
        parser: 'babel-eslint'
      },
      loader: require.resolve('standard-loader'),
    },
  ],
  include: paths.appSrc,
}
```
细心一点就可以发现 `packages/react-scripts/config` 以及 `packages/react-scripts/scripts` 和我们 `npm run eject` 后的 `config` 以及 `scripts` 是一样的，所以改动逻辑也是一致的。

## 发布
接下来我们需要分别去修改我们自己的 `react-scripts` 以及 `cra-template` 的 `package.json`，修改一下名字和版本号就可以作为自己的包发布至 npm 了。例如我们分别把名字改为 `my-react-scripts` 以及 `cra-template-my` 然后版本都改为 `0.0.1`。

## 如何使用
```bash
npx create-react-app my-app --template my --scripts-version my-react-scripts
```

如果一切顺利的话，切到 `my-app`，`npm start` 后你就可以看到一个初始化自带 `AntDesign` 以及 `Standard` 的项目啦～
