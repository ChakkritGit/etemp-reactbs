import styled from "styled-components"

export const OpenModalButton = styled.button`
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
width: max-content;
max-width: 165px;
max-height: 45px;
border-radius: var(--border-radius-big);
border: 2px solid var(--theme-menu-color);
background-color: unset;
color: var(--theme-menu-color);
font-weight: bold;
padding: .5rem;

&:hover {
  background-color: var(--theme-menu-color);
  color: var(--white);
  transition: .3s;
}

& svg {
  stroke-width: 1px;
}
`

export const BeforeSeq = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  &>div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &>div:nth-child(2) {
    max-width: 180px;
    width: max-content;
    height: max-content;
    padding: 1rem;
    border-radius: var(--border-radius-small);
    border: 2px solid var(--main-color);

    &>span:nth-child(1) {
      font-size: 32px;
      font-weight: bold;
      color: var(--main-color);
    }
  }
`

export const MainTabManageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
  border-bottom: 2.5px solid var(--main-color);
  margin: 1rem 0;
`

export const MainTab = styled.button<{ $primary?: boolean }>`
  width: max-content;
  height: 40px;
  padding: 0 .5rem;
  border-top-left-radius: var(--border-radius-small);
  border-top-right-radius: var(--border-radius-small);
  border: 1.5px solid ${props => props.$primary ? 'var(--main-color)' : 'var(--grey)'};
  border-bottom: unset;
  background-color: ${props => props.$primary ? 'var(--main-color)' : 'transparent'};
  color: ${props => props.$primary ? 'var(--white)' : props.theme.mode === 'dark' ? 'white' : 'black'};
`