import React , { Component } from "react"
import FormLogic from "face-form"
class Input extends Component {
    constructor (props) {
        super(props)
        const self = this
        self.state = {
            form: {
                user: 'nimo',
                age: 12,
                lists:[
                    {
                        id:111,
                        name:'grifree'
                    },{
                        id:222,
                        name:'haha'
                    }
                ]
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
                <table>
                <tbody>
                <tr>
                <td>
                            this.state = 
                            <pre>
                                {JSON.stringify(self.state.form, null, 4)}
                            </pre>
                </td>
                <td>
                            user: <input {...self.form.item('user')} /><br/>
                            age: <input {...self.form.item('age')} /><br/>
                </td>
                </tr>
                </tbody>
                </table>
                <table>
                <tbody>
                <tr>
                <td>
                            <pre className="code"
                                onClick={function () {
                                    self.form.set(
                                        'user', 
                                        Math.random().toFixed(2)
                                    )
                                }}
                            >
                                set('user', Math.random().toFixed(2) )
                            </pre>
                            <pre className="code"
                                onClick={function() {
                                    self.form.set('lists[0].name',Math.random())
                                }}
                            >
                                set('lists[0].name', Math.random())
                            </pre>
                            <pre className="code"
                                onClick={function() {
                                    self.form.set('lists[{id:222}].name',Math.random())
                                }}
                            >
                                {`set('lists[{id:222}].name',Math.random())`}
                            </pre>
                            <pre className="code"
                                onClick={function () {
                                    self.form.set({
                                        user: Math.random().toFixed(2),
                                        age: Math.random().toFixed(2)
                                    })
                                }}
                            >
{`set({
    user: Math.random().toFixed(2),
    age: Math.random().toFixed(2)
})`}
                            </pre>
                            <pre className="code"
                                onClick={function () {
                                    self.form.set(
                                        'lists[0]',
                                        {
                                            id: Math.random(),
                                            name: Math.random()
                                        }
                                    )
                                }}
                            >
{`set('lists[0]',{
    id: Math.random(),
    name: Math.random()
})`}
                            </pre>

                </td>
                <td>
                            <pre className="code"
                                onClick={function (e) {
                                    alert(JSON.stringify(self.form.getValue()))
                                }}
                            >
                                getValue
                            </pre>
                            <pre className="code"
                                onClick={function (e) {
                                    alert(JSON.stringify(self.form.get('user')))
                                }}
                            >
                                get('user')
                            </pre>
                            <pre className="code"
                                onClick={function (e) {
                                    alert(JSON.stringify(self.form.get('lists[0].name')))
                                }}
                            >
                                get('lists[0].name')
                            </pre>
                            <pre className="code"
                                onClick={function (e) {
                                    alert(JSON.stringify(self.form.get('lists[{id:222}].name')))
                                }}
                            >
                                {`get('lists[{id:222}].name')`}
                            </pre>
                            <pre className="code"
                                onClick={function (e) {
                                    alert(JSON.stringify(self.form.get('lists[0]')))
                                }}
                            >
                                get('lists[0]')
                            </pre>
                </td>
                </tr>
                </tbody>
                </table>


            </div>
        )
    }
}
/*ONFACE-DEL*/Input = require('react-hot-loader').hot(module)(Input)
export default Input
