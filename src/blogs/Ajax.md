# Ajax (Asynchronous JavaScript And XML)

## Ajax 是什么？
在 Web 发展之初，客户端与服务端通常仅通过 `<form>` 表单进行数据交互  
当表单被提交时页面会进行刷新，服务器端可能会根据提交的数据返回不同的 HTML  
随着 Web Application 的功能愈加复杂，每次交互都需要刷新页面显然给用户带来糟糕的体验  
这个时候 Ajax 出现了(2005 年左右开始渐渐被广为使用)，Ajax 通过 HTTP 请求使得页面可以在不刷新的情况下与服务器异步的交换数据  
浏览器主要通过下面介绍的 `XMLHttpRequest` 对象来操作 Ajax 请求  
(Ps: 关于名称中的 XML 其实很有误导性，只是因为该技术诞生之初时 XML 很火爆  
大家可能本来认为 XML 会发展成为通用的数据交换格式，没想到现在 JSON 异军突起成为最流行的轻量格式，由此亦可见科技进步之快)

## XMLHttpRequest API
由于该 API 是依据 HTTP 协议设计的，所以我们首先要来了解一下关于 HTTP 请求及响应的几个组成部分  
请求：
* HTTP Method (Ps: GET/POST/DELETE...)
* Request URL
* Request Header
* Request Body

响应：
* Response Status (Ps: 200 OK/404 Not Found)
* Response Header
* Response Body

下例阐述了一个完整的 Ajax 流程，可以看出相应的 API 都相对的在获取或修改上述的几个值
```js
// 1. 实例化对象
const request = new XMLHttpRequest()

// 2. 确定请求的 Method 以及 URL
// 默认为异步请求 可以通过把第三个参数设为 false 来进行同步请求（不建议 同步请求会导致浏览器阻塞）
// URL 支持相对路径 默认为相对当前 HTML 的 URL 可以通过 <base> 标签进行修改
// 第四、五个参数可以分别为 username、password 这样会使得发起请求的 URL 变为
// http://username:password@www.xx.com/api 用于进行用户鉴权（到目前为止还未碰到过这种形式 感觉应该用不到）
request.open('POST', 'http://www.xx.com/api', true)

// 3. 设置 Request Header
// 类似 Cookie Content-Length User-Agent Date 等请求头是由浏览器自己设置的
// 如果试图通过该方法设置这些请求头 浏览器会报错 Refused to set unsafe header "XXX"
// 重复设置相同的 Request Header 并不会修改原先的值 而是在原有的值上新增
// 例如 request.setRequestHeader('a', '1') request.setRequestHeader('a', '2')
// 发出去的请求中的请求头是 a: 1, 2
request.setRequestHeader('Content-Type', 'application/json')

// 4. 设置监听请求的回调函数
// readyState 共有五个可能值
// XMLHttpRequest.UNSENT 0 请求还未 open()
// XMLHttpRequest.OPEND 1 请求已经 open()
// XMLHttpRequest.HEADERS_RECEIVED 2 收到响应头
// XMLHttpRequest.LOADING 3 收到响应体
// XMLHttpRequest.DONE 4 请求完成
// 理论上来说最合适的方式是通过 request.readyState === XMLHttpRequest.DONE 来判断请求是否完成
// 但是由于 IE8 并不兼容 所以大多是情况下我们会通过 request.readyState === 4 来判断
request.onreadystatechange = () => {
	if (request.readyState === 4) { // 响应已收到
		if (request.status === 200) {
			// 请求正确
			// 还可以通过 request.getAllResponseHeaders() 获取所有响应头
			// 不过该方法返回的是包含所有响应头的字符串 需要转化才能获得键值对
			const type = request.getResponseHeader('Content-Type')
			if (type === 'text/plain') {
				return request.reponseText
			} else if (type === 'application/json') {
				return JSON.parse(request.response)
			} else if (type === 'application/xml') {
				// 应该用不到 暂时未碰到过以 XML 来作为数据交换格式的
				return request.reponseXML
			}
		} else {
			// 请求错误
		}
	}
}

// 5. 设置 Request Body 并正式发送请求
// 请求体中的数据格式需要与请求头 Content-Type 中的一致
// 该例中我们采用 JSON 作为数据交换格式 所以这里需要将对象讲过 JSON.stringify() 处理
// 如果不需要传递 Request Body 可以 request.send(null)
request.send(JSON.stringify(data))
```
除上述简单的请求响应过程外， XHR 还提供了更多的监听事件
```js
// 在主动调用 request.abort() 或者其余方式导致请求被丢弃的情况下触发
request.onabort = () => {}
// 当请求时长超过了 request.timeout 设置的时间时触发
request.ontimeout = () => {}
// 当发生 NetWork Error（Ps: 类似 DNS 解析错误/CORS 跨域失败） 时触发
request.onerror = () => {}
// 请求完成时触发（Ps: 不考虑兼容性的情况下可以用这个取代监听 readystatechange ?）
request.onload = () => {}

// 规范要求一个请求在完成时必定且只能触发上述事件中的一个
```

当发起一个跨域请求并且希望其携带上 Cookie 时，需要额外进行如下设置
```js
request.withCredentials = true
```

每个 `XMLHttpRequest` 的实例化对象代表了一对 request/reponse ，如果反复利用同一个对象会导致先前的请求被 abort  
由于 HTTP 协议对一个请求有着（方法 / URL => 请求头 => 请求体）的先后顺序要求  
`XMLHttpRequest` API 的调用顺序也有着相同顺序 open() => setRequestHeader() => send()  
例如在 `open()` 之前调用 `setRequestHeader()` 会导致浏览器报错
```
Uncaught DOMException: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.
```

当我们想利用 XHR 来上传文件时情况会更加复杂一点  
首先要提的是早期的 XHR 并不支持文件上传，只能利用 `<form>` 表单加 `<input type="file">` 来实现  
IE10+ 才开始支持通过 XHR2 以及 `FromData` 来实现文件上传
```js
const data = new FromData()
const dom = document.querySelector('input[type="file"]')
data.append('filename', dom.files[0].name)
data.append('file', dom.files[0])

// 监听上传进度
// 同理 下载时可以直接通过 request.onprogress 来监听进度
request.upload.onprogress = e => {
	if (e.lengthComputable) { // 如果支持统计内容长度
		console.log(`进度${e.loaded/e.total}`)
	}
}
// 上传完成
request.upload.onload = () => {}
// 利用 FormData 上传数据时 Content-Type 会被默认设为 multipart/form-data
request.send(data)
```

## 总结
通过上面这些例子不难看出 XMLHttpRequest 的 API 受时代所拖累，设计的并不完美  
开发者使用起来显然也很麻烦，所以才出现了 jQuery 中的 `$.ajax()` 以及时下比较流行的 `axios` 等框架对其的封装  
除开这些框架外更令人期待的是浏览器原生支持的 Fetch API 的出现  
虽然目前的兼容性堪忧但是 Fetch 作为 *A modern replacement for XMLHttpRequest.*  
相信在不久的将来会给我们带来更多方便
