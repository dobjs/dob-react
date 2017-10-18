import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as S from './debug.style'
import { handleReRender } from '../utils'
import { Props, State } from './debug.type'

export class DebugWrapper extends React.PureComponent<Props, State>{
  static defaultProps = new Props()
  public state = new State()

  private containerDOM: HTMLElement = null
  private restartAnimationTimeout: any = null
  private showCountTimeout: any = null

  private isMount = false

  public componentWillMount() {
    this.isMount = true
  }

  public componentWillUnmount() {
    this.isMount = false
  }

  public render() {
    return (
      <S.Container ref={(ref: React.ReactInstance) => {
        if (!this.containerDOM) {
          this.containerDOM = ReactDOM.findDOMNode(ref) as HTMLElement
        }
      }}>
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
  public onReRender = () => {
    if (!this.isMount) {
      return
    }

    clearTimeout(this.restartAnimationTimeout)
    clearTimeout(this.showCountTimeout)

    this.setState(state => {
      return {
        renderCount: state.renderCount + 1,
        showCount: true
      }
    })

    this.containerDOM.classList.remove('use-animation')
    this.restartAnimationTimeout = setTimeout(() => {
      if (!this.isMount) {
        return
      }

      this.containerDOM.classList.add('use-animation')

      this.showCountTimeout = setTimeout(() => {
        if (!this.isMount) {
          return
        }

        this.setState(state => {
          return {
            renderCount: 0,
            showCount: false
          }
        })
      }, 3000)
    })
  }

  private renderDebugContainer = () => {
    return (
      <S.DebugContainer>
        {this.state.showCount &&
          <S.CountTag>
            {this.state.renderCount}
          </S.CountTag>
        }
      </S.DebugContainer>
    )
  }
}