import React , { Component } from "react"
import FormLogic from "face-form"
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
