# 记一次解决 MongoDB Too Many Open Files 报错的心路历程

## 起因
最近闲来无事打算学习一下 Node/MogoDB，新手上路难免出现一些奇特操作。我试着在循环中去新建大量 Collections 来初始化数据库，代码如下：
```js
async function init () {
  const client = await Mongo.connect(url)
  // All 是一个包含了 3000 个元素的数组
  for (const item of ALL) {
    const db = client.db('stock')
    const collection = await db.collection(item.symbol)
    await collection.insertOne({
      name: item.name
    })
  }
  await client.close()
}
```
很简单对吧？  

但是问题出现的这么突然，当创建到第 112 个 Collection 时程序就会运行出错，抛出错误 `Too Many Open Files`，然后数据库的进程就挂了。

## 探究原因
从错误的字面意思看，大概猜测是数据库占用的资源超出了一定限制。Google 一下，发现 Mac 对当前进程能打开的最大的文件句柄数量的默认设置是 256。  

通过 `$ ulimit -a` 指令可以查看当前 Shell 的限制。然后我试着通过 `$ ulimit -n 1024` 把这个限制修改为 1024（Ps：修改只会对当前 Shell 有效）。  

再次启动 Mongo 并执行程序，发现这次创建了 500 多个 Collection 才报错。看来这个错误确实和系统对最大可打开文件数的限制有关。  

但是，为什么 Mongo 会同时打开这么多文件呢？每次连接结束为什么不把占用的文件资源释放掉呢？会不会是程序没有正确的把资源释放？  

首先想到的可能是程序没有正确的关闭数据库连接，导致资源一直被占用。但是通过 Mongo `db.getServerStutus()` 观察，发现连接在程序结束时已经正确被关闭。  

但是当我重新执行程序时，发现创建第一个 Collection 时就会立马报错，哪怕重启 MogoDB 服务后重试仍是一样的结果。  

Emmmmmm... 重启都解决不了的问题确实很难办，只能推测这个错误和当前数据库所拥有的 Collection 数量有关。也就是说，不管是否有连接存在，Mongo 都会一直占用着与 Collection 相关的文件资源。  

然后就只能试着去找一下看 Mongo 的实现原理了：

>  WiredTiger的工作原理跟MMAPv1不太一样，一个集合一个文件，一个索引一个文件。所以你一共有多少集合，至少就会有集合数量x2个打开文件（以1集合文件+1索引文件计算）被占用。再考虑到网络连接数量，要保证足够大的open files值。

最新的 Mongo 默认使用 WiredTiger 作为存储引擎。也就是说，当你当数据库里有 1000 个 Collection。那么你至少需要支持同时打开 2000 个文件才能正确运行 Mongo 。  

这一点如果你在默认的 256 个最大文件数下启动 Mongo 就可以直接在命令行中看到如下提示
>  I CONTROL [initandlisten] ** WARNING: soft rlimits too low. Number of files is 256, should be at least 1000

解决办法就是尽可能的把最大文件数调大，例如 8192 。  

另外，从业务场景上来讲，一个数据库不应该有这么多 Collection，就像传统的
RDBMS 通常不会建几千张表一样。

## 总结
这个问题我来回折腾了一天才解决，对于我这么一个非计算机科班出身的小前端来说一开始确实有点摸不着头脑。  

但对于一个熟悉 Mongo 或者数据库的人来讲这个问题可能太基础了，所以在网上也很少有相关问题的记录。  

结论就是对计算机基础知识以及一些技术原理的理解，在解决疑难问题时真的很重要。