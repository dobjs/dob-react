# Install

```bash
yarn add dynamic-react --save
```

# Usage

## Simple

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

## With dependency-inject

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