# 深入学习 Winter 老师的重学前端教程后产出的高阶学习笔记

## em & strong
定义：
> The em element represents stress emphasis of its contents.The strong element represents strong importance, seriousness, or urgency for its contents.

从表现形式来看 `<em>` 默认是斜体，`<strong>` 默认是粗体。  

从语义上来看 `<em>` 表示根据上下文的强调语气，放在不同处可能会影响句子的原意。而 `<strong>` 仅仅用于表示强调，与上下文无关。


## 一些语义化标签
* `<abbr>` - 缩写
* `<blockquote>` - 引用
* `<cite>` - 引用的作品名称
* `<pre>` - 预先排版过的内容
* `<code>` - 代码
* `<nav>` - 导航
  
## JavaScript 中字符串有最大长度吗
MDN:
> ECMAScript 2016 (ed. 7) established a maximum length of 2^53 - 1 elements. Previously, no maximum length was specified. In Firefox, strings have a maximum length of 2\*\*30 - 2 (~1GB). In versions prior to Firefox 65, the maximum length was 2\*\*28 - 1 (~256MB).

所以答案是有的，并且最新的协议也规定了最大长度为 `2^53 - 1`。

## Infinity & -Infinity
这俩个值的出现应该是为了避免任意数字除以 0 报错，例如：
```js
1 / 0 // Infinity
-1 / 0 // -Infinity

666 / 0 // Infinity
666 / -0 // -Infinity
```
所以如果需要判断一个数字是否为无穷大最好通过 `Number.isFinite()` ，可以兼容俩种情况。

## 浮点数精度问题
在 Javascript 中进行浮点数运算是不可靠的，遵循IEEE 754标准，二进制的浮点数运算不能正确的处理十进制小数。  

很经典的一个问题如何判断 `0.1 + 0.2 === 0.3` ？正解：
```js
Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON
```

还可以通过以下方法来正确计算俩位浮点数的加法：  
```js
function floatAdd(a, b) {
    return Number((a + b).toFixed(2))
}
```
实际上这么处理仍会有问题，例如无法计算 `0.12 + 0.12345`  

但是考虑到对浮点数计算以及精度要求最高的场景应该就是算钱，所以支持俩位浮点数计算也许足够了？

## for...of
ES6 的 `for...of` 可以用来遍历所有 `Iterable` 的对象，简单来说就是所有实现了 `Symbol.iterator` 接口的对象。  

`String` `Array` `Map` `Set` `TypedArray` `NodeList` `arguments` 等内建的对象都是 `Iterable` 的。  

需要注意的是 `Object` 默认不是 `Iterable` 的，所以如果我们希望一个自定义对象可以通过 `for...of` 遍历需要自己去实现 `Symbol.iterator` 接口，例如借助 Iterator 实现斐波那契数列：
```js
const febonacci = {
    [Symbol.iterator]() {
        let a = 1
        let b = 1
        return {
            next() {
                const value = b
                let done = b >= 1000 // 超过1000结束迭代
                b = a
                a = value + a       

                return {
                    value,
                    done
                }
            },
            return() {
                console.log('Stop iterate')
                return { done: true }
            }
        }
    }
}

for (let i of febonacci) {
    console.log(i)
    if (i > 500) {
        break;
    }
}
```

## 装箱与拆箱
事实上 JavaScript 的装箱和拆箱并不像 Java 等语言里那样常见，甚至说其实在 JavaScript 并不存在，因为在协议中并没有相关的定义，在 MDN 中也搜索不到关于 `boxing` 或者 `unboxing` 等定义的相关词条。  

