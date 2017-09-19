import * as React from "react"
import * as ReactDOM from "react-dom"
import { inject, injectFactory } from 'dependency-inject'
import { Action, observable, startDebug } from 'dob'
import { Connect, Provider } from '../'

startDebug()
@observable
class UserStore {
    book = 123
}

class UserAction {
    @inject(UserStore)
    userStore: UserStore

    @Action test1() {
        this.userStore.book = 456

        const def = () => {
            this.userStore.book = 10
        }

        // Action(function abc() {
        //     this.userStore.book = 789
        // }.bind(this));
        Action(def)
    }
}

@Connect(injectFactory({
    UserStore,
    UserAction
}))
class App extends React.Component<any, any> {
    render() {
        return (
            <div onClick={this.props.UserAction.test1}>
                {this.props.UserStore.book}
            </div>
        )
    }
}

ReactDOM.render(
    <App />
    , document.getElementById("react-dom"))
