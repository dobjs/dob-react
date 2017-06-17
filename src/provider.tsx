import * as React from 'react'
import { observable } from 'dynamic-object'

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

        return {
            dyStores: stores
        }
    }

    render() {
        return React.Children.only(this.props.children)
    }
}