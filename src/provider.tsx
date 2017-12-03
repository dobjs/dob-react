import * as React from 'react'
import { globalState } from './global-state'
import { IDebugInfo, Event } from 'dob'

const PropTypes = require('prop-types')

const specialReactKeys = new Set(['children', 'key', 'ref'])

interface Props {
    [store: string]: object | undefined
}

export default class Provider extends React.Component<Props, any> {

    static contextTypes = {
        dyStores: PropTypes.object,
        dyDebug: PropTypes.object,
    }

    static childContextTypes = {
        dyStores: PropTypes.object.isRequired,
        dyDebug: PropTypes.object
    }

    getChildContext() {
        // 继承 store
        const dyStores = Object.assign({}, this.context.dyStores)

        // 添加用户传入的 store
        for (let key in this.props) {
            if (!specialReactKeys.has(key)) {
                dyStores[key] = this.props[key]
            }
        }

        if (globalState.useDebug) {
            return {
                dyStores: dyStores,
                dyDebug: {
                    /**
                     * 存储当前 dob 所有 action 触发的 debug 信息
                     */
                    debugInfoMap: new Map<number, IDebugInfo>(),
                    /**
                     * 事件系统，用于 debug ui 之间通信
                     */
                    event: new Event()
                }
            }
        }

        return {
            dyStores: dyStores
        }
    }

    render() {
        globalState.providerCounter++

        if (globalState.useDebug && globalState.providerCounter === 1) {
            const ToolBox = globalState.DebugToolBox as any
            // 即使在 debug 模式下，ToolBox 也只会实例化一个
            return (
                <ToolBox>
                    {this.props.children}
                </ToolBox>
            )
        }

        return this.props.children as React.ReactElement<any>
    }
}