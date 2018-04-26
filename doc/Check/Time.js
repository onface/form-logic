import React , { Component } from "react"
import FormLogic from "form-logic"
import $ from 'jquery'
class Time extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                price: ''
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
    render() {
        const self = this
        return (
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
                价格 (10~100/元): <br/>
                <input {...self.form.item('price', {
                    check: {
                        'default|blur': function(value) {
                            if(!/\S/.test(value)){
                                return '价格必填'
                            }
                            if(/[^\d]/.test(value)){
                                return '只能输入数字'
                            }
                            if(value < 10 || value > 100){
                                return '价格必须在 10 ~ 100 之间'
                            }
                            return true
                        },
                        focus: function(value) {
                            if(!/\S/.test(value)){
                                return '(获取焦点时检测)价格必填'
                            }
                            if(value < 10 || value > 100){
                                return '(获取焦点时检测)价格必须在 10 ~ 100 之间'
                            }
                            return true
                        },
                        change: (value) => {
                            return /[^\d]/.test(value) ? '(输入时检测)只能输入数字' : true
                        }
                    }
                })} />
            <pre>{self.form.error('price')}</pre>
                <button type="submit" >
                    Submit
                </button>
            </form>
        )
    }
}
/*ONFACE-DEL*/Time = require('react-hot-loader').hot(module)(Time)
export default Time
