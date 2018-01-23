import spare from "sparejs"
import extend from "extend"
import delayEach from "delayeach"
class FormLogic {
    constructor(settings) {
        const self = this
        self.settings = settings
        self.data = {
            errorMap: {},
            successMap: {},
            itemMap: {}
        }
    }
    password = (key, settings) => {
        settings = spare(settings, {})
        settings.type = 'password'
        return this.item(key, settings)
    }
    checkbox = (key, settings) => {
        settings = spare(settings, {})
        settings.type = 'checkbox'
        return this.item(key, settings)
    }
    radio = (key, settings) => {
        settings = spare(settings, {})
        settings.type = 'radio'
        return this.item(key, settings)
    }
    select = (key, settings) => {
        settings = spare(settings, {})
        settings.type = 'select'
        return this.item(key, settings)
    }
    textarea = (key, settings) => {
        settings = spare(settings, {})
        settings.type = 'textarea'
        return this.item(key, settings)
    }
    get = (key) => {
        const self = this
        const formValue = self.settings.getValue()
        if (typeof formValue === 'undefined') {
            throw new Error('node_modules/form-logic: new Form({getValue:fn}) getValue must return a object')
        }
        return typeof formValue[key] === 'undefined'? '': formValue[key]
    }
    getValue = () => {
        const self = this
        return self.settings.getValue()
    }
    set = (key, value) => {
        const self = this
        switch(typeof key) {
            case 'string':
                self.settings.onSync.bind(undefined)(key, value)
            break
            case 'object':
                let valueMap = key
                Object.keys(valueMap).forEach(function (name) {
                    self.settings.onSync.bind(undefined)(name, valueMap[name])
                })
            break
            default:
                throw new Error('node_modules/form.react/lib/index.js `self.form.set(key, value)` key must be a string or object')
        }

    }
    updateDOM = () => {
        this.settings.app.forceUpdate()
    }
    emitPass = (key) => {
        const self = this
        delete self.data.errorMap[key]
        self.data.successMap[key] = true
        self.updateDOM()
    }
    emitFail = (key, data) => {
        const self = this
        self.data.errorMap[key] = data
        self.data.successMap[key] = false
        self.updateDOM()
    }
    checkFunc = (key, value, fn, callback) => {
        const self = this
        let check = extend(true, {value})
        let finishCallback = function () {
            if (typeof callback === 'function') {
                callback()
            }
            finishCallback = function(){}
        }
        check.pass = function (){
            self.emitPass(key)
            finishCallback()
            check.fail = function () {}
        }
        check.fail = function (data) {
            self.emitFail(key, {data})
            finishCallback()
            check.pass = function () {}
        }
        fn(check)
    }
    success = (key, render) => {
        const self = this
        if (typeof render === 'function') {
            return render(self.data.errorMap[key].data)
        }
        return self.data.successMap[key]
    }
    error = (key, render) => {
        const self = this
        if (typeof self.data.errorMap[key] !== 'undefined') {
            if (typeof render === 'function') {
                return render(self.data.errorMap[key].data)
            }
            return self.data.errorMap[key].data
        }
        else {
            return false
        }
    }
    check = (key, callback) => {
        const self = this
        if (typeof self.data.itemMap[key].check.default === 'undefined') {
            throw new Error('form-logic: item({check}) check.default is undefined')
        }
        self.checkFunc(
            key,
            self.get(key),
            self.data.itemMap[key].check.default,
            function () {
                if (typeof callback === 'function') {
                    callback(
                        self.error(key)
                    )
                }
            }
        )
    }
    checkAll = (checkAllCallback) => {
        const self = this
        let checkItems = Object.keys(self.data.itemMap).filter(function (item) {
            return !item.disabled
        })
        let errors = []
        delayEach(checkItems, function (key, index, next, finish) {
            self.check(key, function (fail) {
                if (fail) {
                    errors.push({
                        item: self.data.itemMap[key],
                        key: key,
                        data: fail
                    })
                }
                next()
            })
        }, function () {
            let fail = errors.length !== 0
            checkAllCallback(fail, errors)
        })
    }
    item = (key, settings) => {
        settings = spare(settings, {

        })
        settings.check = spare(settings.check, {})
        const self = this
        const formValue = self.settings.getValue()
        let outputValue = {}
        let value
        settings.change = spare(settings.change, 'onChange')
        let currentValue = self.get(key)
        let outputChecked
        let multiValueIndex

        switch(settings.type) {
            case 'checkbox':
                multiValueIndex = currentValue.indexOf(settings.value)
                if (multiValueIndex !== -1) {
                    outputChecked = true
                }
                else {
                    outputChecked = false
                }
                value = settings.value
            break
            case 'radio':
                outputChecked = Boolean(settings.value === currentValue)
                value = settings.value
            break
            case 'select':
                value = currentValue
            break
            case 'textarea':
                value = currentValue
            break
            default:
                value = currentValue
        }
        switch(typeof settings.props) {
            case 'string':
                outputValue[settings.props] = value
            break
            case 'function':
                outputValue = settings.props(value)
            break
            default:
                outputValue.value = value
        }
        let output = {
            checked: outputChecked,
            type: settings.type,
            [settings.change]: function (value) {
                let onChangeArg = arguments
                let syncValue = value
                if (typeof value.target !== 'undefined' && typeof value.target.getAttribute === 'function') {
                    switch (value.target.getAttribute('type')) {
                        case 'checkbox':
                            if (value.target.checked) {
                                syncValue = currentValue.concat([value.target.value])
                            }
                            else {
                                syncValue = currentValue.filter( (item) => {
                                    return item !== value.target.value
                                })
                            }
                        break
                        default:
                            syncValue = value.target.value
                    }
                }
                if (typeof settings.sync === 'function') {
                    syncValue = settings.sync.apply(undefined, onChangeArg)
                }
                // 在 onSync 之前触发的原因是，如果想要在 onSync 触发 在代码内使用 setTimeout(fn, 0) 即可
                if (typeof settings[settings.change] === 'function') {
                    // settings['onChange']
                    settings[settings.change].apply(undefined, onChangeArg)
                }
                self.settings.onSync.bind(undefined)(key, syncValue)
                if (typeof settings.check.change === 'function') {
                    self.checkFunc(key, syncValue, settings.check.change)
                }
            },
            onBlur: function () {
                if (typeof settings['onBlur'] === 'function') {
                    settings['onBlur'].apply(undefined, arguments)
                }
                if (typeof settings.check.blur === 'function') {
                    self.checkFunc(key, currentValue, settings.check.blur)
                }
            },
            onFocus: function () {
                if (typeof settings['onFocus'] === 'function') {
                    settings['onFocus'].apply(undefined, arguments)
                }
                if (typeof settings.check.focus === 'function') {
                    self.checkFunc(key, currentValue, settings.check.focus)
                }
            },
            ref: `$${key}`
        }
        // inherit settings
        output = extend(
            true,
            extend(true, {}, settings),
            output
        )
        extend(true, output , outputValue)
        self.data.itemMap[key] = output
        return output
    }
}
export default FormLogic
