import test from 'ava'
import * as React from 'react'
import { create } from 'react-test-renderer'
import { inject, Container, injectFactory } from 'dependency-inject'
import { Provider, Connect } from '../index'
import { observable } from 'dob'

test('no args with no error and run once', t => {
    let runCount = 0

    @Connect
    class App extends React.Component<any, any> {
        render() {
            runCount++
            return (
                <span />
            )
        }
    }

    create(
        <Provider>
            <App />
        </Provider>
    )

    return new Promise(resolve => setInterval(resolve))
        .then(() => t.true(runCount === 1))
})

test('test connect inject', t => {
    let runCount = 0

    @Connect
    class App extends React.Component<any, any> {
        render() {
            runCount++
            t.true(this.props.store.name === 'bob')
            return (
                <span />
            )
        }
    }

    create(
        <Provider store={{ name: 'bob' }}>
            <App />
        </Provider>
    )

    return new Promise(resolve => setInterval(resolve))
        .then(() => t.true(runCount === 1))
})

test('test action and store but not use!', t => {
    let runCount = 0

    @observable
    class Store {
        name = 'bob'
    }

    class Action {
        @inject(Store) store: Store

        setName(name: string) {
            this.store.name = name
        }
    }

    const container = new Container()
    container.set(Store, new Store())
    container.set(Action, new Action())

    @Connect
    class App extends React.Component<any, any> {
        componentWillMount() {
            this.props.action.setName('nick')
        }

        render() {
            runCount++

            return (
                <span />
            )
        }
    }

    create(
        <Provider store={container.get(Store)} action={container.get(Action)}>
            <App />
        </Provider>
    )

    return new Promise(resolve => setImmediate(resolve))
        .then(() => t.true(runCount === 1))
})

test('test action and store but use out render!', t => {
    let runCount = 0
    let shouldNotChange = 'shouldNotChange'

    @observable
    class Store {
        name = 'bob'
    }

    class Action {
        @inject(Store) store: Store

        setName(name: string) {
            this.store.name = name
        }
    }

    const container = new Container()
    container.set(Store, new Store())
    container.set(Action, new Action())

    @Connect
    class App extends React.Component<any, any> {
        componentWillMount() {
            t.true(this.props.store.name === 'bob') // use it, but not observered
        }

        componentWillReact() {
            shouldNotChange = 'changed'
            t.true(this.props.store.name === 'nick') // can't run
        }

        render() {
            runCount++

            return (
                <span />
            )
        }
    }

    create(
        <Provider store={container.get(Store)} action={container.get(Action)}>
            <App />
        </Provider>
    )

    return new Promise(resolve => setTimeout(resolve, 200))
        .then(() => t.true(runCount === 1))
        .then(() => t.true(shouldNotChange === 'shouldNotChange'))
})

test('test action and store but use in render!', t => {
    let runCount = 0

    @observable
    class Store {
        name = 'bob'
    }

    class Action {
        @inject(Store) store: Store

        setName(name: string) {
            this.store.name = name
        }
    }

    const container = new Container()
    container.set(Store, new Store())
    container.set(Action, new Action())

    @Connect
    class App extends React.Component<any, any> {
        componentWillMount() {
            t.true(this.props.store.name === 'bob')
            setTimeout(() => {
                this.props.action.setName('nick')
            }, 10)
        }

        componentWillReact() {
            t.true(this.props.store.name === 'nick') // so it can run
        }

        render() {
            // use it!
            this.props.store.name

            runCount++

            return (
                <span />
            )
        }
    }

    create(
        <Provider store={container.get(Store)} action={container.get(Action)}>
            <App />
        </Provider>
    )

    return new Promise(resolve => setTimeout(resolve, 200))
        .then(() => t.true(runCount === 2)) // 2
})

test('innert store connect', t => {
    let runCount = 0

    @observable
    class Store {
        name = 'bob'
    }

    class Action {
        @inject(Store) store: Store

        setName(name: string) {
            this.store.name = name
        }
    }

    const stores = injectFactory({ Store, Action })

    @Connect({
        store: stores.Store,
        action: stores.Action
    })
    class App extends React.Component<any, any> {
        componentWillMount() {
            t.true(this.props.store.name === 'bob')
            setTimeout(() => {
                this.props.action.setName('nick')
            }, 10)
        }

        componentWillReact() {
            t.true(this.props.store.name === 'nick') // so it can run
        }

        render() {
            // use it!
            this.props.store.name

            runCount++

            return (
                <span />
            )
        }
    }

    create(
        <App />
    )

    return new Promise(resolve => setTimeout(resolve, 200))
        .then(() => t.true(runCount === 2)) // 2
})

