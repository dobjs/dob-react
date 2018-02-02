import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { combineStores, observable, inject, observe } from 'dob'
import { Connect } from '../src'

// @observable
// class Store {
//   name = 123
// }

// class Action {
//   @inject(Store) store: Store

//   changeName = () => {
//     this.store.name = 456
//   }
// }

// const stores = combineStores({ Store, Action })

// @Connect(stores)
// class App extends React.Component<typeof stores, any> {
//   render() {
//     return (
//       <div onClick={this.props.Action!.changeName}>{this.props.Store!.name}</div>
//     )
//   }
// }

// ReactDOM.render(
//   <App />
//   , document.getElementById('react-dom'))


@observable
class Store {
  name = 123
}

class Action {
  @inject(Store) store: Store
  changeName = () => {
    this.store.name += 1
  }
}

const stores = combineStores({ Store, Action })


@Connect(stores)
class AA extends React.Component<any, any> {
  private signal: any
  componentWillMount() {
    this.signal = observe(() => {
      console.log(1);
    })
  }

  componentWillUnmount() {
    this.signal.unobserve()
  }

  render() {
    return <div onClick={this.props.Action.changeName}>{this.props.Store.name}</div>
  }
}

ReactDOM.render(
  <AA />
  , document.getElementById('react-dom'))