import * as React from "react"
import * as ReactDOM from "react-dom"
import { inject } from 'dependency-inject'
import { Action, observable } from 'dynamic-object'
import { Connect } from '../'

@observable
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
        }, 1000)
    }

    render() {
        return (
            <div>{this.props.store.title}</div>
        )
    }
}

ReactDOM.render(<Article />, document.getElementById("react-dom"))
