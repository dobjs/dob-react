import * as React from 'react'
import { observe, Observer } from 'dynamic-object'
import shallowEqual from 'shallow-eq'

export default (decoratedComponent: any): any => {
    return class WrapComponent extends React.Component<any, any> {
        // observe 执行的次数
        private observeRunCount = 0

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
            this.signal = observe(() => {
                this.observeRunCount++
                this.setNextState()
            })
        }

        /**
         * 取消监听
         */
        componentWillUnmount() {
            this.signal.unobserve()
        }

        setNextState() {
            // 第一次是初始化，不刷新
            if (this.observeRunCount > 1) {
                this.forceUpdate()
            }
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