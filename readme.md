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

# Use with dependency-inject

```bash
yarn add dob dependency-inject --save
```

`store.ts`:

```typescript
import { inject, Container } from 'dependency-inject'
import { Action } from 'dob'

export class Store {
    name = 'bob'
}

export class Action {
    @inject(Store) store: Store

    @Action setName (name: string) {
        this.store.name = name
    }
}

const container = new Container()
container.set(Store, new Store())
container.set(Action, new Action())

export { container }
```

`app.ts`

```typescript
import { Provider, Connect } from 'dob-react'
import { Store, Action, container } from './store'

@Connect
class App extends React.Component <any, any> {
    componentWillMount () {
        this.props.action.setName('nick')
    }

    render() {
        return (
            <span>{this.props.name}</span>
        )
    }
}

ReactDOM.render(
    <Provider store={container.get(Store)} action={container.get(Action)}>
        <App />
    </Provider>
, document.getElementById('react-dom'))
```