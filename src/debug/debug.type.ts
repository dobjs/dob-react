export class Props { }

export class State {
  /**
   * 当前渲染次数
   */
  renderCount = 0
  /**
   * 是否显示渲染次数
   */
  showCount = false
  /**
   * 是否展示详情
   */
  showDetail = false
  /**
   * debug id 数组
   */
  debugIds: number[] = []
}