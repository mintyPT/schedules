import styled from "styled-components";

const Day = styled.li`
  display: inline-block;
  margin-right: 10px;
  font-weight: ${props => (props.selected ? "900" : "300")};
`;

export default Day;