test('innert store connect and global provider', t => {
    let runCount = 0

    @observable
    class Store {
        name = 'bob'
    }

    class Action {
        @inject(Store) store: Store

        setName(name: string) {
            this.store.name = name
        }
    }

    @observable
    class GlobalStore {
        age = 1
    }

    class GlobalAction {
        @inject(GlobalStore) store: GlobalStore

        setAge(age: number) {
            this.store.age = age
        }
    }

    const stores = injectFactory({ Store, Action, GlobalStore, GlobalAction })

    @Connect({
        store: stores.Store,
        action: stores.Action
    })
    class App extends React.Component<any, any> {
        componentWillMount() {
            t.true(this.props.store.name === 'bob')
            t.true(this.props.globalStore.age === 1)
            setTimeout(() => {
                this.props.action.setName('nick')
            }, 10)
            setTimeout(() => {
                this.props.globalAction.setAge(2)
            }, 20)
        }

        componentWillReact() {
            t.true(this.props.store.name === 'nick') // so it can run
        }

        render() {
            // use it!
            this.props.store.name
            this.props.globalStore.age

            runCount++

            return (
                <span />
            )
        }
    }

    create(
        <Provider globalStore={stores.GlobalStore} globalAction={stores.GlobalAction}>
            <App />
        </Provider>
    )

    return new Promise(resolve => setTimeout(resolve, 200))
        .then(() => t.true(runCount === 3)) // 2
})

test('functional react component connect', t => {
    let runCount = 0

    @observable
    class Store {
        name = 'bob'
    }

    class Action {
        @inject(Store) store: Store

        setName(name: string) {
            this.store.name = name
        }
    }

    const stores = injectFactory({ Store, Action })

    function App() {
        t.true(this.props.Store.name === 'bob')

        runCount++

        return (
            <span />
        )
    }

    const ConnectApp = Connect()(App)

    create(
        <Provider {...stores}>
            <ConnectApp />
        </Provider>
    )

    return Promise.resolve()
        .then(() => t.true(runCount === 1))
})

test('functional call classable react component connect', t => {
    let runCount = 0

    @observable
    class Store {
        name = 'bob'
    }

    class Action {
        @inject(Store) store: Store

        setName(name: string) {
            this.store.name = name
        }
    }

    const stores = injectFactory({ Store, Action })

    class App extends React.Component<any, any>{
        render() {
            t.true(this.props.Store.name === 'bob')

            runCount++

            return (
                <span />
            )
        }
    }

    const ConnectApp = Connect()(App)

    create(
        <Provider {...stores}>
            <ConnectApp />
        </Provider>
    )

    return Promise.resolve()
        .then(() => t.true(runCount === 1))
})

test('functional react component inner connect', t => {
    let runCount = 0

    @observable
    class Store {
        name = 'bob'
    }

    class Action {
        @inject(Store) store: Store

        setName(name: string) {
            this.store.name = name
        }
    }

    const stores = injectFactory({ Store, Action })

    function App() {
        t.true(this.props.Store.name === 'bob')

        runCount++

        return (
            <span />
        )
    }

    const ConnectApp = Connect(stores)(App)

    create(
        <ConnectApp />
    )

    return Promise.resolve()
        .then(() => t.true(runCount === 1))
})

test('functional store connect', t => {
    let runCount = 0

    @observable
    class Store {
        user = {
            name: 'lucy'
        }
    }

    class Action {
        @inject(Store) store: Store
    }

    const stores = injectFactory({ Store, Action })

    @Connect<typeof stores>(state => {
        return {
            user: state.Store.user
        }
    })
    class App extends React.Component<any, any> {
        render() {
            t.true(this.props.user.name === 'lucy')
            runCount++

            return (
                <span />
            )
        }
    }

    create(
        <Provider {...stores}>
            <App />
        </Provider>
    )

    return Promise.resolve()
        .then(() => t.true(runCount === 1)) // 2
})