import React , { Component } from "react"
import FormLogic from "form-logic"
class Input extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                user: 'nimo',
                age: 12
            }
        }
        self.form = new FormLogic({
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
            <div>
                <input {...self.form.item('user')} />
                <input {...self.form.item('age')} />
                <br />
                <code>
                    {self.form.get('user')}:{self.form.get('age')}
                </code>
                <br />
                <button
                    onClick={function () {
                        self.form.set('user', Math.random().toFixed(2))
                    }}
                >
                    set(key, value)
                </button>
                <button
                    onClick={function () {
                        self.form.set({
                            user: Math.random().toFixed(2),
                            age: Math.random().toFixed(2)
                        })
                    }}
                >
                    set(object)
                </button>
                <button
                    onClick={function (e) {
                        e.target.innerHTML = JSON.stringify(self.form.getValue())
                    }}
                >
                    getValue
                </button>

            </div>
        )
    }
}
/*ONFACE-DEL*/Input = require('react-hot-loader').hot(module)(Input)
export default Input
