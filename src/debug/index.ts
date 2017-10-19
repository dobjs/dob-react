import { globalState } from '../global-state'
export { DebugWrapper } from './debug.component'
export { ToolBox } from './tool-box/tool-box.component'
import { startDebug as dobStartDebug, stopDebug as dobStopDebug, useStrict } from 'dob'

/**
 * 开启调试模式
 */
export function startDebug() {
  globalState.useDebug = true
  useStrict()
  dobStartDebug()
}

/**
 * 终止调试模式
 */
export function stopDebug() {
  globalState.useDebug = false
  dobStopDebug()
}