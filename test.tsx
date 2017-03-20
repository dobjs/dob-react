import test from 'ava'
import * as React from 'react'
import { create } from 'react-test-renderer'
import { inject, Container } from 'dependency-inject'
import { Provider, Connect } from './index'

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
        componetWillMount() {
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

    return new Promise(resolve => setInterval(resolve))
        .then(() => t.true(runCount === 1))
})

test('test action and store but use!', t => {
    let runCount = 0

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
        componetWillMount() {
            t.true(this.props.store.name === 'bob') // use it
            this.props.action.setName('nick')
        }

        componentWillReceiveProps(nextProps: any) {
            t.true(nextProps.store.name === 'nick') // so it can run
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

    return new Promise(resolve => setInterval(resolve))
        .then(() => t.true(runCount === 2)) // 2
})