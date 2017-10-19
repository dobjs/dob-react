import styled, { keyframes } from 'styled-components'

const borderAnimation = keyframes`
	0% {
    box-shadow: 0 0 10px black;
    outline: 1px solid transparent;
  }
  
  30% {
    box-shadow: 0 0 3px transparent;
    outline: 1px solid #333;
  }

  80% {
    box-shadow: 0 0 3px transparent;
    outline: 1px solid #333;
  }

	100% {
    box-shadow: 0 0 3px transparent;
    outline: 1px solid transparent;
	}
`;

export const Container = styled.div`
  position: relative;
  &.use-animation {
    animation: ${borderAnimation} 3s 1;
  }
`

export const DebugContainer = styled.div`
  position: absolute;
  z-index: 100;
  left: 0;
  top: 0;
`

export const CountTag = styled.div`
  background-color: #333;
  padding: 2px 7px;
  text-shadow: 1px 1px #ccc, 0px 0px #111;
  color: transparent;
  z-index: 100;
  box-shadow: 0 0 10px #3e3e3e;
`

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-shadow: 1px 1px #ccc, 0px 0px #111;
  color: transparent;
  width: 200px;
  background-color: #333;
  padding: 5px;
  box-shadow: 0 0 10px #3e3e3e;
`

export const CallContainer = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #4a4a4a;
  padding: 5px;
  text-shadow: 1px 1px #aaa, 0px 0px #111;
`

export const CallNumber = styled.div`
  display: flex;
`

export const ActionScroll = styled.div`
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
`

export const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid black;
`

export const RenderCount = styled.div`
  ${props => props.theme && props.theme.level === 'normal' && `
    text-shadow: 1px 1px #ccc, 0px 0px #111;
  `}
  ${props => props.theme && props.theme.level === 'frequently' && `
    text-shadow: 1px 1px #eee, 0px 0px #111;
  `}
  ${props => props.theme && props.theme.level === 'warning' && `
    text-shadow: 1px 1px #e4df2b, 0px 0px #111;
  `}
  ${props => props.theme && props.theme.level === 'danger' && `
    text-shadow: 1px 1px #e0641b, 0px 0px #111;
  `}
`

export const ActionContainer = styled.div`
  display: flex;
  padding: 5px;
  &:not(:first-child) {
    border-top: 1px solid black;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #4a4a4a;
  }
  transition: text-shadow background-color .1s;
  &:hover {
    text-shadow: 1px 1px #eee, 0px 0px black;
    background-color: #3a3a3a;
  }
  cursor: pointer;
`