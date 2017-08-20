import * as React from "react"
import * as ReactDOM from "react-dom"
import { inject, injectFactory } from 'dependency-inject'
import { Action, observable } from 'dob'
import { Connect, Provider } from '../'

function wait(time: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

@observable
class UserStore {
    name = '小明'
    age = 18
}

class UserAction {
    @inject(UserStore)
    userStore: UserStore

    @Action async setName(name: string) {
        await wait(100)
        this.userStore.name = name
    }

    @Action async setAge(age: number) {
        this.userStore.age = age
    }
}

const stores = injectFactory({
    UserStore,
    UserAction
})

@Connect
class App extends React.Component<any, any> {
    componentWillMount() {
        setTimeout(() => {
            this.props.UserAction.setAge(30)
        }, 1000)
    }

    render() {
        return (
            <div>
                <button
                    onClick={this.props.UserAction.setAge.bind(this, 20)}
                >
                    click to change:
                {this.props.UserStore.name}
                </button>
                <Module1 />
            </div>
        )
    }
}

@Connect
class Module1 extends React.Component<any, any> {
    render() {
        console.log(this.refs['aa'])
        return (
            <div ref="aa">{this.props.UserStore.age}</div>
        )
    }
}

ReactDOM.render(
    <Provider {...stores}>
        <App />
    </Provider>
    , document.getElementById("react-dom"))
