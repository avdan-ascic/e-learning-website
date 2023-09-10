import styled from '@emotion/styled'

const Popup = styled.div`
  position: absolute;
  width: 400px;
  max-width: 90%;
  padding: 0.5rem;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 0.5rem;
  top: 0;
  left: 0;
  z-index: 99;
  visibility: ${props => (props.open ? 'visible' : 'hidden')};
  opacity: ${props => (props.open ? 1 : 0)};
  transition: opacity 0.2s ease-in-out;
`

export default Popup