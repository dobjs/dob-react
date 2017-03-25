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

    setName(name: string) {
        this.store.name = name
    }
}

const container = new Container()
container.set(Store, new Store())
container.set(Action, new Action())

@Connect
class App extends React.Component<any, any> {
    componentWillMount() {
        setTimeout(() => {
            this.props.action.setName('nick')
        }, 1000)

    }

    componentWillReact() {
        console.log(this.props.store.name)
    }

    render() {
        runCount++
        console.log('run', this.props.store.name)

        return (
            <span />
        )
    }
}

ReactDOM.render(
    <Provider store={container.get(Store)} action={container.get(Action)} >
        <App />
    </Provider>, document.getElementById('react-dom'))