export default [{
	date: "2017/8/2",
	content: "判断一个值是否为 `NaN` 一定要通过 `isNaN()` 而不是通过等号比较，因为 `NaN !== NaN`"
},{
	date: "2017/8/2",
	content: "在Javascript中进行浮点数运算是不可靠的，遵循IEEE 754标准，二进制的浮点数运算不能正确的处理十进制小数，例如典型的 `0.1 + 0.2 !== 0.3` 在一定的精度范围内可通过将小数转化为整数再进行比较来解决这个问题"
},{
	date: "2017/8/3",
	content: "通过Javascript `element.scrollTop = value` 或者jQuery `$(dom).scrollTop(value)` 去设置滚动条滚动位置时，注意所选取的元素就是设置了 `overflow-y : scroll` 的元素"
},{
	date: "2017/8/3",
	content: "在使用Javascript的 `parseInt()` 时，最好显示的指明进制，因为 `parseInt('0x16') = 22` 而你可能期望的结果是 `parseInt('0x16') = 0` 所以显示的指定进制才能做到真正的结果可控 ```parseInt('0x16', 16) = 22  parseInt('0x16', 10) = 0```  "
}]