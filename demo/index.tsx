import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { inject, Container } from 'dependency-inject'
import { Provider, Connect } from '../'

let runCount = 0

class Store {
    name = 'bob'
}

class Action {
    @inject(Store) store: Store
}

const container = new Container()
container.set(Store, new Store())
container.set(Action, new Action())

let nested = 0

class App extends React.Component<any, any> {
    appName = "App" + nested++

    render() {
        console.log('run')

        if (nested < 5) {
            return <ConnectApp />
        }

        return null as any
    }
}

const ConnectApp = Connect(App)

ReactDOM.render(
    <Provider store={container.get(Store)} action={container.get(Action)} >
        <ConnectApp />
    </Provider>, document.getElementById('react-dom'))