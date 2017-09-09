import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Reaction } from 'dob'
import shallowEqual from 'shallow-eq'
import { Container } from 'dependency-inject'

/**
 * 组件是否已销毁
 */
const isUmount = Symbol()

/**
 * observer 对象存放的 key
 */
const reactionKey = Symbol()

/**
 * render 次数
 */
const renderCountKey = Symbol()

interface ReactiveMixin {
    [lifecycleName: string]: any
}

/**
 * dev tool support
 */
let isDevtoolsEnabled = false

/**
 * 开发工具使用，报告渲染
 */
function reportRendering() {
    console.log('render')
}

/**
 * baseRender 初始化未渲染状态
 * 之所以不用 null 判断是否有渲染，因为 render 函数本身就可以返回 null，所以只好用 symbol 准确判断是否执行了 render
 */
const emptyBaseRender = Symbol()

/**
 * 将生命周期聚合到 react 中
 */
function patch(target: any, funcName: string, runMixinFirst = false) {
    // 原始生命周期函数
    const base = target[funcName]
    // 待聚合的生命周期函数
    const mixinFunc = reactiveMixin[funcName]
    if (!base) {
        // 如果没有原始生命周期函数，直接覆盖即可
        target[funcName] = mixinFunc
    } else {
        // 将两个函数串起来执行
        target[funcName] = runMixinFirst === true ? function (...args: any[]) {
            mixinFunc.apply(this, args)
            base.apply(this, args)
        } : function (...args: any[]) {
            base.apply(this, args)
            mixinFunc.apply(this, args)
        }
    }
}

/**
 * 双向绑定的 Mixin
 */
const reactiveMixin: ReactiveMixin = {
    componentWillMount: function () {
        // 当前组件名
        const initialName = this.displayName || this.name || this.constructor &&
            (this.constructor.displayName || this.constructor.name) ||
            "<component>"

        // 当前节点 id
        const rootNodeID = this._reactInternalInstance &&
            this._reactInternalInstance._rootNodeID;

        // 是否在渲染期间
        let isRenderingPending = false

        // 原始 render
        const baseRender = this.render.bind(this)

        let renderResult: any = emptyBaseRender

        // 核心 reaction
        let reaction: Reaction

        // 初始化 render
        const initialRender = () => {
            reaction = new Reaction(`${initialName}.render`, () => {
                if (isRenderingPending) {
                    return
                }
                isRenderingPending = true

                // 执行经典的 componentWillReact
                typeof this.componentWillReact === 'function' && this[renderCountKey] && this.componentWillReact()

                // 如果组件没有被销毁，尝试调用 forceUpdate
                // 而且第一次渲染不会调用 forceUpdate
                if (!this[isUmount] && this[renderCountKey]) {
                    try {
                        React.Component.prototype.forceUpdate.call(this)
                    } catch (error) {
                        // forceUpdate 出错就抛出来
                        throw Error(error)
                    } finally {
                        // forceUpdate 结束了
                    }
                }

                isRenderingPending = false
            })

            this[reactionKey] = reaction

            // 之后都用 reactiveRender 作 render
            this.render = reactiveRender

            return reactiveRender()
        }

        const reactiveRender = () => {
            reaction.track(() => {
                renderResult = baseRender()
            })

            this[renderCountKey] ? this[renderCountKey]++ : this[renderCountKey] = 1

            // 如果 observe 跑过了 renderResult，就不要再执行一遍 baseRender，防止重复调用 render
            if (renderResult !== emptyBaseRender) {
                const tempResult = renderResult

                // 防止 setState 这种没有通过 observe 触发的情况，不应该直接用结果，
                // 所以要每次清空，如果不是 observe，而是 setState 触发 render，就执行 baseRender
                renderResult = emptyBaseRender

                return tempResult
            }

            return baseRender()
        };

        // 默认用初始化 render
        this.render = initialRender
    },
    componentWillUnmount: function () {
        // 取消 observe 监听
        this[reactionKey] && this[reactionKey].dispose()

        this[isUmount] = true
    },
    componentDidMount: function () {
        if (isDevtoolsEnabled) {
            reportRendering()
        }
    },
    componentDidUpdate: function () {
        if (isDevtoolsEnabled) {
            reportRendering()
        }
    },
    shouldComponentUpdate: function (nextProps: any, nextState: any) {
        // 任何 state 修改都会重新 render
        if (!shallowEqual(this.state, nextState)) {
            return true
        }

        return !shallowEqual(this.props, nextProps)
    }
}

/**
 * 聚合生命周期
 */
function mixinLifecycleEvents(target: any) {
    patch(target, 'componentWillMount', true)
    patch(target, 'componentDidMount')
    patch(target, 'componentWillUnmount')
    patch(target, 'componentDidUpdate')

    if (!target.shouldComponentUpdate) {
        // 只有原对象没有 shouldComponentUpdate 的时候，才使用 mixins
        target.shouldComponentUpdate = reactiveMixin.shouldComponentUpdate
    }
}

function mixinAndInject(componentClass: any, extraInjection: Object | Function = {}): any {
    if (!isReactFunction(componentClass)) {
        // stateless react function
        return mixinAndInject(
            React.createClass({
                displayName: componentClass.displayName || componentClass.name,
                propTypes: componentClass.propTypes,
                contextTypes: componentClass.contextTypes,
                getDefaultProps: function () {
                    return componentClass.defaultProps;
                },
                render: function () {
                    return componentClass.call(this, this.props, this.context);
                }
            }),
            extraInjection
        )
    }

    const target = componentClass.prototype || componentClass
    mixinLifecycleEvents(target)

    return class InjectWrapper extends React.Component<any, any>{
        // 取 context
        static contextTypes = {
            dyStores: React.PropTypes.object
        }

        render() {
            if (typeof extraInjection === 'object') {
                return React.createElement(componentClass, {
                    ...this.context.dyStores,
                    ...this.props,
                    ...extraInjection
                })
            } else if (typeof extraInjection === 'function') {
                return React.createElement(componentClass, {
                    ...this.context.dyStores,
                    ...this.props,
                    ...extraInjection(this.context.dyStores)
                })
            }
        }
    }
}

function isReactFunction(obj: any) {
    if (typeof obj === 'function') {
        if (
            (obj.prototype && obj.prototype.render) ||
            obj.isReactClass ||
            React.Component.isPrototypeOf(obj)
        ) {
            return true
        }
    }

    return false
}

/**
 * Observer function / decorator
 */
export default function Connect(target: any, propertyKey?: string, descriptor?: PropertyDescriptor): any
export default function Connect(injectExtension: any): any
export default function Connect<T={}>(mapStateToProps?: (state?: T) => any): any
export default function Connect(target: any): any {
    // @Connect
    if (isReactFunction(target)) {
        return mixinAndInject(target)
    }

    // @Connect(object)
    if (typeof target === 'object') {
        return (realComponentClass: any) => {
            return mixinAndInject(realComponentClass, target)
        }
    }

    // @Connect(function)
    if (typeof target === 'function') {
        return (realComponentClass: any) => {
            return mixinAndInject(realComponentClass, target)
        }
    }

    // Connect()(App)
    if (!target) {
        return (realComponentClass: any) => {
            return mixinAndInject(realComponentClass)
        }
    }
}
