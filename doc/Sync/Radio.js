import React , { Component } from "react"
import FormLogic from "face-form"
class Radio extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                user: ''
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
                <label>
                    <input
                        {...self.form.radio('user', {
                            value: 'tim'
                        })}
                    /> tim
                </label>
                <label>
                    <input
                        {...self.form.radio('user', {
                            value: 'nimo'
                        })}
                    /> nimo
                </label>
                <label>
                    <input
                        {...self.form.radio('user', {
                            value: 'nico'
                        })}
                    /> nico
                </label>
                <br />
                <code>
                {JSON.stringify(self.form.get('user'))}
                </code>

            </div>
        )
    }
}
/*ONFACE-DEL*/Radio = require('react-hot-loader').hot(module)(Radio)
export default Radio
