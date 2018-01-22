import React , { Component } from "react"
import FormLogic from "form-logic"
class Textarea extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                user: 'nimo'
            }
        }
        self.form = new FormLogic({
            getValue: function () { return self.state.form},
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
            <div>
                <textarea {...self.form.textarea('user')} />
                <br />
                <code>
                {self.form.get('user')}
                </code>
            </div>
        )
    }
}
/*ONFACE-DEL*/Textarea = require('react-hot-loader').hot(module)(Textarea)
export default Textarea
