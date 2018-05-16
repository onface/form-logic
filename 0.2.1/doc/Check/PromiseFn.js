import React , { Component } from "react"
import FormLogic from "face-form"
import $ from 'jquery'
class PromiseFn extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                user: 'nimo1'
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
                <input {...self.form.item('user', {
                    check: function(value) {
                        return new Promise(function(resolve, reject) {
                            // mock do async something
                            setTimeout(function(){
                                if(/\d/.test(value)){
                                    reject('不允许出现数字')
                                }
                                if(!/\S/.test(value)){
                                    reject('用户名必填')
                                }
                                resolve()
                            },1000)
                        })
                    }
                })} />
                <pre>{self.form.error('user')}</pre>
                <button type="submit" >
                    Submit
                </button>
            </form>
        )
    }
}
/*ONFACE-DEL*/PromiseFn = require('react-hot-loader').hot(module)(PromiseFn)
export default PromiseFn
