import { IDebugInfo } from 'dob'

export class Props {
  action?: IDebugInfo
  deep?: number = 0
  renderKey?: string = '0'
  searchValue?: string = ''
}

export class State {
  /**
   * 是否显示详情
   */
  showDetail?: boolean = false
  /**
   * 是否高亮当前行
   */
  isHighlight?: boolean = false
}