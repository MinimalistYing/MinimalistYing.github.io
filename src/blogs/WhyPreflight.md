# 为什么 CORS 需要在跨域请求前进行预校验 (Preflight)
大家都知道浏览器在发起复杂跨域请求前会先发送一个 `OPTIONS` 请求来进行预校验  
校验通过后才会正式将携带参数的请求发送给服务器  
平时谈论的大多是什么情况下会需要预校验  
不知道大家有没有仔细考虑过浏览器为什么会这么做？  
不这么做又会导致什么问题？

下面先来看看 [W3C 协议](https://www.w3.org/TR/cors/#preflight-request) 中的说法：
> To protect resources against cross-origin requests that could not originate from certain user agents  
before this specification existed a preflight request is made to ensure that the resource is aware of this specification.

光看这段文字可能大家还是一头雾水，下面让我们用一个例子来更加形象的描述一下这个问题  
假设浏览器并不会发送预检验（Preflight）请求，而是直接发送正式请求来判断是否允许跨域  
我们向服务器发送一个跨域的 `DELETE` 请求 `https://www.a.com/deleteuser?id=123` 来删除一个用户  

## 服务端正确设置了 CORS

这种情况下无论是否先发起预检验请求都没有问题  
假设不发送，服务器也可以直接根据正式请求的来源域以及请求头来判断是否接受该跨域请求  
未通过则返回告诉浏览器不允许该跨域请求  
反之请求通过了跨域校验则继续按正常流程处理  

## 服务端未正确设置 CORS

比如服务端使用的仍是在 CORS 出现前开发的代码  
这个时候如果浏览器不做预检验，直接将真实请求发至服务器来判断是否满足跨域条件  
服务器接受到了如上的 `DELETE` 请求，由于并未设置过 CORS  
也就是说服务器会默认浏览器发来的请求都是满足同源策略的  
便直接将该请求当作普通请求进行处理  
虽然浏览器端虽然可能会发现响应中并没有 CORS 相关端响应头而抛出跨域错误  
但是服务端实际上已经将请求接受
在这种情况下浏览器的同源策略就不攻自破了

## 预检验请求为什么能解决这个问题 

大家都知道，预检验请求是一个不携带任何具体参数的 `OPTIONS` 请求  
采用 CORS 的服务器会正确的根据请求头来判断是否接受该跨域请求，并返回相应的响应告知浏览器  
未采用的服务器接受到请求也会正常处理  
但是返回的响应中不会正确的包含 Access-Control-Allow-* 等响应头   
浏览器接收到预检验请求的响应后会根据响应头来判断是否支持跨域  
只有当响应头满足 CORS 的相关设置才会继续发送正式的跨域请求
