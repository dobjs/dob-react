import * as React from 'react'

const specialReactKeys = new Set(['children', 'key', 'ref'])

interface Props {
    [store: string]: object
}

export default class Provider extends React.Component<Props, any> {

    static contextTypes = {
        dyStores: React.PropTypes.object
    }

    static childContextTypes = {
        dyStores: React.PropTypes.object.isRequired
    }

    getChildContext() {
        // 继承 store
        const stores = Object.assign({}, this.context.dyStores)

        // 添加用户传入的 store
        for (let key in this.props) {
            if (!specialReactKeys.has(key)) {
                stores[key] = this.props[key]
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