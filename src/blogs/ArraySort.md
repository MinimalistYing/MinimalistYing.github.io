# Array.prototype.sort() 在使用默认CompareFn时的问题

## 起因
在LeetCode上碰到一道算法题，需要先将数组中的数字从小到大进行排序  
自信的直接通过`Array.prototype.sort()`进行排序，结果却让人费解  
```js
let arr = [1, -2, 2, 34, 3]
arr.sort() // => [-2, 1, 2, 3, 34]
// 暂时来看默认的排序算法是正确的 下面我们换一下数组内部的值
arr = [1, -1, 23, 2, 3]
arr.sort() // => [-1, 1, 2, 23, 3]
// 可以看到结果并未正确的按从小到大的顺序排列
```

## Why
查阅ECMA规范中的[sortcompare](http://www.ecma-international.org/ecma-262/6.0/#sec-sortcompare)  
默认的比较函数会将数组中的值(除了`undefined`,因为它不能被转为字符串)先转为字符串后再进行排序  
并且`undefined`会被视为最大的值，所以
```js
let arr = [1, undefined, 23, 2, 3]
// 因为 '3' > '23' > '2' > '1' 
arr.sort() // => [1, 2, 23, 3, undefined]
```

## 延伸
再查找相关资料的时候翻到了[这篇文章](https://segmentfault.com/a/1190000010630780)  
里面又抛出了一个新问题
```js
const data = [
	{value: 3}, 
	{value: 2}, 
	{value: undefined}, 
	{value: 1}, 
	{value: undefined}, 
	{value: 4}
]
// => [1, 2, 3, 4, undefined, undefined]
data.map(x => x.value).sort((x, y) => x - y)
// => [2, 3, undefined, 1, undefined, 4]
data.sort((x, y) => x.value - y.value).map(x => x.value)
```
可以看到先排序再扁平化和先扁平化再排序产出的结果是不一致的，虽然比较大小的逻辑相同  
产生这个问题的原因就是因为值中出现了`undefined`而它和任何其它数字进行加减乘除操作得到的结果是`NaN`  
而ECMA规范中规定的CompareFn必须返回的是一个数字(最好是1,-1,0)  
对于给定的`compare(a,b)`希望a排前返回负数，希望b排前返回正数，希望顺序不变返回0  

## 总结
为了避免诸多问题，建议在使用`Array.prototype.sort()`时始终传入CompareFn  
并考虑清楚对比值中可能出现的特殊情况(例如`undefined`/`null`等)
