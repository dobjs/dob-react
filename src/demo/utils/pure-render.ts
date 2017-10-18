import * as React from 'react'
import { IStores } from '../stores'

export class PureComponent<T, P> extends React.PureComponent<IStores & T, P> {

}