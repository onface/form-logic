import React , { Component } from "react"
import FormLogic from "form-logic"
import $ from 'jquery'

class Options extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                user: 'nimo1'
            },
            queue:true,
            every:true,
            time: 0 // 辅助计时 忽略参数
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
            },
            options:function () {
                return {
                    queue:self.state.queue,
                    every:self.state.every
                }
            }
            /* 也可以写成
            options: {
                queue:true,
                every:true
            }
            */
        })
    }
    checkAll = () => {
        let self = this

        /* 辅助计时 忽略代码 start */
        let count = 0
        self.setState({
            time: 0
        })
        while(count<6){
            setTimeout(()=>{
                self.setState({
                    time: self.state.time + 1
                })
                console.log(self.state.time+'s')
            },count*1000 + 1000)
            count++
        }
        /* 辅助计时 忽略代码 end */

        // 校验
        self.form.checkAll(
            function (fail, errors) {
                if (fail) {
                    alert(errors[0].data)
                    self.refs[errors[0].item.ref].focus()
                    return
                }
                alert('success')
            }
        )
        /* 也可以写成
        self.form.checkAll(
            {
                queue:true,
                every:true
            },
            function (fail, errors) {
                ...
            }
        )
        */
    }
    render() {
        const self = this
        return (
            <form
                onSubmit={function(e) {
                    e.preventDefault()
                    self.checkAll()
                }}
             >
                 user:
                 <input {...self.form.item('user', {
                     check: (value) => {
                         return /\d/.test(value) ? '不能存在数字' : true
                     }
                 })} />
                 (立即返回校验结果)
                 <pre>{self.form.error('user')}</pre>
                 psw:
                 <input {...self.form.item('psw', {
                     check: (value) => {
                         return new Promise((resolve, reject) => {
                             setTimeout(()=>{
                                 if(!/\S/.test(value)){
                                     reject('密码必填')
                                 }else{
                                     resolve()
                                 }
                             },2000)
                         })
                     }
                 })} />
                 (2秒后返回校验结果)
                 <pre>{self.form.error('psw')}</pre>
                 repsw:
                 <input {...self.form.item('repsw', {
                    check: (value) => {
                        return new Promise((resolve, reject) => {
                            setTimeout(()=>{
                                if(value == self.form.psw){
                                    resolve()
                                }else{
                                    reject('密码不一致')
                                }
                            },3000)
                        })
                    }
                })} />
                (3秒后返回校验结果)
                <pre>{self.form.error('repsw')}</pre>
                
                <hr/>
                    queue:
                    <select value={self.state.queue}
                        onChange={function(e){
                            self.setState({
                                queue:e.target.value == 'true' ? true : false
                            })
                        }}
                    >
                        <option value={true} >true</option>
                        <option value={false} >false</option>
                    </select>
                    every:
                    <select value={self.state.every}
                        onChange={function(e){
                            self.setState({
                                every:e.target.value == 'true' ? true : false
                            })
                        }}
                    >
                        <option value={true} >true</option>
                        <option value={false} >false</option>
                    </select>
                     {' ( 辅助计时,方便对比: '+ self.state.time+' s ) '}
                <button type="submit" >
                    Submit
                </button>
            </form>
        )
    }
}
/*ONFACE-DEL*/Options = require('react-hot-loader').hot(module)(Options)
export default Options
