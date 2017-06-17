import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { inject, Container } from 'dependency-inject'
import { Action, observable } from 'dynamic-object'
import { Provider, Connect } from '../'

class ArticleStore {
    title = "我是标题党"
}

class ArticleAction {
    @inject(ArticleStore) articleStore: ArticleStore

    @Action changeTitle() {
        this.articleStore.title = "改变了"
    }
}

@Connect({
    store: ArticleStore,
    action: ArticleAction
})
class Article extends React.Component<any, void> {
    componentWillMount() {
        setTimeout(() => {
            this.props.action.changeTitle()
        }, 2000)
    }

    render() {
        return (
            <div>{this.props.store.title}</div>
        )
    }
}





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
        // this.store.nickname = name
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
        console.log('render', this.props)
        return (
            <div>
                {this.props.store.age}
                <Article />
            </div>
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




class Test {
    // @Action async getUser() {
    //     this.isLoading = true
    //     const result = await fetch()
    //     Action(() => {
    //         this.isLoading = false
    //         this.user = result
    //     })
    // }
}

