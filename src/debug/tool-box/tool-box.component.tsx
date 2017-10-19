import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { dobEvent, IDebugInfo } from 'dob'
import * as PropTypes from 'prop-types'

import { Props, State } from './tool-box.type'
import * as S from './tool-box.style'

import { Action } from './action/action.component'

export class ToolBox extends React.PureComponent<Props, State>{
  static defaultProps = new Props()
  public state = new State()

  static contextTypes = {
    dyDebug: PropTypes.object
  }

  static childContextTypes = {
    dyDebug: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      dyDebug: this.context.dyDebug
    }
  }

  public componentDidMount() {
    dobEvent.on('debug', debugInfo => {
      this.context.dyDebug.debugInfoMap.set(debugInfo.id, debugInfo)
      this.forceUpdate()
    })
  }

  public render() {
    return (
      <S.Container>
        {/* provider root */}
        <S.ChildrenContainer>
          {this.props.children}
        </S.ChildrenContainer>

        {this.renderToolBox()}
      </S.Container>
    )
  }

  private renderToolBox = () => {
    const debugInfos = Array
      .from((this.context.dyDebug.debugInfoMap as Map<number, IDebugInfo>).values())
      .sort((left, right) => right.id - left.id)

    const Actions = debugInfos.map((debugInfo, index) => {
      return (
        <Action
          searchValue={this.state.searchValue}
          key={debugInfo.id}
          action={debugInfo}
        />
      )
    })

    return (
      <S.ToolContainer>
        <S.HelperContainer>
          <S.HelperInput onChange={event => {
            this.setState({
              searchValue: event.currentTarget.value
            })
          }} placeholder="搜索 action.." />
          <S.HelperButton onClick={this.handleClear}>清空</S.HelperButton>
        </S.HelperContainer>

        <S.ToolScrollContainer>
          <S.ActionContainer>
            {Actions}
          </S.ActionContainer>
        </S.ToolScrollContainer>
      </S.ToolContainer>
    )
  }

  private handleClear = () => {
    this.context.dyDebug.debugInfoMap.clear()
    this.forceUpdate()
  }
}