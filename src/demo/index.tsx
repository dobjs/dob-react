import * as React from "react"
import * as ReactDOM from "react-dom"
import { inject, injectFactory } from 'dependency-inject'
import { Action, observable, useDebug } from 'dob'
import { Connect, Provider } from '../'

useDebug()

function wait(time: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

const book = {
    title: 'ccc'
}

@observable
class UserStore {
    books = new Set([book])
}

class UserAction {
    @inject(UserStore)
    userStore: UserStore

    @Action async setTitle() {
        this.userStore.books.add({
            title: 'ddd'
        })
    }
}

@Connect(injectFactory({
    UserStore,
    UserAction
}))
class App extends React.Component<any, any> {
    render() {
        this.props.UserStore.books.forEach((book: any) => {
            book
        })

        return (
            <div>
                <button
                    onClick={this.props.UserAction.setTitle}
                >
                    click to change:
                </button>
            </div>
        )
    }
}

ReactDOM.render(
    <App />
    , document.getElementById("react-dom"))
