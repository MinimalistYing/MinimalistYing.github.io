# Class In ES6

## 序
相较于之前通过 `prototype` 来模拟面向对象编程中类的行为  
ES6 对 `Class` 提供了原生的支持（不完全是语法糖，Class 额外新增了一些特性）

## 使用 `prototype` 以及 `Class` 实现同一个类的对比
基于类的实现
```js
class People {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  
  hello() {
    console.log(`${this.name} say hello to you`)
  }
  
  get name() {
    return `name ${this._name}`
  }
  
  set name(str) {
    if (str.length > 10) {
      console.log('name is too long')
      return
    } else {
      this._name = str
    }
  }
  
  static isOlder(a, b) {
    return a.age > b.age
  }
}
```
基于原型的实现
```js
function People(name, age) {
  this.name = name
  this.age = age
}

People.prototype.hello = function() {
  console.log(`${this.name} say hello to you`)
}

People.isOlder = function (a, b) {
  return a.age > b.age
}
```
使用 `Class` 的优点如下
* 当直接以函数形式调用时会报错 `Class constructor xxx cannot be invoked without 'new'`
* 更加类似面向对象编程的语法
* 支持 `getter` 以及 `setter`
* 支持静态方法

