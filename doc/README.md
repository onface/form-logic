# 文档


## * Sync

`Sync` 可在 React 这类单向数据流的框架中达到双向绑定的效果，但实际上还是单向数据流。这是一个可以提高开发效率的**双向绑定语法糖**。

## text&password

````code
{
    title: 'input',
    desc: '`<input {...self.form.item("user")} /> <input {...self.form.password("user")} />`',
    html: '<div id="input-demo" ></div>',
    js: './Sync/Input.demo.js',
    source: './Sync/Input.js',
    open: true
}
````

## Select

````code
{
    title: 'select',
    desc: '`<select {...self.form.item("user")}>`',
    html: '<div id="select-demo" ></div>',
    js: './Sync/Select.demo.js',
    source: './Sync/Select.js',
    open: false
}
````

## Checkbox

````code
{
    title: 'checkbox',
    desc: '`<input {...self.form.checkbox("user", { value: "nimo" })} />`',
    html: '<div id="checkbox-demo" ></div>',
    js: './Sync/Checkbox.demo.js',
    source: './Sync/Checkbox.js',
    open: false
}
````

## Radio

````code
{
    title: 'radio',
    desc: '`<input {...self.form.radio("user", { value: "nimo" })} />`',
    html: '<div id="radio-demo" ></div>',
    js: './Sync/Radio.demo.js',
    source: './Sync/Radio.js',
    open: false
}
````

## Textarea

````code
{
    title: 'textarea',
    desc: '`<input {...self.form.radio("user", { value: "nimo" })} />`',
    html: '<div id="textarea-demo" ></div>',
    js: './Sync/Textarea.demo.js',
    source: './Sync/Textarea.js',
    open: false
}
````

## Custom input/output

````code
{
    title: 'Count',
    desc: 'transform: input`props` output`change`',
    html: '<div id="count-demo" ></div>',
    js: './Sync/Count.demo.js',
    source: './Sync/Count.js',
    open: true
}
````

### multiple parameter


````code
{
    title: 'props sync',
    desc: '',
    html: '<div id="propsmulti-demo" ></div>',
    js: './Sync/Props.demo.js',
    source: './Sync/Props.js',
    open: true
}
````

## * get/set


````code
{
    title: 'get set',
    desc: '',
    html: '<div id="getset-demo" ></div>',
    js: './Sync/GetSet.demo.js',
    source: './Sync/GetSet.js',
    open: true
}
````
