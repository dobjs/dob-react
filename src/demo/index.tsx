import * as React from "react"
import * as ReactDOM from "react-dom"
import { inject, injectFactory } from 'dependency-inject'
import { Action, observable } from 'dob'
import { Connect, Provider, startDebug } from '../'

import Layout from './layout/layout.component'

import { stores } from './stores'

startDebug()

ReactDOM.render(
    <Provider {...stores}>
        <Layout />
    </Provider>
    , document.getElementById("react-dom"))
