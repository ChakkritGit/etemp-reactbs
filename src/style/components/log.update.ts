import styled from "styled-components"

export const LogSpan = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;

  &>span {
    font-size: 14px;
    color: var(--grey-50);
  }
`