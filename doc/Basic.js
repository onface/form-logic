import React , { Component } from "react"
import FormLogic from "face-form"
import $ from 'jquery'
var dc = require('delay-console');
;(typeof global?global.dcDebug = true:window.dcDebug = true)

class Basic extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                user: 'nimo1',
                psw: '',
                sms: '',
            }
        }
        self.form = new FormLogic({
            app: self,
            getValue: function () { return self.state.form },
            onSync: function (value) {
                let state = self.state
                state.form = value
                self.setState({
                    form: value
                })
            }
        })
    }
    checkAll = (e) => {
    	let self = this
        /**/
        dc.group('demo checkAll')
        /**/
    	e.preventDefault()
        self.form.checkAll(function (fail, errors) {
            /**/
            dc.log('fail:',fail,', errors',errors)
            dc.groupEnd()
            dc.$show()
            /**/
            if (fail) {
                alert(errors[0].data)
                self.refs[errors[0].item.ref].focus()
                return
            }
            alert('{fn: demo checkAll} success')
        })
    }
    checkSome = () => {
        let self = this
        let keyArray = ['user', 'psw','sms']
        /**/
        dc.group('demo checkSome')
        dc.$input('@param', keyArray)
        /**/
        self.form.check(
            keyArray, 
            {
                queue:false, // false: 全部校验并发执行 | 默认true: 全部交验依次队列执行
                every:true // 默认true: 全部项全部校验完(无论失败成功),最后执行回调 | false: 有一个校验失败,就结束校验执行回调
            },
            function (fail, errors) {
                /**/
                dc.log('fail:',fail,', errors',errors)
                dc.groupEnd()
                dc.$show()
                /**/
                if (fail) {
                    console.log(errors[0].data)
                    self.refs[errors[0].item.ref].focus()
                    return
                }
                console.log('{fn: demo checkSome} success')
            },
        )
    }
    checkOne = (key) => {
        let self = this
        /**/
        dc.group('demo checkOne')
        dc.$input('@param', key)
        /**/
        self.form.check(key, function(fail, errors) {
            /**/
            dc.log('key:',key,', fail:',fail,', errors',errors)
            dc.groupEnd()
            dc.$show()
            /**/
            if (fail) {
                alert(errors[0].data)
                self.refs[errors[0].item.ref].focus()
                return
            }
            alert('{fn: demo checkOne} success')
        })
    }
    render() {
        const self = this
        console.log('self.form (',self.form,')')
        return (
            <div>
                <form
                    onSubmit={function(e) {
                        self.checkAll(e)
                    }}
                >
                    user: <input {...self.form.item('user', {
                        check: function(value) {
                            /**/
                            dc.group('demo input')
                            dc.log(`key:user`,`value:${value}`)
                            /**/
                            // console.log('{fn: demo input check} {key: user} {value:',value,'}')
                            return new Promise(function(resolve, reject){
                                if(/\S/.test(value)){
                                    console.log('{fn: demo input check} {key: user} resolve ')
                                    /**/
                                    dc.log('resolve')
                                    dc.groupEnd()
                                    /**/
                                    resolve()
                                }else{
                                    console.log('{fn: demo input check} {key: user} reject ')
                                    /**/
                                    dc.log('reject')
                                    dc.groupEnd()
                                    /**/
                                    reject('user 不能为空')
                                }
                            })
                        }
                    })} />
                    <pre>
                        {self.form.error('user',function(msg){
                            return <i>{msg||''}</i>
                        })}
                    </pre>
                    psw: <input {...self.form.item('psw', {
                        check: function(value) {
                            console.log('{fn: demo input check} {key: psw} {value:',value,'}')
                            /**/
                            dc.group('demo input')
                            dc.log(`key:psw`,`value:${value}`)
                            /**/
                            return new Promise(function(resolve, reject){
                                setTimeout(()=>{
                                if(/\S/.test(value)){
                                    console.log('{fn: demo input check} {key: psw} resolve ')
                                    /**/
                                    dc.log('resolve')
                                    dc.groupEnd()
                                    /**/
                                    resolve()
                                }else{
                                    console.log('{fn: demo input check} {key: psw} reject ')
                                    /**/
                                    dc.log('reject')
                                    dc.groupEnd()
                                    /**/
                                    reject('psw 不能为空')
                                }
                                },2000)
                            })
                        }
                    })} />
                    <pre>
                        {self.form.error('psw',function(msg){
                            // console.log('{fn: demo error} {key: psw} {msg:',msg,'}')
                            return <i>{msg||''}</i>
                        })}
                    </pre>
                    sms: <input {...self.form.item('sms', {
                        check: {
                            'change':function(value) {
                                console.log('{fn: demo input check blur|change } {key: sms} {value:',value,'}')
                                /**/
                                dc.group('demo input')
                                dc.log(`key:sms`,`value:${value}`)
                                /**/
                                return new Promise(function(resolve, reject){
                                    if(/\S/.test(value)){
                                        console.log('{fn: demo input check blur|change } {key: sms} resolve ')
                                        /**/
                                        dc.log('resolve')
                                        dc.groupEnd()
                                        /**/
                                        resolve()
                                    }else{
                                        console.log('{fn: demo input check blur|change } {key: sms} reject ')
                                        /**/
                                        dc.log('reject')
                                        dc.groupEnd()
                                        /**/
                                        reject('sms 不能为空')
                                    }
                                })
                            },
                            'blur|default': function(value) {
                                console.log('{fn: demo input commonCheck default} {key: sms} {value:',value,'}')
                                /**/
                                dc.group('demo input')
                                dc.log(`key:sms`,`value:${value}`)
                                /**/
                                if(/\S/.test(value)){
                                    console.log('{fn: demo input commonCheck default} {key: sms} success ')
                                    /**/
                                    dc.log('resolve')
                                    dc.groupEnd()
                                    /**/
                                    return true
                                }else{
                                    console.log('{fn: demo input commonCheck default} {key: sms} errMsg ')
                                    /**/
                                    dc.log('reject')
                                    dc.groupEnd()
                                    /**/
                                    return 'sms 不能为空'
                                }
                            }
                        }
                    })} />
                    <pre>
                        {self.form.error('sms',function(msg){
                            // console.log('{fn: demo error} {key: sms} {msg:',msg,'}')
                            return <i>{msg||''}</i>
                        })}
                    </pre>
                    <button type="submit" >
                        Submit
                    </button>
                </form>


                <button
                    onClick={function(){
                        self.checkSome()
                    }}
                >start checkSome</button>
                <br/> 
                <button
                    onClick={function(){
                        self.checkOne('sms')
                    }}
                >start checkOne('sms')</button> 
            </div>
        )
    }
}
/*ONFACE-DEL*/Basic = require('react-hot-loader').hot(module)(Basic)
export default Basic
module.exports= Basic
