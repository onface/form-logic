import spare from "sparejs"
import extend from "extend"
import safeExt from "safe-extend";
import jsonModif from "json-modif";
import delayEach from "delayeach"
import getSyncValue from './getSyncValue'
import { correctValue, correctCheck} from './correct'
var dc = require('delay-console');
;(typeof global?global.dcDebug = true:window.dcDebug = true)
// import defaultRule from './defaultRule'

class FormLogic {
    constructor(settings) {
        const self = this
        self.settings = settings
        /* settings
            {must} app : self
            {fn must} getValue : () => { return self.state.form },
            {fn must} onSync
            {fn} checkAllKey 默认检测全部 可以不配置
            {obj} rule 默认规则 可不配置
            {string} type 默认text
            {obj} getOptions : () => { return {queue:true,every:true} }
        */
        self.data = {
            errorMap: {},
            successMap: {},
            itemMap: {}
        }
        // default options
        self.options = {
            queue:true,
            every:true
        }
    }
    // get latest options
    getOptions = (options) => {
        const self = this
        let result = safeExt.clone(self.options)
        switch(typeof self.settings.options){
            case 'object':
                result = safeExt(true, result, self.settings.options)
            break
            case 'function':
                result = safeExt(true, result, self.settings.options())
            break
            default:
        }
        switch(typeof options){
            case 'object':
                result = safeExt(true, result, options)
            break
            // case 'function':
            //     result = safeExt(true, result, options())
            // break
            default:
        }
        // console.log('getOptions (typeof:',typeof self.settings.options,') (options:',options,') (result:',result,')')
        return result
    }
    /**
     * get assigned value
     *
     * @param {String} key
     *
     */
    get = (key) => {
        const self = this
        const formValue = self.settings.getValue()
        if (typeof formValue === 'undefined') {
            throw new Error('node_modules/form-logic: new Form({getValue:fn}) getValue must return a object')
        }
        let query = jsonModif.query(key, formValue)
        // console.log('get (key:',key,') (formValue:',formValue,') (query: ',query,')')
        return typeof query === 'undefined'? '': query
    }
    // get all value
    getValue = () => {
        const self = this
        return self.settings.getValue()
    }
    /**
     * set assigned value
     *
     * @param {String} key
     * @param {String|Object} value
     *
     */
    set = (key, value) => {
        const self = this
        // console.log('set (key:',key,') (value:',value,')')
        let data = safeExt.clone(self.getValue()) 
        switch(typeof key) {
            case 'string':
                let result = jsonModif.set(key, value, data)
                // console.log('set string (key:',key,') (value:',value,') (data:',data,') (result: ',result,')')
                self.settings.onSync.bind(undefined)(result)
            break
            case 'object':
                let valueMap = key
                Object.keys(valueMap).forEach(function (name) {
                    let result = jsonModif.set(name, valueMap[name], data)
                    data = safeExt.clone(result)
                    // console.log('set obj (name:',name,') (valueMap[name]:',valueMap[name],') (data:',data,') (result: ',result,')')
                    self.settings.onSync.bind(undefined)(result)
                })
            break
            default:
                throw new Error('node_modules/form.react/lib/index.js `self.form.set(key, value)` key must be a string or object')
        }
    }
    /**
     * cite various type
     * @example
     *     password, checkbox, radio, select, textarea
     *     // TODO add: image file number
     */
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

