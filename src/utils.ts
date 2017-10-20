import { globalState } from './global-state'
import { startDebug as dobStartDebug, stopDebug as dobStopDebug, useStrict } from 'dob'

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