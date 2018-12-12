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
request.onreadystatechange = () => {
	if (request.readyState === 4) { // 响应已收到
		if (request.status === 200) {
			// 请求正确
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

每个 `XMLHttpRequest` 的实例化对象代表了一对 request/reponse ，如果反复利用同一个对象会导致先前的请求被 abort  
由于 HTTP 协议对一个请求有着（方法 / URL => 请求头 => 请求体）的先后顺序要求  
`XMLHttpRequest` API 的调用顺序也有着相同顺序 open() => setRequestHeader() => send()  
例如在 `open()` 之前调用 `setRequestHeader()` 会导致浏览器报错
```
Uncaught DOMException: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.
```

## Fetch API
