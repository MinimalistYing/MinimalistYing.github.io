/**
 * gulp插件
 * 为了省去我在写Memo时需多次输入<pre></pre>的重复劳作
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
            file.contents = new Buffer(file.contents.toString("utf-8"),"utf-8");
        }
         
        // stream流是不能操作的,可以通过fs.readFileSync
        if (file.isStream()) {
            // 同步读取
            file.contents = new Buffer(s.readFileSync(file.path).toString("utf-8"),"utf-8");
        }

        originHtml = file.contents.toString("utf-8");// 转化为字符串
        result = originHtml.replace(/ `(.+?)` /g, '<pre>$1</pre>');
        file.contents = new Buffer(result);

		this.push(file)
		callback()
	},function(callback) {
      callback();
    });

    return stream;// 最后将文件流返回
}

module.exports = markdown;