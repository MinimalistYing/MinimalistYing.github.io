# IM - Instant Messenger 系统前端开发二三事

## 序
当听说要开发一个 IM 系统时，中后台系统已做到麻木的我无疑是惊喜的。在网上搜索了下，发现很少有相关的介绍，借此机会在这里记录一下开发中用到的技术和碰到的问题，希望能给后来人带来点启发。

## 如何显示微信系统自带表情
首先微信表情的工作机制大概是这样的（Ps：钉钉应该也类似）：系统自带的表情其实是通过纯文本传输的，只不过在显示消息的时候会把特定的文字转译成表情图案。例如 `[微笑]` => 😊。  

所以我们要做的就是找到消息中匹配的文字，并在页面上展示前转为对应的图片。  

第一步，我们需要找到对应的表情资源以及存储对应关系的 Map，资源可以在 CSDN 上找到，然后我是通过如下数据结构存储的对应关系：
```js
const EMOJI = [
  ['100.gif', '[微笑]'],
  ['101.gif', '[伤心]'],
  // ...
]  
```

第二步，对消息进行转译后显示，首先想到的是把消息中的 `[**]` 转为对应的 `<img src={xxxx} />` 然后通过 `dangerouslySetInnerHTML` 把消息直接展示。因为我们需要 `<img/>` 标签来显示图片，但显然这会导致安全问题。  

最终解决方案如下：
```jsx
function contentToHTML(content: string) {
  // 利用了 String.prototype.split 会把正则中捕获型分组的值也放入结果数组中的特性
  return content.split(/(\[[^\]]+\])/).map((item: string) => {
    if (/(\[[^\]]+\])/.test(item)) {
      const emoji = EMOJI.find(emoji => emoji[1] === item);
      return emoji ? <img src={emoji[0]} /> : item;
    }
    return item;
  });
}
```
然后在 React 中：
```jsx
<p>{contentToHTML(content)}</p>
```

## WebSocket
在 WebSocket 没出现之前，想要实现服务端推送消息的需求只能通过轮询。缺点很明显，会浪费大量时间在 HTTP 请求的建立上。  

IM 系统对实时性要求较高，如果采用轮询的话会导致用户明显感受到延迟。所以 WebSocket 在这个场景下是必不可少的。  

稍微提一下 WebSocket 的协议细节，连接的建立也是通过 `http` 来完成的，只不过会通过请求头携带的
```
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```
来实现一个协议升级过程。当实现了 WebSocket 的服务器接收到该请求时就会将连接升级，然后连接就成功建立了。  

在前端连接一个 WebSocket 个人感觉比发起一个正常 AJAX 请求还简单：
```js
// 与 https 相对应的 WebSocket 也有 wss
const ws = new WebSocket('ws://xxx.com/api')

// 连接建立成功
ws.addEventListener('open', e => {})
// 连接关闭
ws.addEventListener('close', e => {
  // e.code 错误原因 https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
  // 可以根据该错误原因来判断是客户端主动关闭还是意外关闭
})
// 收到服务端推送消息
ws.addEventListener('message', e => {})
// 向服务端发送消息
ws.send(JSON.stringify({ data: 'hello' }))
// 主动关闭连接
// ws.close(1000) 可以传入错误 code, 在监听关闭事件时可以根据这个 code 做一些逻辑区分
ws.close()

// 可以用于判断当前等连接状态
ws.readyState !== ws.OPEN
```
需要注意的是如果长时间没有收发消息浏览器或者服务器好像会把连接自动断开，所以首先我们需要每间隔一段时间主动向服务端发送一条心跳消息来保证连接不关闭。另外考虑到断网等意外情况，需要实现自动重连机制，这样才能让用户对意外的掉线无感知。  

## 关于 Redux 的一点思考
做了那么多的中后台系统前端，一直都没有想明白 Redux 的意义在哪。看那些把全部状态都放在 Redux 中管理的项目真是让人头大。发自内心的讲，我觉得这么做就是跟自己过不去，碰到过无数 Bug 都是因为全局状态没有及时清除或者被不小心改变引起的。再算上引入 Redux 后需要多写的 Boilerplate ，这么做的同学们估计真的是嫌自己加班加少了。  

这次上手做 IM 系统的前端开发，让我突然明白了 Redux 文档里所说的
> You'll know when you need Flux. If you aren't sure if you need it, you don't need it.

以及 Dan Abramov 说的
> I would like to amend this: don't use Redux until you have problems with vanilla React.

当碰到点击通讯录组件需要改变右侧信息栏以及会话列表状态时，当碰到几乎所有组件都需要获取当前正在的聊天对象数据时。几乎是下意识的，你就会想到我是不是需要把这些数据放到 Redux 中管理。  

所以，看到这篇文章的同学们，真的，不要为了 Redux 而 Redux。不要觉得好像只有用上了 Redux / RxJS / dva 才显得技术高深，更不要把页面中所有的状态都放到 Redux 中管理。当真的有全局需要的状态 React 自身不能很好的支持时，你会发现的，那个时候再考虑 Redux 也不迟。