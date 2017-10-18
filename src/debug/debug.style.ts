import styled, { keyframes } from 'styled-components'

const borderAnimation = keyframes`
	0% {
    box-shadow: 0 0 10px #3b8814;
    outline: 1px solid transparent;
  }
  
  10% {
    box-shadow: 0 0 3px transparent;
    outline: 1px solid #41c100;
  }

  80% {
    box-shadow: 0 0 3px transparent;
    outline: 1px solid #41c100;
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
  left: 0;
  top: 0;
`

export const CountTag = styled.div`
  background-color: whitesmoke;
  padding: 2px 7px;
  border: 1px solid #ccc;
  color: #666;
  border-radius: 5px;
  z-index: 100;
  box-shadow: 0 2px 10px #e0e0e0;
`