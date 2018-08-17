# 如何阻止模态框(Modal/Popup/Dialog)弹出后body可滚动

## 序

当模态框的遮罩层为透明时，鼠标或手指在模态框内容区进行操作  
此时如果被遮罩层挡住的Body内容仍会滚动会造成视觉上的干扰  
为了最佳的用户体验，我们需要想办法禁止这种默认的行为

## 设置Body的样式`overflow: hidden`
在模态框弹出时通过
```js
// 弹出
document.body.style.overflow = 'hidden'
// 关闭
documeng.body.style.overflow = 'initial'
```
修改`<body>`的样式使得滚动条消失，Bootstrap的Modal采取的就是这种方式  
缺点在于滚动条消失会导致页面向右偏移约20px，以填充滚动条消失的空白  
在PC端会有比较明显的感觉，对用户体验还是稍有影响  
另外移动端的大多浏览器对给`<body>`设置`overflow: hidden`并不感冒  
绝大多数情况下这种方式在移动端不起作用(亲测ios chrome下无效)

## 通过Javascript禁止滚动事件的默认行为
```js
function preventScroll(e) {
	e.preventDefault()
}

// 弹出
// { passive: false }是因为Chrome对相应事件做了优化 如果不设置会导致页面报错
// Unable to preventDefault inside passive event listener due to target being treated as passive. 
// See https://www.chromestatus.com/features/5093566007214080
document.body.addEventListener('mousewheel', preventScroll, { passive: false })
document.body.addEventListener('touchmove', preventScroll, { passive: false })

// 关闭
document.body.removeEventListener('mousewheel', preventScroll)
document.body.removeEventListener('touchmove', preventScroll)
```
如果模态框的内容区没有可滚动的元素，那么这个方案是可行的  
如果有的话会发现内容区内的元素的滚动也被一并禁止了，该方案仍需改进

## 终极方案
