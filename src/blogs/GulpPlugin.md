# 如何编写一个自己的GulpPlugin

```
const through = require("through-gulp"),
	fs = require("fs")

function myPlugin() {
	return through(function(file, encoding, callback) {
		let result, origin
		
		// 传入的文件为空
		if (file.isNull()) {
			throw "Please Check Files!"
		}

		// buffer对象可以直接操作
		if (file.isBuffer()) {
			//拿到单个文件buffer             
			file.contents = new Buffer(file.contents.toString("utf-8"),"utf-8")
		}
		 
		// stream流是不能操作的,可以通过fs.readFileSync
		if (file.isStream()) {
			// 同步读取
			file.contents = new Buffer(s.readFileSync(file.path).toString("utf-8"),"utf-8")
		}

		origin = file.contents.toString("utf-8") // 转化为字符串
		result = doYourPluginWork(origin) // 处理源文件 实现插件的逻辑
		file.contents = new Buffer(result) // 将源文件的内容替换为插件处理完之后的内容

		this.push(file)
		callback() // 声明文件已处理完毕
	}, function(callback) {
		callback() // 声明文件已处理完毕
	})
}

module.exports = myPlugin
```
