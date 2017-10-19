import styled, { keyframes } from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  ${props => props.theme && props.theme.deep === 0 && `
    // padding-bottom: 5px;
  `}
  ${props => props.theme && props.theme.deep > 0 && `
    margin-left: 12px;
    padding-left: 5px;
    border-left: 1px solid #5d5d5d;
  `}
`

export const Title = styled.div`
  padding: 10px;
  text-shadow: 1px 1px #aaa, 0px 0px #111;
  color: transparent;
  cursor: pointer;
  transition: text-shadow background-color .1s;
  &:hover {
    text-shadow: 1px 1px #eee, 0px 0px black;
    background-color: #3a3a3a;
  }
  .highlight {
    text-shadow: 1px 1px #d85656, 0px 0px #111;
  }
  ${props => props.theme.highlight && `
    text-shadow: 1px 1px #eee, 0px 0px black;
    background-color: #3a3a3a;
  `}
`

export const ChangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #292929;
  border-radius: 5px;
  padding: 2px;
  margin: 2px 10px;
  border-top: 1px solid #111;  
  border-bottom: 1px solid #404040; 
`

export const ChangeBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
`

export const ChangeDetailContainer = styled.div`
  display: flex;
`

export const CallStack = styled.div`
  display: flex;
  font-size: 12px;
  padding: 2px 5px;
`

export const CallStackDeleted = styled.div`
  display: flex;
  font-size: 12px;
  padding: 2px 5px;
  text-decoration: line-through;
`

export const CallStackPrefixKey = styled.div`
  color: transparent;
  text-shadow: 1px 1px #888, 0px 0px #000;
`

export const CallStackModifyKey = styled.div`
  color: transparent;
  text-shadow: 1px 1px #888, 0px 0px #000;
`

export const ChangeTypeOldValue = styled.div`
  font-size: 13px;
  text-decoration: line-through;
  margin-left: 5px;
  text-shadow: 1px 1px #666, 0px 0px #111;
  color: transparent;
`

export const ChangeTypeNewValue = styled.div`
  font-size: 13px;
  margin-left: 5px;
  text-shadow: 1px 1px #62a562, 0px 0px #111;
  color: transparent;
`