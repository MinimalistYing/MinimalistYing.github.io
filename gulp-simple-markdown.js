/**
 * gulp插件
 * 为了省去我在写Memo时需多次输入<pre></pre>等类似标签的重复劳作
 * 并提升原文件的可读性
 * 利用markdown的格式写src中的memo
 * 自动转化为所需的html
 */
const through = require("through-gulp"),
	fs = require("fs")

function markdown() {

	var stream = through(function(file, encoding,callback) {
		var originHtml, result

		if (file.isNull()) {
			throw "Please Check Files!"
		}

		// buffer对象可以操作
		if (file.isBuffer()) {
			//拿到单个文件buffer             
			file.contents = new Buffer(file.contents.toString("utf-8"),"utf-8")
		}
		 
		// stream流是不能操作的,可以通过fs.readFileSync
		if (file.isStream()) {
			// 同步读取
			file.contents = new Buffer(s.readFileSync(file.path).toString("utf-8"),"utf-8")
		}

		originHtml = file.contents.toString("utf-8")// 转化为字符串
		result = code(time(memocard(originHtml)))// 将原字符串转化成所需的HTMl
		file.contents = new Buffer(result)

		this.push(file)
		// 声明文件已处理完毕
		callback()
	},function(callback) {
		// 声明文件已处理完毕
		callback()
	});

	return stream// 最后将文件流返回
}

/**
 * 将Markdown代码转化为HTML
 * 把`..`替换为<pre>..</pre> 
 * 对其中的特殊字符进行转义
 * 把换行替换为<br>
 * @param  {[String]} text [原始文本]
 * @return {[String]}      [转化后的文本]
 */
function code(text) {
	return text.replace(/ `(.+?)` /g, (match, $1) => {// match为匹配串 $1为第一个捕获型分组匹配的字符串
				var result = $1.replace(/</g, '&lt;')// 转义 <
							.replace(/>/g, '&gt;')// 转义 >
							.replace(/"/g, '&quot;')// 转义 "
							.replace(/  /g, '<br>')// 在代码中连续的俩个空格当作换行处理

		return `<pre>${result}</pre>`
	})
}

/**
 * 将Memo中
 * [- 备忘笔记 -]替换为
 * <div class="memo-card">备忘笔记</div>
 * 形式的HTML
 */
function memocard(text) {
	return text.replace(/\[- ([\s\S]+?) -\]/g, '<div class="memo-card">$1</div>')
}

/**
 * 将 #2017/8/20# 形式写的日期替换为
 * <div class="memo-time">2017/8/20</div>
 * 形式的Html
 */
function time(text) {
	return text.replace(/#(.+?)#/g, '<div class="memo-time">$1</div>')
}

module.exports = markdown;