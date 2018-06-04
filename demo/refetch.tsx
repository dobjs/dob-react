import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { combineStores, observable, inject, observe } from 'dob'
import { Provider, Connect } from '../src'

interface IResponse<T={}> {
  isLoading: boolean
  hasError: boolean
  data: T
}

function mockFetch(params: string, target: IResponse) {
  target.isLoading = true
  target.hasError = false
  target.data = null as any

  setTimeout(() => {
    target.isLoading = false
    target.hasError = false
    target.data = params
  }, 1000)
}

@observable
class Store {
  param = 'abc'

  user: IResponse = {
    isLoading: false,
    hasError: false,
    data: null as any
  }

  async response() {
    await mockFetch(this.param, this.user)
  }
}

class Action {
  @inject(Store) store!: Store

  changeParam = () => {
    this.store.param = 'xyz' + Math.random().toString()
  }
}

const stores = combineStores({ Store, Action })

@Connect
class App extends React.Component<typeof stores, any> {
  componentWillMount() {
    observe(() => {
      this!.props!.Store!.response()
    })
  }

  render() {
    if (this!.props!.Store!.user!.isLoading) {
      return (
        <span>loading..</span>
      )
    }

    return (
      <span
        onClick={this!.props!.Action!.changeParam}
      >数据是：{this!.props!.Store!.user!.data} 点击我重新发请求</span>
    )
  }
}

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>
  , document.getElementById('react-dom'))