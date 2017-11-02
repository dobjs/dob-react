# dob-react &middot; [![CircleCI Status](https://img.shields.io/travis/dobjs/dob-react/master.svg?style=flat)](https://travis-ci.org/dobjs/dob-react) [![npm version](https://img.shields.io/npm/v/dob-react.svg?style=flat)](https://www.npmjs.com/package/dob-react) [![code coverage](https://img.shields.io/codecov/c/github/dobjs/dob-react/master.svg)](https://codecov.io/github/dobjs/dob-react)

React bindings for dob

Design idea from [Mobx Implementation](https://github.com/ascoders/blog/issues/16)

## Install

```bash
npm i dob-react
```

### Online demo

Here is a basic [demo](https://jsfiddle.net/yp90Lep9/21/), and here is a [demo](https://jsfiddle.net/g19ehhgu/11/) with fractal.

## Simple Usage

```typescript
import { Provider, Connect } from 'dob-react'

@Connect
class App extends React.Component <any, any> {
    render() {
        return (
            <span>{this.props.store.name}</span>
        )
    }
}

ReactDOM.render(
    <Provider store={{ name: 'bob' }}>
        <App />
    </Provider>
, document.getElementById('react-dom'))
```

`Connect`: All parameters from outer Provider are injected into the wrapped components, and the component rerender when the variables used in the render function are modified(sync usage).

## `Connect` all functions

### Connect all

Connect all from Provider's parameters, also is this example above.

### Connect extra data

> Will also inject all parameters from outer Provider.

```typescript
@Connect({
    customStore: {
        name: 'lucy'
    }
})
class App extends React.Component <any, any> {}
```

### Map state to props

> Will also inject all parameters from outer Provider.

```typescript
@Connect(state => {
    return {
        customName: 'custom' + state.store.name
    }
})
class App extends React.Component <any, any> {}

ReactDOM.render(
    <Provider store={{ name: 'bob' }}> <App /> </Provider>
, document.getElementById('react-dom'))
```

### Support stateless component

```typescript
class App extends React.Component <any, any> {
    render() {
        return (
            <span>{this.props.store.name}</span>
        )
    }
}

const ConnectApp = Connect()(App)
// const ConnectApp = Connect({ ... })(App)
// const ConnectApp = Connect( state => { ... })(App)
```
