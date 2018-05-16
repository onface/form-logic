import React , { Component } from "react"
import FormLogic from "face-form"
import $ from 'jquery'

class Disabled extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                user: 'nimo1'
            },
            disabled:false
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
            console.log(fail, errors)
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
            <form
                onSubmit={function(e) {
                    e.preventDefault()
                    self.checkAll()
                }}
             >
                <input {...self.form.item('user', {
                    disabled: self.state.disabled,
                    check: (value) => {
                        return new Promise((resolve, reject) => {
                            if(/\d/.test(value)){
                                reject('user 不允许出现数字')
                            }else{
                                resolve()
                            }
                        })
                    }
                })} />
                disabled:
                <input type="checkbox"
                        checked={self.state.disabled}
                        onChange={function(){
                            self.setState({
                                disabled:!self.state.disabled
                            })
                        }}
                />
                <pre>{self.form.error('user')}</pre>
                <button type="submit" >
                    Submit
                </button>
            </form>
        )
    }
}
/*ONFACE-DEL*/Disabled = require('react-hot-loader').hot(module)(Disabled)
export default Disabled
