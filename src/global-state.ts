import * as React from 'react'

const tag = "ascoders-dob-react"

class GlobalState {
  /**
   * 是否开启 debug
   */
  public useDebug = false
}

let globalState = new GlobalState()

const globalOrWindow = (typeof self === "object" && self.self === self && self) ||
  (typeof global === "object" && global.global === global && global) ||
  this

if (globalOrWindow[tag]) {
  globalState = globalOrWindow[tag]
} else {
  globalOrWindow[tag] = globalState
}

export { globalState }