import * as React from 'react'
import { observe, Observer } from 'dynamic-object'
import shallowEqual from 'shallow-eq'

export default (decoratedComponent: any): any => {
    return class WrapComponent extends React.Component<any, any> {
        // 取 context
        static contextTypes = {
            dyStores: React.PropTypes.object
        }

        private signal: Observer

        public warppedComponent: React.ReactInstance

        shouldComponentUpdate(nextProps: any) {
            if (!shallowEqual(this.props, nextProps)) {
                return true
            }

            return false
        }

        componentWillMount() {
            this.setNextState()

            this.signal = observe(() => {
                // 初始化执行会因为之前执行过，props相同而被抛弃
                this.setNextState()
            })
        }

        componentWillUnmount() {
            this.signal.unobserve()
        }

        setNextState() {
            this.forceUpdate()
        }

        render() {
            return React.createElement(decoratedComponent, {
                ...this.context.dyStores,
                ...this.props,
                ref: (component) => {
                    this.warppedComponent = component
                }
            })
        }
    }
}