    item = (key, settings) => {
        const self = this
        /**/
        dc.group('js item')
        dc.$input('@param',key)
        /**/

        // default input <settings>
            let s = spare(settings, {})
                // s.check = spare(s.check, {})
                s.change = spare(s.change, 'onChange')

        let stateValue = self.get(key)
        let correct = correctValue.call(self, key, s)
        let check = correctCheck.call(self, s)

        // output
            let output = {
                ref: `$${key}`,
                checked: correct.checked,
                type: s.type,
                [s.change]: function(value) {
                    // sync value (onChang)
                        let onChangeArg = arguments
                        let syncValue = getSyncValue.call(self, key, value)
                        if (typeof s.sync === 'function') {
                            syncValue = s.sync.apply(undefined, onChangeArg)
                        }
                        // 在 onSync 之前触发的原因是，如果想要在 onSync 触发 在代码内使用 setTimeout(fn, 0) 即可
                        if (typeof s[s.change] === 'function') {
                            // s['onChange']
                            s[s.change].apply(undefined, onChangeArg)
                        }
                        // console.log(value.target.value,typeof value.target.value)
                        // console.log('change onSync (key:',key,') (syncValue:',syncValue,')')
                        // self.settings.onSync.bind(undefined)(key, syncValue)
                        self.set(key, syncValue)

                    // check
                    if (typeof check.change === 'function') {
                        // console.log('js item onChange check',key)
                        self.checkFunc(key, syncValue, check.change)
                    }
                },
                ['onBlur']: function(){
                    // bind
                    if (typeof s['onBlur'] === 'function') {
                        s['onBlur'].apply(undefined, arguments)
                    }
                    // check
                    if (typeof check.blur === 'function') {
                        // console.log('js item onBlur check',key)
                        self.checkFunc(key, correct.value.value, check.blur)
                    }
                },
                ['onFocus']: function(){
                    if (typeof s['onFocus'] === 'function') {
                        s['onFocus'].apply(undefined, arguments)
                    }
                    // check
                    if (typeof check.focus === 'function') {
                        // console.log('js item onFocus check',key)
                        self.checkFunc(key, correct.value.value, check.focus)
                    }
                },
                check:check
            }

        output = extend(
            true,
            extend(true, {}, settings),
            output,
            correct.value
        )
        self.data.itemMap[key] = output
        /**/
        dc.groupEnd()
        /**/
        return output
    }
    updateDOM = () => {
        this.settings.app.forceUpdate()
    }
    /** verify classify
     *   获取信息 success error
     *   选择去校验 check checkAll
     *   处理产生信息 checkFunc
     *   存放信息 emitPass emitFail
     */
    // get success checking info
    success = (key, render) => {
        const self = this
        if (typeof render === 'function') {
            return render(self.data.errorMap[key].data)
        }
        return self.data.successMap[key]
    }
    // get error checking info
    error = (key, render) => {
        const self = this
        let errorInfo = spare(self.data.errorMap[key], false)
        if(errorInfo){
            if (typeof render === 'function') {
                return render(errorInfo)
            }
            return errorInfo
        }else {
            return errorInfo
        }
    }
    // store success checking info
    emitPass = (key) => {
        const self = this
        delete self.data.errorMap[key]
        self.data.successMap[key] = true
        self.updateDOM()
    }
    // store error checking info
    emitFail = (key, data) => {
        const self = this
        self.data.errorMap[key] = data
        self.data.successMap[key] = false
        self.updateDOM()
    }
    /**
     * checkAll
     * @description [select all key to verify]
     *
     * @param   {Object} options
     * @param   {Function<Boolean, Object>}  callback(fail, error)
     *
     * @example checkAll([options,] callback)
     *
     */
    checkAll = (...args) => {
        let self = this
        // default props
        let checkAllCallback = function(){}
        let options = {}
        switch(typeof args[0]){
            case 'function':
                checkAllCallback = args[0]    
            break
            case 'object':
                options = args[0] || {}
                checkAllCallback = args[1]    
            break
        }
        options = self.getOptions(options)
        let checkArray = Object.keys(self.data.itemMap).map(function(key){
            return key
        })
        // console.log('checkAll (args:',args,') (options:',options,') (checkAllCallback:',checkAllCallback,')')

        // console.log('checkAll arguments',arguments)
        // console.log('checkAllCallback',checkAllCallback,'options', options)
        /**/
        dc.group('js checkAll')
        dc.log('checkArray', checkArray)
        /**/
        /* help for debug , translate this
            self.checkSome(checkArray,checkAllCallback)
         */
        self.check(
            checkArray,
            options,
            function(...args){
                checkAllCallback(...args)
                /**/
                dc.groupEnd()
                /**/
            }
        )
    }

