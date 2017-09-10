import * as React from "react"
import * as ReactDOM from "react-dom"
import { inject, injectFactory } from 'dependency-inject'
import { Action, observable, startDebug } from 'dob'
import { Connect, Provider } from '../'

startDebug()

function wait(time: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

const obj = {}

const book = {
    title: 'ccc'
}

@observable
class UserStore {
    books1 = new Set([book])
    books2 = new Map([['book', book]])
    books3 = new WeakSet([book])
    books4 = new WeakMap([[obj, book]])
}

class UserAction {
    @inject(UserStore)
    userStore: UserStore

    @Action async setTitle() {
        this.userStore.books1.add({
            title: 'ddd'
        })
        delete this.userStore.books2.get('book').title
        this.userStore.books3.add({ a: 1 } as any)
        this.userStore.books4.get(obj).title = '666'
        delete this.userStore.books4.get(obj).title
    }
}

@Connect(injectFactory({
    UserStore,
    UserAction
}))
class App extends React.Component<any, any> {
    render() {
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
