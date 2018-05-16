import React , { Component } from "react"
import FormLogic from "face-form"

class Range extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {

        }
    }
    render() {
        const self = this
        return (
            <div>
                <select
                    className="rangeStart"
                    value={self.props.start}
                    onChange={function (e) {
                        self.props.onChange(
                            e.target.value,
                            self.props.end
                        )
                    }}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <select
                    className="rangeEnd"
                    value={self.props.end}
                    onChange={function (e) {
                        self.props.onChange(
                            self.props.start,
                            e.target.value
                        )
                    }}
                >
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select>
            </div>
        )
    }
}

class Props extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                range: [1, 4]
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
                {/*
                    <Range
                        start={'2'}
                        end={'5'}
                        onChange={function (start, end) {
                            console.log(start, end)
                        }}
                    />
                */}
                <Range
                    {...self.form.item('range', {
                        props: function (value) {
                            return {
                                start: value[0],
                                end: value[1]
                            }
                        },
                        sync: function (start, end) {
                            return [start, end]
                        }
                    })}
                />
                <br />
                <code>
                {JSON.stringify(self.form.get('range'))}
                </code>
            </div>
        )
    }
}
/*ONFACE-DEL*/Props = require('react-hot-loader').hot(module)(Props)
export default Props