在协议中把相关的行为解释为 `conversion` 或者 `coercion`，可以参考 [这篇回答](https://stackoverflow.com/questions/34067261/is-boxing-coercion-in-javascript?noredirect=1&lq=1)。  

当出现下列俩种情况时，原始类型会被转化为对象（通俗来讲被称为装箱）：
* 把原始类型当作 `this` 使用，例如 `Object.prototype.toString.call(true)`
* 在原始类型上通过 `.` 或者 `[]` 去访问其属性，例如 `'abc'.toUpperCase()` 或 `'das'['toUpperCase']()`

当需要从 Object 转为 String 或 Number 就被称为拆箱，拆箱转换会尝试调用 `valueOf` 和 `toString` 来获得拆箱后的基本类型。如果 `valueOf` 和 `toString` 都不存在，或者没有返回基本类型，则会产生类型错误 TypeError：
```js
var o = {
  valueOf : () => {
    console.log('valueOf')
    return {}
  },
  toString : () => {
    console.log('toString')
    return {}
  }
}

o * 1 // valueOf toString TypeError
/* 如果是转为 String 的话会优先调用 toString */
String(o) // toString valueOf TypeError
```
ES6 支持通过实现 `Symbol.toPrimitive` 接口来覆盖默认的拆箱行为：
```js
// 实现了这个接口后在碰到拆箱场景就不会再调用 valueOf 以及 toString 了
const o = {
  [Symbol.toPrimitive](hint) {
    // hint 有 number / string / default 三种可能值
    if (hint === 'number') {
      return 666
    } else if (hint === 'string') {
      return 'hello'
    } else {
      return null
    }
  }
}

o * 1 // 666

String(o) // hello

o + '' // null
```

## JavaScript 中的类与继承
众所周知 JavaScript 是基于原型的。  

和 Java 等常见的面向对象语言不同，在 JavaScript 中没有类的概念，或者说类的概念很弱。ES6 新增的 `class` 和 `extends` 其实只是基于原型的语法糖，可以看 MDN 中的定义：
> JavaScript classes, introduced in ECMAScript 2015, are primarily syntactical sugar over JavaScript's existing prototype-based inheritance. The class syntax does not introduce a new object-oriented inheritance model to JavaScript.

就像 Winter 所推荐的，现在不论在任何场景下都建议使用 `class` 来定义类，但我们还是需要了解一下在 ES6 出现之前，前端工程师们是怎么实现类和继承的。  

首先我们需要了解一下 JavaScript 的原型链是如何工作的。  

之前在学习相关知识的经常会被搞晕，因为相关属性有的是标准有的是内部实现有的只是部分浏览器的单独实现，并且从最早期的 JavaScript 到现在很多之前的内容应该是已经过时了。  

所以我先来理清楚原型链工作中起到重要作用的几个属性。

首先是 `__proto__` 以及 `[[Prototype]]`，它们其实是同一个东西，都指的是当前对象的原型联指向的对象或者 `null` (原型链最顶端) 。并且现在推荐使用 `Object.getPrototypeOf` 以及 `Object.setPrototypeOf` 来替代 `__proto__`，因为这其实是一个不在规范中的定义只是现在的浏览器为了保证兼容性大都实现了它，最后来看看 MDN 的定义：
> The `__proto__` property of `Object.prototype` is an accessor property (a getter function and a setter function) that exposes the internal `[[Prototype]]` (either an object or null) of the object through which it is accessed.

再来看看 `prototype` ，这个属性很容易和前面的搞混，事实上只有构造函数上存在这个属性：
```js
const o = {}
const func = function() {}
const arrow = () => {}

o.prototype // undefined
func.prototype // {constructor: ƒ}
arrow.prototype // undefined
```
这个我觉得也可以算是 JavaScript 早期语言设计上的错误，函数是一等公民，但又不仅仅是普通函数同时也被用于模拟类但概念。所以可以看到 ES6 中的 `class` 以及 `arrow function` 把这俩个概念区分了开来，箭头函数是不能通过 `new` 调用的，也不存在用于继承的 `prototpye` 属性。所以有些人会认为在 ES6 中应该放弃使用 `function` ，如果我们想要实现一个类就应该使用 `class` ，如果我们仅仅想抽象一个普通函数则使用箭头函数。当然这个观点有些激进了，但是也存在一定道理。  

当你通过 `new` 来调用一个构造函数时，会生成一个新对象，并且该对象的 `[[Prototype]]` 会指向构造它的函数的 `prototype` 属性。理解了这一点我们就可以自己模拟实现一个基础的 `new` 函数：
```js
const fakeNew = (construct, ...params) => {
  const o = Object.create(construct.prototype)
  // 调用构造函数进行一些初始化赋值
  const re = construct.apply(o, params)
  // 当构造函数中会返回一个引用类型的值时 最终 new 操作符返回的是这个值 而不是新构造的对象
  return ((typeof re === 'object' && re !== null) || typeof re === 'function') ? re : o
}
```

最后再来看一下 `constructor` 属性，实际上这也只是 `Object.prototype` 上的一个普通属性，通常来说它的值就是生成该对象的构造函数，但是它并不是很可靠，因为它并不是完全只读的：
```js
let o = {}
o.constructor === Object // true
o.constructor = () => {}
o.constructor === Object // false
```

首先强调一点 JavaScript 不是基于类的，所以下面的这些都是开发者们为了模拟传统的面向对象语言中的类形式而做的尝试。  

下面我们来看看如何基于原型来模拟类：
```js
function Foo(name, age) {
  this.name = name
  this.age = age
}

Foo.prototype.say = function() {
  console.log(`my name is ${this.name}, my age is ${this.age}`)
}

const foo = new Foo('Bob', 18)
foo.say() // my name is Bob, my age is 18
```
上述代码中的 `Foo` 就可以看作一个类也可以说是类的构造函数。相信如果大家有过类似 Java 等面向对象语言等开发经验的话会觉得这种形式很奇怪。一是语法上和通常的 `Class` 区别很多，这一点倒是可以通过 ES6 的 `class` 来解决。二是在 Java 等语言中，类是一个静态等概念，也就是说如果我们定义好了一个类，那么就没有办法再去改变它的方法，而在 JavaScript 中这一切都是动态的，如果我们在后续的程序中修改了 `Foo.prototype.say` 我们会发现之前实例出来的对象也都会受到影响。  

我们再试着通过原型来模拟类的继承：
```js
function Bar(name, age, extra) {
  Foo.call(this, name, age)
  this.extra = extra
}

Object.setPrototypeOf(Bar.prototype, Foo.prototype)

Bar.prototype.say = function() {
  console.log(`my name is ${this.name}, my age is ${this.age}, and ${this.extra}`)
}

const bar = new Bar('Jack', 22, 'haha')
bar.say() // my name is Jack, my age is 22, and haha
```
虽然代码看起来很丑，但我们基本实现了类的方法覆盖，属性继承。如果使用 ES6 代码看起来会清晰很多：
```js
class Foo {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  say() {
    console.log(`my name is ${this.name}, my age is ${this.age}`)
  }
}

class Bar extends Foo {
  constructor(name, age, extra) {
    super(name, age)
    this.extra = extra
  }

  say() {
    console.log(`my name is ${this.name}, my age is ${this.age}, and ${this.extra}`)
  }
}

const foo = new Foo('Bob', 18)
foo.say() // my name is Bob, my age is 18

const bar = new Bar('Jack', 22, 'haha')
bar.say() // my name is Jack, my age is 22, and haha
```

TODO: 关于原型的相关知识需要单独一篇文章来整理。。。

目前看到的感觉解释原型链最清晰的一张图 [点这里](https://stackoverflow.com/questions/650764/how-does-proto-differ-from-constructor-prototype)

原型链的规则大概是一个对象在初始化时它的 `[[Prototype]]` 会指向它的构造函数的 `prototype` 属性。最顶层的是 `Object.prototype`,并且 `Object.prototype.__proto__` 为 `null`。可能会让人感到意外的的俩个是 `Function.__proto__` 是 `Function.prototype`，`Object.__proto__` 也是 `Function.prototype`，因为 `Function` 以及 `Object` 都是函数。  

When it comes to inheritance, JavaScript only has one construct: objects. Each object has a private property which holds a link to another object called its prototype. That prototype object has a prototype of its own, and so on until an object is reached with null as its prototype. By definition, null has no prototype, and acts as the final link in this prototype chain.  

`hasOwnProperty` is the only thing in JavaScript which deals with properties and does not traverse the prototype chain.

## JavaScript 中的对象分类
* 宿主对象（Host Objects）--- `window` / `dom`
* 固有对象（Intrinsic Objects）--- `JSON` / `Math`
* 原生对象（Native Objects）--- `new Boolean()` / `new Error()`
* 普通对象（Ordinary Objects）--- `{}`

## 函数对象和构造器对象
首先要明确的一点，在 JavaScript 中函数也是一种特殊的对象。  

函数对象的定义是：具有 `[[call]]` 私有字段的对象。  

构造器对象的定义是：具有私有字段 `[[construct]]` 的对象。  

用户通过 `function` 声明的函数同时可以作为普通函数调用或者通过 `new` 当作构造器调用，而箭头函数只能作为普通函数调用。  

另外一些原生的函数作为普通函数和构造器调用时会有不同的行为，例如 `Number()` 用作显示的类型转换而 `new Number()` 会返回一个新的 `Number` 对象。


## CSS Variables
在我们日常开发中经常会碰到的这里改一下颜色那里调一下阴影的需求，在产品或者设计师看来这是一件很简单的事。  

那么如果我们维护了一个庞大的样式库，页面上有几十个按钮和边框都使用了这种颜色，产品一句改一下颜色可能需要我们花上几小时去找到并一个个修改。  

当然谁都不想被这种 Dirty Work 浪费时间，所以如果我们使用了 `Less/Sass` 等 CSS 预处理器会发现它们都提供了变量的功能，如果维护得当的话再碰到这种需求只需要改一下变量的设置的颜色即可。  

好消息是现在 CSS 原生支持了 `CSS Variables`，借助这一特性我们可以更方便的实现一键切换网站主题色的功能。  

首先提一下伪类 `:root` 代表着文档的根元素，在 HTML 中通常就是 `<html>` ，但是它的优先级会比元素选择器 `html` 高，因为伪类选择器的优先级高于元素选择器。  

下面我们看一下一些基础的样例：
```css
:root {
  --main: red;
}

.button {
  background: var(--main);
}

h2 {
  color: var(--main);
}

/*
  支持默认值
  但是只接受俩个参数，例如 var(--main, --test, gray); 是不合法的
  如果想要实现多个默认值，可以 var(--main, var(--test, gray));
*/
p {
  color: var(--main, green);
}
```

利用 CSS Variables 实现主题色：
```html
<html>
<head>
  <script type='text/javascript'>
    window.onload = () => {
      const white = document.getElementById('white')
      const black = document.getElementById('black')
      const blue = document.getElementById('blue')

      function changeTheme(bg, fontcolor) {
        document.documentElement.style.setProperty('--bg', bg)
        document.documentElement.style.setProperty('--fontcolor', fontcolor)
      }

      white.addEventListener('click', () => {
        changeTheme('#fff', '#333')
      })

      blue.addEventListener('click', () => {
        changeTheme('#207DE8', '#fff')
      })

      black.addEventListener('click', () => {
        changeTheme('#000', '#fff')
      })
    }
  </script>
  <style>
    :root {
      --bg: #fff;
      --fontcolor: #333;
    }

    main {
      background: var(--bg);
    }

    h1,p {
      color: var(--fontcolor);
    }
  </style>
</head>
<body>
  <main>
    <div>
      <button id='white'>白</button>
      <button id='black'>黑</button>
      <button id='blue'>蓝</button>
    </div>
    <h1>标题</h1>
    <p>正文一</p>
    <p>正文二</p>
  </main>
</body>
</html>
```
