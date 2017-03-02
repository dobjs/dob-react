import * as React from 'react'
import {observable} from 'dynamic-object'

const specialReactKeys = new Set(['children', 'key', 'ref'])

interface Props {
    [store: string]: object
}

export default class Provider extends React.Component<Props , any> {

    static contextTypes = {
        dyStores: React.PropTypes.object
    }

    static childContextTypes = {
        dyStores: React.PropTypes.object.isRequired
    }

    getChildContext() {
        // 继承 store
        const stores = Object.assign({}, this.context.mobxStores)

        // 添加用户传入的 store
        for (let key in this.props) {
            if (!specialReactKeys.has(key)) {
                const store: any = this.props[key]

                stores[key] = observable(store)
                // 将所有 function 的 this 指向 proxy
                for (let storeKey in store) {
                    if (typeof store[storeKey] === 'function') {
                        store[storeKey] = store[storeKey].bind(stores[key])
                    }
                }
            }
        }

        return {
            dyStores: stores
        }
    }

    render() {
        return React.Children.only(this.props.children)
    }
}