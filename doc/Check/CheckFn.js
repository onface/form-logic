import React , { Component } from "react"
import FormLogic from "form-logic"
import $ from 'jquery'
class CheckFn extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                user: 'nimo123',
                psw: '',
                repsw: '',
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
    checkAll = () => {
        let self = this
        self.form.checkAll(function (fail, errors) {
            if (fail) {
                alert(errors[0].data)
                self.refs[errors[0].item.ref].focus()
                return
            }
            alert('success')
        })
    }
    check = (key) => {
        let self = this
        self.form.check(key, function(fail, errors) {
            if (fail) {
                alert(errors[0].data)
                self.refs[errors[0].item.ref].focus()
                return
            }
            alert('success')
        })
    }
    render() {
        const self = this
        return (
            <form onSubmit={function(e){
                    e.preventDefault();
                }}
            >
                user (非数字): <br/>
                <input {...self.form.item('user', {
                    check: (value) => {
                        return /\d/.test(value) ? '不能存在数字' : true
                    }
                })} />
                <pre>{self.form.error('user')}</pre>

                psw (必填): <br/>
                <input {...self.form.item('psw', {
                    check: (value) => {
                        return !/\S/.test(value) ? '密码必填' : true
                    }
                })} />
                <pre>{self.form.error('psw')}</pre>

                repsw (必填): <br/>
                <input {...self.form.item('repsw', {
                    check: (value) => {
                        return value == self.form.psw ? true : '密码不一致'
                    }
                })} />
                <pre>{self.form.error('repsw')}</pre>

                <button onClick={function() {
                    self.check('user')
                }}
                >check('psw')</button>
                <button onClick={function() {
                    self.check(['user','psw'])
                }}
                >check(['user','psw'])</button>
                <button onClick={function() {
                    self.checkAll()
                }}
                >checkAll</button>
            </form>
        )
    }
}
/*ONFACE-DEL*/CheckFn = require('react-hot-loader').hot(module)(CheckFn)
export default CheckFn
