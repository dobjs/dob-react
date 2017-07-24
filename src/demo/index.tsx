import * as React from "react"
import * as ReactDOM from "react-dom"
import { inject } from 'dependency-inject'
import { Action, observable } from 'dob'
import { Connect, Provider } from '../'

@Connect
class App extends React.Component<any, any> {
    render() {
        return (
            <button onClick={() => {
                this.props.store.name = 'nick'
            }}>click to change: {this.props.store.name}</button>
        )
    }
}

ReactDOM.render(
    <Provider store={observable({ name: 'bob' })}>
        <App />
    </Provider>
    , document.getElementById("react-dom"))
