# dob-react &middot; [![CircleCI Status](https://img.shields.io/travis/ascoders/dob-react/master.svg?style=flat)](https://travis-ci.org/ascoders/dob-react) [![npm version](https://img.shields.io/npm/v/dob-react.svg?style=flat)](https://www.npmjs.com/package/dob-react) [![code coverage](https://img.shields.io/codecov/c/github/ascoders/dob-react/master.svg)](https://codecov.io/github/ascoders/dob-react)

React bindings for dob

Design idea from [Mobx Implementation](https://github.com/ascoders/blog/issues/16)

# Install

```bash
yarn add dob-react --save
```

# Simple Usage

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

# Connect

Connect all in provider:

```typescript
@Connect
class App extends React.Component <any, any> {
    render() {
        return (
            <span>{this.props.store.name}</span>
        )
    }
}

ReactDOM.render(
    <Provider store={{ name: 'bob' }}> <App /> </Provider>
, document.getElementById('react-dom'))
```

Connect extra data:

```typescript
@Connect({
    customStore: {
        name: 'lucy'
    }
})
class App extends React.Component <any, any> {
    render() {
        return (
            <span>{this.props.store.name}</span>
            <span>{this.props.customStore.name}</span>
        )
    }
}

ReactDOM.render(
    <Provider store={{ name: 'bob' }}> <App /> </Provider>
, document.getElementById('react-dom'))
```

Map state to props:

```typescript
@Connect(state => {
    return {
        customName: 'custom' + state.store.name'
    }
})
class App extends React.Component <any, any> {
    render() {
        return (
            <span>{this.props.store.name}</span>
            <span>{this.props.store.customName}</span>
        )
    }
}

ReactDOM.render(
    <Provider store={{ name: 'bob' }}> <App /> </Provider>
, document.getElementById('react-dom'))
```

Functional call:

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

ReactDOM.render(
    <Provider store={{ name: 'bob' }}> <App /> </Provider>
, document.getElementById('react-dom'))
```

Support stateless function:

```typescript
function App(props) {
    return (
        <span>{props.store.name}</span>
    )
}

const ConnectApp = Connect()(App)

ReactDOM.render(
    <Provider store={{ name: 'bob' }}> <App /> </Provider>
, document.getElementById('react-dom'))
```