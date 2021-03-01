# IM - Instant Messenger 系统前端开发二三事

## 序
当听说要开发一个 IM 系统时，中后台系统已做到麻木的我无疑是惊喜的。在网上搜索了下，发现很少有相关的介绍，借此机会在这里记录一下开发中用到的技术和碰到的问题，希望能给后来人带来点启发。

## 如何显示微信系统自带表情
首先微信表情的工作机制大概是这样的（Ps：钉钉应该也类似）：系统自带的表情其实是通过纯文本传输的，只不过在显示消息的时候会把特定的文字转译成表情图案。例如 `[微笑]` => 😊。  

所以我们要做的就是找到消息中匹配的文字，并在页面上展示前转为对应的图片。  

第一步，我们需要找到对应的表情资源以及存储对应关系的 Map，资源可以在 CSDN 上找到，然后我是通过如下数据结构存储的对应关系：
```js
const EMOJI = new Map([
  ['[微笑]', '100.gif'],
  ['[伤心]', '101.gif'],
  // ...
])
```

第二步，对消息进行转译后显示，首先想到的是把消息中的 `[**]` 转为对应的 `<img src={xxxx} />` 然后通过 `dangerouslySetInnerHTML` 把消息直接展示。因为我们需要 `<img/>` 标签来显示图片，但显然这会带来安全性上的问题。  

最终解决方案如下：
```jsx
function contentToHTML(content: string) {
  // 利用了 String.prototype.split 会把正则中捕获型分组的值也放入结果数组中的特性
  return content.split(/(\[[^\]]+\])/).map((item: string) => {
    if (/(\[[^\]]+\])/.test(item)) {
      const emoji = EMOJI.get(item);
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

在前端建立一个 WebSocket 链接个人感觉比发起 AJAX 请求要简单：
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
需要注意的是如果长时间没有收发消息浏览器或者服务器好像会把连接自动断开，所以首先我们需要每间隔一段时间主动向服务端发送一条心跳消息来保证连接不关闭。另外考虑到断网等意外情况，还需要实现自动重连机制，这样才能让用户对意外的掉线无感知。  

## 关于 Redux 的一点思考
做了那么多的中后台系统前端，一直都没有想明白 Redux 的意义在哪。看着那些把整个应用的状态都放在 Redux 中管理的项目真是让人头大。发自内心的讲，我觉得这么做就是跟自己过不去，碰到过无数 Bug 都是因为全局状态没有及时清除或者被不小心改变引起的。再算上引入 Redux 后需要多写的 Boilerplate ，这么做的同学们估计真的是嫌自己加班加少了。  

这次上手做 IM 系统的前端开发，让我彻底领悟了 Redux 文档里所说的
> You'll know when you need Flux. If you aren't sure if you need it, you don't need it.

以及 Dan Abramov 说的
> I would like to amend this: don't use Redux until you have problems with vanilla React.

当碰到点击通讯录组件需要改变右侧信息栏以及会话列表状态时，当碰到几乎所有组件都需要获取当前正在的聊天对象数据时。几乎是下意识的，你就会想到我是不是需要把这些数据放到 Redux 中管理。  

所以，看到这篇文章的同学们，真的，不要为了 Redux 而 Redux。不要觉得好像只有用上了 Redux / RxJS / dva 才显得技术高深，更不要把页面中所有的状态都放到 Redux 中管理。当真的有全局需要的状态而 React 自身不能很好的支持时，你会发现的，那个时候再考虑 Redux 也不迟。

## 长列表对页面性能的影响以及优化
项目一上线发现客服个个都有着几千个好友和群聊，直接导致通讯录列表非常卡顿，可以明显的观察到渲染大量 DOM 节点导致的性能问题。借助 Chrome 的 Performance 评估了一下，页面初始化完全加载完成需要接近 5s。  

首先考虑到的是头像资源的懒加载，一次请求几千张图片很明显会占满网络带宽。解决方法很简单，如果不考虑兼容性的话直接这样就好了：
```html
<img loading="lazy" src="xxx" />
```

再就是要尽可能的减少页面上的 DOM 节点，这个通常的做法是分页，但是通讯录这种场景分页显得不太合适。所以最终采用的是窗口化技术，推荐使用 [react-window](https://github.com/bvaughn/react-window)，如果不能完全支持需求的话还可以使用 [react-virtualized](https://github.com/bvaughn/react-virtualized) 。都是相同的作者开发的，前者更为轻量。  

最终成功将页面初始化到加载完成的时间优化到了 1.5s 左右(Ps: 不是用户可以开始操作的时间，而是所有逻辑都运行完的时间)。  

下面截取部分 `react-window` 的源码来简单介绍下最基础的窗口化技术实现：
```jsx
class List extends React.PureComponent {
  render () {
    // ...省略

    // 根据当前滚动区域的 scrollOffset 来判断需要渲染的列表项数据
    // 例如一个列表共有 10000 条记录，在滚到到一个区域时只需要展示其中第 10-20 条记录
    // 所以最终只需要渲染这 10 条记录的 DOM 节点
    const [startIndex, stopIndex] = this._getRangeToRender();

    const items = [];
    if (itemCount > 0) {
      for (let index = startIndex; index <= stopIndex; index++) {
        items.push(
          createElement(children, {
            data: itemData,
            key: itemKey(index, itemData),
            index,
            isScrolling: useIsScrolling ? isScrolling : undefined,
            /*
              根据当前渲染的是第几项来确定每个列表项的定位样式
              {
                position: 'absolute',
                left: isRtl ? undefined : offsetHorizontal,
                right: isRtl ? offsetHorizontal : undefined,
                top: !isHorizontal ? offset : 0,
                height: !isHorizontal ? size : '100%',
                width: isHorizontal ? size : '100%',
              }
            */
            style: this._getItemStyle(index),
          })
        );
      }
    }
    // ...省略

    return createElement(
      outerElementType || outerTagName || 'div',
      {
        className,
        onScroll,
        ref: this._outerRefSetter,
        /*
          包裹可滚动区域的样式，宽度高度固定，相对定位
        */
        style: {
          position: 'relative',
          height,
          width,
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          willChange: 'transform',
          direction,
          ...style,
        },
      },
      createElement(innerElementType || innerTagName || 'div', {
        children: items,
        ref: innerRef,
        /*
          内部可滚动区域的样式，假设是垂直滚动
          则 estimatedTotalSize = 每个列表项的高度 * 列表项的数目
        */
        style: {
          height: isHorizontal ? '100%' : estimatedTotalSize,
          pointerEvents: isScrolling ? 'none' : undefined,
          width: isHorizontal ? estimatedTotalSize : '100%',
        },
      })
    );
  }
}
```

## Emoji 表情的展示
😊😢😊😢😊😢😊😢😊😢  
在 DPR 为 1 的屏幕上，这些 Emoji 表情左右可能会发生重叠。因为默认 Emoji 的表情是通过系统自带的字体进行展示的，当然字体的渲染和图片不同，而且如果部分系统没有字体库的话就无法正常渲染 Emoji。  

所以出于兼容性考虑，我们会发现像 Twitter 等网站还是把 Emoji 对应的编码转为图片再进行的展示。经过一番调研后我最后选择了 [Emoji Mart](https://github.com/missive/emoji-mart) 这个开源库。  

除了 Emoji 选择面版外这个库还提供了工具方法可以帮我们通过编码获取对应的图片展示：
```js
import { getEmojiDataFromNative, Emoji } from 'emoji-mart'
import data from 'emoji-mart/data/all.json'

