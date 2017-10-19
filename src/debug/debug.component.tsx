import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as PropTypes from 'prop-types'
import { IDebugInfo } from 'dob'

import * as S from './debug.style'
import { handleReRender } from '../utils'
import { Props, State } from './debug.type'

/**
 * 根据 render 次数渲染颜色
 */
function renderCount(count: number) {
  let level = 'normal'

  if (count < 5) {
    level = 'normal'
  }

  if (count >= 5 && count < 10) {
    level = 'frequently'
  }

  if (count >= 10 && count < 20) {
    level = 'warning'
  }

  if (count >= 20) {
    level = 'danger'
  }

  return <S.RenderCount theme={{ level }}>{count}</S.RenderCount>
}

export class DebugWrapper extends React.PureComponent<Props, State>{
  static defaultProps = new Props()
  static contextTypes = {
    dyDebug: PropTypes.object
  }

  static childContextTypes = {
    dyDebug: PropTypes.object.isRequired
  }

  public state = new State()

  private containerDOM: HTMLElement = null
  private restartAnimationTimeout: any = null
  private showCountTimeout: any = null

  private isMount = false

  /**
   * 鼠标是否在元素内
   */
  private isMouseEnter = false

  /**
   * 保留全部 debugIds
   */
  private allDebugIds = new Set<number>()

  public componentWillMount() {
    this.isMount = true

    this.context.dyDebug.event.on('focusDebug', this.handleFocusDebug)
    this.context.dyDebug.event.on('unFocusDebug', this.handleUnFocusDebug)
  }

  public componentWillUnmount() {
    this.isMount = false

    this.context.dyDebug.event.off('focusDebug', this.handleFocusDebug)
    this.context.dyDebug.event.off('unFocusDebug', this.handleUnFocusDebug)
  }

  public getChildContext() {
    return {
      dyDebug: this.context.dyDebug
    }
  }

  public render() {
    return (
      <S.Container
        ref={(ref: React.ReactInstance) => {
          if (!this.containerDOM) {
            this.containerDOM = ReactDOM.findDOMNode(ref) as HTMLElement
          }
        }}
        onMouseEnter={event => {
          this.isMouseEnter = true
        }}
        onMouseLeave={event => {
          this.isMouseEnter = false
        }}
      >
        {/* real component */}
        {React.cloneElement(this.props.children as React.ReactElement<any>, {
          [handleReRender]: this.onReRender
        })}

        {this.renderDebugContainer()}
      </S.Container>
    )
  }

  /**
   * real component rerendered by track, this method will be called
   */
  public onReRender = ({ debugId }) => {
    if (!this.isMount) {
      return
    }

    clearTimeout(this.restartAnimationTimeout)

    this.allDebugIds.add(debugId)

    this.setState(state => {
      const newDebugIds = state.debugIds.slice()
      newDebugIds.push(debugId)

      return {
        renderCount: state.renderCount + 1,
        showCount: true,
        debugIds: newDebugIds
      }
    })

    this.highlight()
  }

  /**
   * 立刻闪一下
   */
  private highlight = () => {
    this.containerDOM.classList.remove('use-animation')
    this.restartAnimationTimeout = setTimeout(() => {
      if (!this.isMount) {
        return
      }

      this.containerDOM.classList.add('use-animation')

      this.removeCountLater()
    })
  }

  /**
   * 立刻移除闪动
   */
  private removeHighlight = () => {
    this.containerDOM.classList.remove('use-animation')
    this.removeCountLater(0)
  }

  /**
   * 稍后移除 count
   */
  private removeCountLater = (timeout = 3000) => {
    clearTimeout(this.showCountTimeout)

    this.showCountTimeout = setTimeout(() => {
      // 如果鼠标还在元素上，再暂缓移除
      if (this.isMouseEnter) {
        this.removeCountLater(500)
        return
      }

      if (!this.isMount) {
        return
      }

      this.setState(state => {
        return {
          renderCount: 0,
          showCount: false,
          debugIds: []
        }
      })
    }, timeout)
  }

  private renderDebugContainer = () => {
    return (
      <S.DebugContainer>
        {this.state.showDetail ?
          this.renderDebugDetail() :
          this.renderDebugSimple()
        }
      </S.DebugContainer>
    )
  }

  private renderDebugSimple = () => {
    if (!this.state.showCount) {
      return null
    }

    return (
      <S.CountTag onMouseEnter={() => {
        this.setState({
          showDetail: true
        })
      }}>
        {renderCount(this.state.renderCount)}
      </S.CountTag>
    )
  }

  private renderDebugDetail = () => {
    return (
      <S.DetailContainer onMouseLeave={() => {
        this.setState({
          showDetail: false
        })
      }}>
        <S.CallContainer>
          dob rerender:&nbsp;
          <S.CallNumber>{renderCount(this.state.renderCount)}</S.CallNumber>
        </S.CallContainer>

        <S.ActionScroll>
          <S.ActionList>
            {this.renderActionList()}
          </S.ActionList>
        </S.ActionScroll>
      </S.DetailContainer>
    )
  }

  private renderActionList = () => {
    const debugInfo = this.context.dyDebug.debugInfoMap as Map<number, IDebugInfo>

    return this.state.debugIds
      .filter(debugId => debugId !== undefined && debugId !== null)
      .filter(debugId => debugInfo.has(debugId))
      .sort((left, right) => right - left)
      .map((debugId, index) => {
        return (
          <S.ActionContainer
            onClick={() => {
              this.context.dyDebug.event.emit('toggleActionDetail', debugId)
            }}
            key={index}
            onMouseEnter={() => {
              this.context.dyDebug.event.emit('focusActionDetail', debugId)
            }}
            onMouseLeave={() => {
              this.context.dyDebug.event.emit('unFocusActionDetail', debugId)
            }}
          >
            {debugInfo.get(debugId).name}
          </S.ActionContainer>
        )
      })
  }

  private handleFocusDebug = (debugId: number) => {
    if (!this.allDebugIds.has(debugId)) {
      return
    }

    this.highlight()
  }

  private handleUnFocusDebug = (debugId: number) => {
    if (!this.allDebugIds.has(debugId)) {
      return
    }

    this.removeHighlight()
  }
}