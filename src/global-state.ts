import * as React from 'react'

const tag = "ascoders-dob-react"

class GlobalState {
  /**
   * 是否开启 debug
   */
  public useDebug = false
  /**
   * provider 计数器，如果页面拥有多个 provider，聚合在一起显示
   */
  public providerCounter = 0
  /**
   * debug 工具栏
   */
  public DebugToolBox: React.ComponentClass = null
  /**
   * debug 每个组件的 wrapper，通过实现这两个组件，完成与 dob-react 的调试模式对接
   */
  public DebugWrapper: React.ComponentClass = null
  /**
   * 当每个组件因为 dob 触发 rerender 时，会触发每个 DebugWrapper 此方法，且传入 debugId
   */
  public handleReRender = 'DYNAMIC_REACT_HANDLE_RE_RENDER'
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