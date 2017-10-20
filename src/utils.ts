import { globalState } from './global-state'
import { startDebug as dobStartDebug, stopDebug as dobStopDebug, useStrict } from 'dob'

export const handleReRender = 'DYNAMIC_REACT_HANDLE_RE_RENDER'

/**
 * 开启调试模式
 */
export function startDebug() {
  globalState.useDebug = true
  dobStartDebug()
}

/**
 * 终止调试模式
 */
export function stopDebug() {
  globalState.useDebug = false
  dobStopDebug()
}