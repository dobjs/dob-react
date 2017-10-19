import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { IDebugInfo } from 'dob'
import * as PropTypes from 'prop-types'

import { Props, State } from './action.type'
import * as S from './action.style'

import Highlight from './highlight'

const reg = (input: string) => {
  return new RegExp(input, 'g');
};

export class Action extends React.PureComponent<Props, State>{
  static defaultProps = new Props()

  static contextTypes = {
    dyDebug: PropTypes.object
  }

  static childContextTypes = {
    dyDebug: PropTypes.object
  }

  public state = new State()

  public getChildContext() {
    return {
      dyDebug: this.context.dyDebug
    }
  }

  public componentDidMount() {
    this.context.dyDebug.event.on('toggleActionDetail', this.handleToggleActionDetail)
    this.context.dyDebug.event.on('focusActionDetail', this.handleFocusActionDetail)
    this.context.dyDebug.event.on('unFocusActionDetail', this.handleUnFocusActionDetail)
  }

  public componentWillUnmount() {
    this.context.dyDebug.event.off('toggleActionDetail', this.handleToggleActionDetail)
    this.context.dyDebug.event.off('focusActionDetail', this.handleFocusActionDetail)
    this.context.dyDebug.event.off('unFocusActionDetail', this.handleUnFocusActionDetail)
  }

  public render() {
    if (this.props.deep === 0 && this.props.searchValue !== "" && !reg(this.props.searchValue).test(this.props.action.name)) {
      return null
    }

    return (
      <S.Container theme={{ deep: this.props.deep }}>
        <S.Title
          theme={{ highlight: this.state.isHighlight }}
          onClick={this.toggleDetail}
          onMouseEnter={() => {
            this.context.dyDebug.event.emit('focusDebug', this.props.action.id)
          }}
          onMouseLeave={() => {
            this.context.dyDebug.event.emit('unFocusDebug', this.props.action.id)
          }}
        >
          {this.props.deep === 0 ?
            <Highlight label={this.props.action.name} search={this.props.searchValue} /> :
            this.props.action.name
          }
        </S.Title>

        {this.state.showDetail &&
          this.renderDetails(this.props.action, this.props.deep, this.props.renderKey)
        }
      </S.Container>
    )
  }

  private handleToggleActionDetail = (debugId: number) => {
    if (debugId !== this.props.action.id) {
      return
    }

    this.toggleDetail()
  }

  private handleFocusActionDetail = (debugId: number) => {
    if (debugId !== this.props.action.id) {
      return
    }

    this.setState({
      isHighlight: true
    })
  }

  private handleUnFocusActionDetail = (debugId: number) => {
    if (debugId !== this.props.action.id) {
      return
    }

    this.setState({
      isHighlight: false
    })
  }

  private toggleDetail = () => {
    this.setState(state => {
      return {
        showDetail: !this.state.showDetail
      }
    })
  }

  /**
   * 渲染详情
   */
  private renderDetails = (action: IDebugInfo, deep: number, key: string) => {
    return action.changeList.map((change, index) => {
      const newKey = key + '.' + index

      switch (change.type) {
        case 'change':
          const newValue = JSON.stringify(change.value, null, 2)
          const oldValue = JSON.stringify(change.oldValue, null, 2)

          return (
            <S.ChangeContainer key={newKey}>
              <S.ChangeBox>
                <S.ChangeDetailContainer>
                  <S.ChangeTypeNewValue>
                    {newValue}
                  </S.ChangeTypeNewValue>

                  <S.ChangeTypeOldValue title={oldValue}>
                    {oldValue}
                  </S.ChangeTypeOldValue>
                </S.ChangeDetailContainer>
              </S.ChangeBox>
              <S.CallStack>
                <S.CallStackPrefixKey>{change.callStack.join('.')}.</S.CallStackPrefixKey>
                <S.CallStackModifyKey>{change.key}</S.CallStackModifyKey>
              </S.CallStack>
            </S.ChangeContainer>
          )
        case 'delete':
          return (
            <S.ChangeContainer key={newKey}>
              <S.CallStackDeleted>
                <S.CallStackPrefixKey>{change.callStack.join('.')}.</S.CallStackPrefixKey>
                <S.CallStackModifyKey>{change.key}</S.CallStackModifyKey>
              </S.CallStackDeleted>
            </S.ChangeContainer>
          )
        case 'action':
          const renderKey = change.action.id + '.' + index
          return (
            <Action
              searchValue={this.props.searchValue}
              action={change.action}
              deep={deep + 1}
              key={renderKey}
              renderKey={renderKey}
            />
          )
        default:
          return null
      }
    })
  }
}