import React , { Component } from "react"
import FormLogic from "form-logic"
import $ from 'jquery'
class Basic extends Component {
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
            onSync: function (key, value) {
                let state = self.state
                state.form[key] = value
                self.setState({
                    form: state.form
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
                    check: {
                        default: function (check) {
                            /\d/.test(check.value)?check.fail('不允许出现数字'):check.pass()
                        },
                        change: function (check) {
                            /\d/.test(check.value)?check.fail('不允许出现数字'):check.pass()
                        },
                        blur: function (check) {
                            /\d/.test(check.value)?check.fail('不允许出现数字'):check.pass()
                        }
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
/*ONFACE-DEL*/Basic = require('react-hot-loader').hot(module)(Basic)
export default Basic
