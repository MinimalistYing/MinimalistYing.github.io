# NPM 相关问题记录

## 初始化发布公共包到 npm 库的步骤
* 有一个包含 `package.json` 的文件夹
* 在命令行中使用 `npm login` 登录已有的 npm 账户
* 确保 `package.json` 中 author 与已登录的账户名称一致
* 初始化发布必须在 `npm publish` 后加上 `--access public`
