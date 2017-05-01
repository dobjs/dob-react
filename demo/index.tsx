import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { inject, Container } from 'dependency-inject'
import { Provider, Connect } from '../'

let runCount = 0

class Store {
    name = 'bob'
    age = 5
    get count() {
        return this.name + this.age
    }
}

class Action {
    @inject(Store) store: Store

    setName(name: string) {
        this.store.name = name
    }

    setAge(age: number) {
        this.store.age = age
    }
}

const container = new Container()
container.set(Store, new Store())
container.set(Action, new Action())

@Connect
class App extends React.Component<any, any> {
    componentWillMount() {
        setTimeout(() => {
            this.props.action.setName('aaa')
        })
        setTimeout(() => {
            this.props.action.setAge(6)
        })
    }

    renderHeader() {
        return (
            <span>{this.props.store.count}</span>
        )
    }

    render() {
        console.log('run')

        return (
            <span>{this.renderHeader()}</span>
        )
    }
}

ReactDOM.render(
    <Provider store={container.get(Store)} action={container.get(Action)} >
        <App />
    </Provider>, document.getElementById('react-dom'))