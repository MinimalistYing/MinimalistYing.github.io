const through = require("through-gulp"),
	fs = require("fs")

function markdown() {
	var stream = through(function(file, encoding,callback) {
		var originHtml

		if (file.isNull()) {
	        throw "Please Check Files!"
	    }

	    //buffer对象可以操作
        if (file.isBuffer()) {
            //拿到单个文件buffer             
            file.contents = new Buffer(file.contents.toString("utf-8"),"utf-8");
        }
         
        //stream流是不能操作的,可以通过fs.readFileSync
        if (file.isStream()) {
            //同步读取
            file.contents = new Buffer(s.readFileSync(file.path).toString("utf-8"),"utf-8");
        }

        originHtml =file.contents.toString("utf-8");// 转化为字符串
        console.info(originHtml);

		callback()
	},function(callback) {
      // just pipe data next, just callback to indicate that the stream's over
      callback();
    });
}

module.exports = markdown;