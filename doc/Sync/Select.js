import React , { Component } from "react"
import FormLogic from "form-logic"
class Select extends Component {
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
                <select {...self.form.item('user')}>
                    <option value="tim" >tim</option>
                    <option value="nimo" >nimo</option>
                    <option value="nico" >nico</option>
                </select>
                <br />
                <code>
                {self.form.get('user')}
                </code>
            </div>
        )
    }
}
/*ONFACE-DEL*/Select = require('react-hot-loader').hot(module)(Select)
export default Select