const emojiData = getEmojiDataFromNative('🏊🏽‍♀️', 'apple', data)

<Emoji
  emoji={emojiData}
  set={'apple'}
  skin={emojiData.skin || 1}
  size={48}
/>
```
另外一个需要注意的是 Emoji 是通过俩位 Unicode 编码来存储的，所以在遍历时需要留意
```js
const str = "😊😢"
console.log(str.length) // 4
for (let ch of str) {
  console.log(ch) // 😊 😢
}

// 错误的方式！！！
for (let i = 0; i < str.length; i++) {
  console.log(str[i]) // � � � �
}
```

## 如何判断用户是否停留在当前页面
```js
document.visibilityState === 'visible'
```

## 收到新消息时给出通知提示
```js
const n = new Notification(
  '标题',
  {
    body: '内容',
  }
)

// 点击通知切回当前页签
n.onclick = () => {
  window.focus()
  n.close()
}

// 延时关闭通知
setTimeout(() => n.close(), 7000)
```

## 关于聊天区域自动滚屏的一些小细节
参考微信、钉钉等目前主流的聊天软件实现，需要留意以下几点：
* 当前窗口停留在最底部时（可以设置一定的偏移量）则认为用户正在浏览最新的消息，所以这个时候每当有新消息来则自动滚动到最底部，以便用户在聊天时不用滚动屏幕即可看到最新的消息。
* 当窗口滚动到离底部有一定的距离时则认为用户正在浏览历史聊天记录，这个时候来新消息如果还自动滚动到底部会干扰用户浏览历史聊天记录的行为。所以通常的做法时在一侧弹出新消息来了的提示，用户点击后即可滚动至最新消息处。Ps: 如果此时用户手动滚动至最底部，也要记得清除该提示