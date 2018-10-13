import styled from "styled-components";

const Handle = styled.div`
  position: absolute;
  ${props => props.kind}: 0;
  top: 0;
  bottom: 0;
  background: rgba(255,255,255,0.4);
  width: 5px;
  &:hover{
    background: rgba(255,255,255,0.2);
  }
`;

export default Handle;
