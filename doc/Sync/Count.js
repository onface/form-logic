import React , { Component } from "react"
import FormLogic from "form-logic"

class Count extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {

        }
    }
    render() {
        const self = this
        return (
            <button className="countButton" onClick={function () {
                    self.props.onMount(
                        self.props.count + 1
                    )
                }} >
                {self.props.count}
            </button>
        )
    }
}


class CountDemo extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                user: 1
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
                {/*
                    <Count count={1} onMount={function(count){...}} />
                */}
                <Count
                    {
                        ...self.form.item('user', {
                            props: 'count',
                            change: 'onMount'
                        })
                    }
                />
            </div>
        )
    }
}
/*ONFACE-DEL*/CountDemo = require('react-hot-loader').hot(module)(CountDemo)
export default CountDemo
