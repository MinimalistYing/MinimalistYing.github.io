# Axios 源码解析
Axios 是一个发送 Ajax 请求的类库  
类似于 jQuery 的 `$.ajax()` 以及 Angular 的 `$http`   
本文仅会针对其提供的特性对部分核心代码进行分析

## Feature
首先罗列一下 Axios 在对 `xhr` 进行封装的基础上提供的一些高级特性
* `Promise` API
* 支持通过 `Interceptor` 在请求前后进行一些公共业务操作（例如对错误的处理）
* 支持通过 `transformData` 对请求参数以及响应结果做统一处理
* 支持通过 `axios.defaults` 进行全局的默认配置
* 支持通过 `axios.get() | axios.put()` 以及类似 Fetch API 的 `axios(url, config)` 进行调用
* 支持统一设置请求的 `BaseURL`
* 支持从服务端（node.js）或者客户端（Browser）发起请求

## Axios 如何支持多种调用形式
```js
// lib/axios.js
// ...
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  // 使函数 `Axios.prototype.request` 内部的 this 指向上面通过构造函数实例化的 context 对象
  // 注意这里的 instance 其实仍是一个函数
  // 之所以这样做是为了可以像 axios(url, config) 这样直接调用
  var instance = bind(Axios.prototype.request, context);

  // 将 Axios.prototype 上定义的函数的 this 指向 context 并复制到 instance 上
  // 这样就可以像 axios.get() axios.post() 一样来调用
  utils.extend(instance, Axios.prototype, context);

  // 将 context 的属性复制到 instance 函数上
  utils.extend(instance, context);

  return instance;
}

// 默认情况下 我们通过 import axios from 'axios' 引入的就是该对象
// 更准确的说就是 createInstance 函数返回的 instance 函数
// 也就是重新 bind 过 this 后的 Axios.prototype.request
var axios = createInstance(defaults);

// ...
```
在 axios 中，不管我们采取何种形式调用，最终发起请求的都是 `Axios.prototype.request` 
```js
// lib/core/Axios.js
// ...
Axios.prototype.request = function request(config) {
  // 支持像 Fetch API 一样调用 axios(url, config)
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }
  // ...
};

// 支持通过 axios.get() axios.post() 等方式快捷调用
// delete get head options 默认不会在请求体中携带数据
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});
// post put patch 可以在请求体中携带数据
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});
```

## Axios 如何支持统一设置请求的 BaseURL
```js
// lib/core/dispatchRequest.js
// ...
module.exports = function dispatchRequest(config) {
  // ...

  // 如果设置有 baseURL 并且传入的请求地址是相对路径  
  // 则用 baseURL 与传入的地址拼接后作为最终的请求路径
  // 通过 /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url) 来判断是否为绝对路径
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    // axios 会移除 BaseURL 末尾的 / 以及相对路径开头的 / 来进行拼接
    // 所以 axios('/xxx') 和 axios('xxx') 其实是一样的
    config.url = combineURLs(config.baseURL, config.url);
  }

  // ...
};
```

## Axios 如何支持 Promise
```js
// lib/adapters/xhr.js
// ...
module.exports = function xhrAdapter(config) {
  // 比较简单 就是用 Promise 对 xhr 原生 API 做了一层封装
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var request = new XMLHttpRequest();

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    request.onreadystatechange = function handleLoad() {
      // ...
      // 请求完成后 resolve 或者 reject Promise
      settle(resolve, reject, response);
      // ...
    };

    // 发送请求
    request.send(requestData);
  });
};
```

## Axios 如何支持 Interceptor
```js
// lib/core/Axios.js
// ...
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  // 每个 Axios 的实例都包含了俩类拦截器 
  // this.interceptors.request 以及 this.interceptors.response
  // InterceptorManager 用于管理所有的拦截器 也就是维护一个数组
  // 数组中的元素是一个类似 { fulfill: ()=>{}, reject: () => {}} 的对象
  // 包含 Promise 处理成功函数以及失败函数
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

Axios.prototype.request = function request(config) {
  // ...
  // 最终请求是在 dispatchRequest 中 通过 Adapter 发送的
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  // 将拦截函数放入调用链
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  // 此时的 chain 是一个包含了 Promise resolve reject 函数的数组
  // 形如 [reqFulfill, reqReject, dispatchRequest, undefined. resFulfill, resReject]
  // 以下代码其实就是为了形成一个链式的流程 类似
  // Promise(config).then(reqFulfill, reqReject)
  // .then(dispatch, undefined)
  // .then(resFulfill, resReject)
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```

## Axios 如何支持 transformData
```js
// lib/core/dispatchRequest.js
// ...
module.exports = function dispatchRequest(config) {
  // ...
  // 请求发出前 transform request data
  config.data = transformData(...);

  // ...
  // 请求完成后 transform response data
  return adapter(config).then(function onAdapterResolution(response) {
    // 请求成功 也就是 validateStatus 返回 true 默认响应码 200 - 300 为 true
    response.data = transformData(...);

    return response;
  }, function onAdapterRejection(reason) {
    // 请求失败
    if (reason && reason.response) {
      reason.response.data = transformData(...);
    }

    return Promise.reject(reason);
  });
};
```

## Axios 的默认设置
```js
// lib/defaults.js
// ...
var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

var defaults = {
  // 默认会根据请求参数的类型来适配请头中的 Content-Type
  // 并且转化发起请求的数据格式
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) { // 对象转为 json 字符串
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],
  // 默认如果请求返回的数据是字符串则转为 json
  transformResponse: [function transformResponse(data) {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],
  // 默认响应码在 200 - 300 间才认为请求成功
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};
// 默认接收 json 数据
defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

// post put patch 请求默认的 Content-Type 为 application/x-www-form-urlencoded
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
```

## Axios 发起一个请求的流程
1. `axios(config) | axios(url, config) | axios.get(url, config)` 启动一个请求
2. 内部最终通过 `Axios.prototype.request(config)` 函数来发送请求
3. 经过 Request Inteceptors 处理配置 / 请求头等
4. 在 `dispatchRequest(config)` 中通过 `config.data = transformRequest(...)` 处理请求参数
5. 在 `xhrAdapter` 中实例化 `XMLHttpRequest` 对象，发送 Ajax 请求
6. 收到响应后 不管请求成功还是失败，通过 `response.data = transformResponse(...)` 处理请求返回数据
7. 经过 Response Inteceptors 处理错误 / 响应头等
8. 请求完成 `axios(config).then(res => {}).catch(err => {})` 在 `then` 或 `catch` 块中处理业务逻辑