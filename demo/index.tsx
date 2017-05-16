import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { inject, Container } from 'dependency-inject'
// import { Action } from 'dynamic-object'
import { Provider, Connect } from '../'

class UserStore {
    name = 'bob'
    age = 15
}

class UserAction {
    @inject(UserStore) store: UserStore

    setName(name: string) {
        this.store.name = name
    }

    setAge(age: number) {
        this.store.age = age
    }

    setNickname(name: string) {
        this.store.nickname = name
    }
}

@Connect
class App extends React.Component<any, any> {
    componentWillMount() {
        setTimeout(() => {
            this.props.action.setAge(18)
        }, 1000)
    }

    render() {
        console.log('render')
        return (
            <div>{this.props.store.age}</div>
        )
    }
}







const container = new Container()
container.set(UserStore, new UserStore())
container.set(UserAction, new UserAction())

ReactDOM.render(
    <Provider store={container.get(UserStore)} action={container.get(UserAction)} >
        <App />
    </Provider>, document.getElementById('react-dom'))