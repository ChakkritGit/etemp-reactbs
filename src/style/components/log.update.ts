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

export const LogDetailsButton = styled.button<{ $primary?: boolean }>`
background-color: var(--main-color);
color: var(--white);
border-radius: var(--border-radius-small);
border: unset;
height: 35px;
padding: .5rem;

&:hover {
  background-color: var(--blue-black);
  transition: .3s;
}
`

export const DetailsFlex = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
gap: .5rem;
justify-content: center;

&>pre {
  display: flex;
  flex-direction: column;
  max-height: 760px;
  background-color: ${props => props.theme.mode === 'dark' ? 'var(--main-dark-color)' : 'var(--soft-grey)'};
  border-radius: var(--border-radius-small);
  padding: 1rem;
  user-select: none;
  -webkit-user-select: none;
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  margin-top: .5rem;

  &>span {
    font-size: 18px;
  }
}
`

export const TopBarProgress = styled.div<{ $primary?: boolean }>`
  background: linear-gradient(90deg, var(--main-color-f1) 0%, var(--blue-black) 50%, var(--main-color) 100%);
  height: 5px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 9999;
  transition: .3s ease-in-out;
`