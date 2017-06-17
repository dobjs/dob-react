import * as React from "react"
import * as ReactDOM from "react-dom"
import { inject } from 'dependency-inject'
import { Action, observable } from 'dynamic-object'
import { Connect, Provider } from '../'

@Connect
class App extends React.Component<any, any> {
    render() {
        console.log(this.props)
        return (
            <span ></span>
        )
    }
}

ReactDOM.render(
    <Provider store={{ name: 'bob' }}>
        <App />
    </Provider>
    , document.getElementById("react-dom"))
