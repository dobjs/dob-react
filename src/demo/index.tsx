import * as React from "react"
import * as ReactDOM from "react-dom"
import { Action } from 'dynamic-object'
import { Provider, Connect } from '../'

class UserStore {
    name = 'bob'
}

class UserAction {
    store = new UserStore()

    @Action setName(name: string) {
        this.store.name = name
    }
}

@Connect
class App extends React.Component<any, any> {
    render() {
        return (
            <span>
                {this.props.store.name}
                <button onClick={() => {
                    this.props.action.setName("jack")
                }}>updateName</button>
            </span>
        )
    }
}

const userAction = new UserAction()

ReactDOM.render(
    <Provider action={userAction} store={userAction.store}>
        <App />
    </Provider>
    , document.getElementById('react-dom'))
