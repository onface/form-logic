import React , { Component } from "react"
import FormLogic from "face-form"
import $ from 'jquery'
import safeExt from 'safe-extend'
class Clear extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            type: 'company',
            form: {
                user: 'nimo1',
                company_name: '123'
            }
        }
        self.form = new FormLogic({
            app: self,
            getValue: function () {
                return self.state.form
            },
            onSync: function (value) {
                let state = self.state
                state.form = value
                self.setState({
                    form: value
                })
            }
        })
    }
    render() {
        const self = this
        console.log('self.form.data',self.form.data)
        return (
            <div>
                <select
                    name="type"
                    value={self.state.type}
                    onChange={function(e){
                        self.setState({
                            type:e.target.value
                        })
                    }}
                >
                    <option value="">其他</option>
                    <option value="company">公司注册</option>
                    <option value="person">个人注册</option>
                </select>
                <form
                    onSubmit={function(e) {
                        e.preventDefault()
                        self.form.checkAll(function (fail, errors) {
                            if (fail) {
                                alert(errors[0].data)
                                self.refs[errors[0].item.ref].focus()
                                return
                            }
                            alert('success')
                        })
                    }}
                 >
                    {
                        self.state.type
                        ? (<div>
                            名字: 
                            <input {...self.form.item('user', {
                                check: {
                                    default: function (value) {
                                        if(/\d/.test(value)){
                                            return '名字 不允许出现数字'
                                        }else {
                                            return true
                                        }
                                    },
                                    change: function (value) {
                                        return /\d/.test(value) ? '名字 不允许出现数字' : true
                                    },
                                    blur: (value) => {
                                        return /\d/.test(value) ? '名字 不允许出现数字' : true
                                    }
                                }
                            })} />
                            <pre>{self.form.error('user')}</pre>
                        </div>) : null
                    }
                    {
                        self.state.type == 'company'
                        ? (<div>
                            公司名字: 
                            <input {...self.form.item('company_name', {
                                check: {
                                    default: function (value) {
                                        if(/\d/.test(value)){
                                            return '公司名字 不允许出现数字'
                                        }else {
                                            return true
                                        }
                                    },
                                    change: function (value) {
                                        return /\d/.test(value) ? '公司名字 不允许出现数字' : true
                                    },
                                    blur: (value) => {
                                        return /\d/.test(value) ? '公司名字 不允许出现数字' : true
                                    }
                                }
                            })} />
                            <pre>{self.form.error('company_name')}</pre>
                        </div>) : null
                    }
                    <button type="submit" >
                        Submit
                    </button>
                </form>
                <hr/>
                <button 
                    onClick={function(){
                        self.setState({
                            type:''
                        })
                        self.form.clear()
                    }}
                >clear()</button>
                <button 
                    onClick={function(){
                        self.setState({
                            type:'person'
                        })
                        self.form.clear('company_name')
                    }}
                >clear('company_name')</button>
                <pre>
                    {JSON.stringify(self.form.data, null, 4)}
                </pre>
            </div>
        )
    }
}
/*ONFACE-DEL*/Clear = require('react-hot-loader').hot(module)(Clear)
export default Clear
