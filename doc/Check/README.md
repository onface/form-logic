# check

`check` 支持同步或异步自定义校验方式, 提供不同的校验的生命周期

## basic

````code
{
    title: 'check',
    desc: '`<input {...self.form.item("user", {check: {...}})} />`',
    html: '<div id="check-basic-demo" ></div>',
    js: './Basic.demo.js',
    source: './Basic.js',
    open: true
}
````


## Promise

使用 `promise` 校验异步的验证

````code
{
    title: 'check',
    desc: '`<input {...self.form.item("user", {check: {...}})} />`',
    html: '<div id="check-promiseFn-demo" ></div>',
    js: './PromiseFn.demo.js',
    source: './PromiseFn.js',
    open: true
}
````

## check trigger time

配置不同的时机触发不一样的校验函数, 也可以用`|`使之共用

````code
{
    title: 'check trigger time',
    desc: '`check: fn()` `check: {default:...,change:...,blur:...,focus|blur:...}` ',
    html: '<div id="check-time-demo" ></div>',
    js: './Time.demo.js',
    source: './Time.js',
    open: true
}
````
```
<input {...self.form.item(key, {
    check: () => { ... }
}/>
// 等同于
<input {...self.form.item(key, {
    check:{
        'default|blur': () => { ... }
    }
}/>
```

## check checkAll

手动调用校验函数

````code
{
    title: 'check, checkAll',
    desc: '`check(key, fn)` `check(keyArray, fn)` `checkAll(fn)`',
    html: '<div id="check-fn-demo" ></div>',
    js: './CheckFn.demo.js',
    source: './CheckFn.js',
    open: true
}
````

## options

- queue       
> 校验顺序方式 : true 队列式一次校验, false 并发式一起校验      
- every     
> 校验结束时机 : false 一个错就结束,执行回调, true 全部校验完成结束,执行回调

声明`new FormLogic()`时, 可以配置默认`{function|object} options`, 
在调用`check`或`checkAll`时, 无`{object} options`参数, 即调用声明时配置参数

````code
{
    title: '调用方式',
    desc: '`check(key, [options,] fn)` <br/> `check(keyArray, [options,] fn)` <br/> `checkAll([options,] fn)`',
    html: '<div id="check-options-demo" ></div>',
    js: './Options.demo.js',
    source: './Options.js',
    open: true
}
````

## disabled

````code
{
    title: 'disabled',
    desc: '`<input {...self.form.item("user", {disabled: <Boolean> })} />`',
    html: '<div id="check-disabled-demo" ></div>',
    js: './Disabled.demo.js',
    source: './Disabled.js',
    open: true
}
````

## clear

````code
{
    title: 'clear',
    desc: '`clear()` `clear(key)` `clear(keyArray)`',
    html: '<div id="check-clear-demo" ></div>',
    js: './Clear.demo.js',
    source: './Clear.js',
    open: true
}
````