    /**
     * check
     * @description [select some key to verify]
     *
     * @param   {String|Array<String>}  keyArray
     * @param   {Function<Boolean, Object>}  checkAllCallback(fail, error)
     * @param   {Objest} options
     *
     * @augments {options}
     * @param    {Boolean} queue
     * @param    {Boolean} every  [true: callback after all item verified, false: callback when anyone fail to verify]
     *
     *
     * @example check(keyArray, [options,] checkAllCallback)
     *
     */
    check = (keyArray, ...args) => {
        let self = this
        // default props
        let checkAllCallback = function(){}
        let options = {}
        switch(typeof args[0]){
            case 'function':
                checkAllCallback = args[0]    
            break
            case 'object':
                options = args[0] || {}
                checkAllCallback = args[1]    
            break
        }
        options = self.getOptions(options)
        keyArray = Array.isArray(keyArray) ? keyArray : [keyArray]
        keyArray = keyArray.filter(function (key) {
            return !self.data.itemMap[key].disabled
        })
        // console.log('check arguments',arguments)
        // console.log('keyArray',keyArray,'checkAllCallback',checkAllCallback,'options', options)
        /**/
        dc.group('js checkSome')
        dc.$input('@param', keyArray, options)
        /**/

        if(keyArray.length == 0){
            checkAllCallback(false, [])
            return
        }

        if(options.queue){
            /**/
            dc.log('js checkSome 队列式')
            /**/
            // 队列式校验
            let errors = []
            delayEach(
                keyArray,
                function (key, index, next, finish) {
                    /**/
                    dc.$input('delayEach',`key:${key}`,`index:${index}`)
                    /**/
                    self.checkOne(key, function(fail, err){
                        if (fail) {
                            errors = errors.concat(err)
                        }
                        /**/
                        dc.$input('delayEach',`key:${key}`,', fail',fail,', err:',err,', errors:',errors)
                        /**/
                        // 有一个校验失败,就结束校验执行回调
                        if(fail && !options.every){
                            finish()
                        }else{
                            next()
                        }
                    })
                },
                function () {
                    let fail = errors.length !== 0
                    // alert('checkAllCallback')
                    /**/
                    dc.log('all end',`fail:${fail}`,`errors:`,errors)
                    dc.groupEnd()
                    /**/
                    checkAllCallback(fail, errors)
                }
            )
        }else{
            /**/
            dc.log('js checkSome 并发式校验')
            /**/
            // 并发式校验
            new Promise((resolve, reject) => {
                let finishKeyArray = []
                let errors = []
                keyArray.forEach((key, index)=>{
                    /**/
                    dc.$input('forEach',`key:${key}`,`index:${index}`)
                    /**/
                    self.checkOne(key, function(fail, err){
                        if (fail) {
                            errors = errors.concat(err)
                        }
                        // 标记完成一个
                        finishKeyArray.push(key)
                        /**/
                        dc.$input('forEach',`key:${key}`,', fail',fail,', err:',err,', errors:',errors,', finishKeyArray:',finishKeyArray)
                        /**/
                        // 有一个校验失败,就结束校验执行回调
                        if(fail && !options.every){
                            errors.length !== 0 ? reject(errors) : resolve()
                        }else{
                            // 是否都完成了
                            if(finishKeyArray.length == keyArray.length){
                                errors.length !== 0 ? reject(errors) : resolve()
                            }
                        }
                    })
                })
            }).then(
                () => {
                    /**/
                    dc.log('forEach success')
                    dc.groupEnd()
                    /**/
                    checkAllCallback(false, [])
                },
                (errors) => {
                    /**/
                    dc.log('forEach errors',errors)
                    dc.groupEnd()
                    /**/
                    checkAllCallback(true, errors)
                }
            )
        }
    }
    // 检验单项
    checkOne = (key, callback) => {
        const self = this
        /**/
        dc.group('js checkOne')
        dc.$input('@param', key)
        /**/
        // console.log('{fn: js checkOne} {key:',key,'}')
        if(typeof self.data.itemMap[key].check.default !== 'function') {
            throw new Error('node_modules/form-logic: ...item(key, check:fn) check must setted')
            return false
        }

        let value = self.get(key)
        self.checkFunc(
            key,
            value,
            self.data.itemMap[key].check.default,
            function () {
                if (typeof callback === 'function') {
                    let errors = []
                    let errCnt = self.error(key)
                    if(errCnt !== false){
                        errors.push({
                            item: self.data.itemMap[key],
                            key: key,
                            data: errCnt
                        })
                    }
                    callback(
                        errors.length !== 0,
                        errors
                    )
                }
                /**/
                dc.groupEnd()
                /**/
            }
        )
    }
    // 将普通的校验处理函数转化成异步promise
    handlerToPromise = (fn) => {
        // console.log('{fn: js handlerToPromise} {fn:',fn,'}')
        /**/
        dc.group('js handlerToPromise')
        /**/
        if(fn instanceof Promise){
            // console.log('{fn: js handlerToPromise} Promise')
            /**/
            dc.log('is Promise')
            dc.groupEnd()
            /**/
            return fn
        }
        return new Promise(function(resolve, reject){
            if(fn === true){
                // console.log('{fn: js handlerToPromise} resolve')
                /**/
                dc.log('commonFn resolve')
                dc.groupEnd()
                /**/
                resolve()
            }else{
                // console.log('{fn: js handlerToPromise} {reject:',fn,'}')
                /**/
                dc.log('commonFn reject',fn)
                dc.groupEnd()
                /**/
                reject(fn)
            }
        })
    }
    /**
     * checkFunc 校验处理函数
     *
     * @param   {String}  key
     * @param   {String|Object|Array|Boolean|Number}  value
     * @param   {Function}  checkFn
     * @param   {Function}  callback
     *
     *
     */
    checkFunc = (key, value, checkFn, callback) => {
        const self = this
        // console.log('{fn:js checkFunc} {key:',key,'}')
        /**/
        dc.group('js checkFunc')
        dc.$input('@param', key, value)
        /**/
        let finishCallback = function () {
            if (typeof callback === 'function') {
                callback()
            }
            finishCallback = function(){}
        }
        let verifyResult = checkFn(value)
            verifyResult = self.handlerToPromise(verifyResult)
            verifyResult
            .then(
                () => {
                    // 校验成功处理
                    // console.log('{fn:js checkFunc} success')
                    /**/
                    dc.log('resolve')
                    /**/
                    self.emitPass(key)
                },
                (errMsg) => {
                    // 失败处理
                    // console.log('{fn:js checkFunc} {key:',key,'} {errMsg:',errMsg,'}')
                    /**/
                    dc.log('reject , key:',key,', errMsg:',errMsg)
                    /**/
                    self.emitFail(key, errMsg)
                }
            ).finally(
                () => {
                    /**/
                    dc.log('finally')
                    dc.groupEnd()
                    /**/
                    // console.log('{fn:js checkFunc} finally {key:',key,'}');
                    finishCallback()
                }
            )

    }
    /**
     * clear 清除表单中某项,某些项,所有项的校验痕迹(方式信息,结果信息等等)
     *
     * @param {Array|String} keyArray
     *
     * @example clear(key)  清除某项
     * @example clear(keyArray)   清除某些
     * @example clear()   清除所有
     * 
     */
    clear = (keyArray) => {
        let self = this
        let type 
        try{
            type = toString.call(keyArray)
        }catch(e){
            type = 'undefined'
        }
        switch(type){
            case '[object String]':  // one
                keyArray = keyArray ? [keyArray] : []
            break
            case '[object Array]':  // some
            break
            case 'undefined': 
            case '[object Undefined]':   // all
                keyArray = Object.keys(self.data.itemMap).map((key)=>{
                    return key 
                })
            break
            default :
        }
        // console.log('clear (keyArray:',keyArray,') (type:',type,')')

        keyArray.forEach((key) => {
            // clear data errorMap
            delete self.data.errorMap[key]
            // clear data itemMap
            delete self.data.itemMap[key]
            // clear data successMap
            delete self.data.successMap[key]
        })
        // console.log('clear (self.data:',JSON.parse(JSON.stringify(self.data)),')')
        self.updateDOM()
    }
    /**
     * checkRex
     *
     * @param {Array|Object} rule
     *
     *
     * @return {Boolean|String} true|errMsg
     */
    checkRex = (rule) => {
        // let self = this
        // let errors
        // if(Array.isArray(rule)){
        //     rule = extend(true,[],rule)
        //     rule = rule.map(function(item){
        //         if(defaultRule[item]){
        //             return defaultRule[item]
        //         }else{
        //             // throw new Error('不存在该默认配置规则')
        //         }
        //     })
        // }
    }
}
// require('./props').default(FormLogic)
export default FormLogic
module.exports= FormLogic
