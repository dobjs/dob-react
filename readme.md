# dynamic-react

<a href="https://travis-ci.org/ascoders/dynamic-react"><img src="https://img.shields.io/travis/ascoders/dynamic-react/master.svg?style=flat" alt="Build Status"></a>

React bindings for dynamic-object

Design idea from [Mobx Implementation](https://github.com/ascoders/blog/issues/16)

# Install

```bash
yarn add dynamic-react --save
```

# Simple Usage

```typescript
import { Provider, Connect } from 'dynamic-react'

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
yarn add dynamic-object dependency-inject --save
```

`store.ts`:

```typescript
import { inject, Container } from 'dependency-inject'
import { Action } from 'dynamic-object'

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
import { Provider, Connect } from 'dynamic-react'
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