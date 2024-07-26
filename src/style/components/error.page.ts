import styled from "styled-components"

export const ErrorPageStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
  height: calc(100dvh - 80px);
  color: white;

  & p>i {
    cursor: pointer;
    color: grey;
  }

  & p>i:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }
`