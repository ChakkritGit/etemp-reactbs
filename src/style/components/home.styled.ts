import styled from "styled-components"

export const AdjustRealTimeFlex = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: space-evenly;
align-items: center;
padding: .5rem;
margin: 1rem 0;

& > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;
}

& > div > div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  height: 65px;
  max-width: 300px;
  max-height: 70px;
  border-radius: var(--border-radius-small);
  padding: .7rem 1rem;
  border: 2px solid ${props => props.$primary ? 'var(--danger-color)' : 'var(--main-color)'};
  overflow: hidden;

  & > span {
    font-weight: bold;
    font-size: 16px;
  }

  & > span > span {
    color: ${props => props.$primary ? 'var(--danger-color)' : 'var(--main-color)'};
    font-weight: bold;
    font-size: 28px;
  }
}

& > svg:nth-child(3) {
    display: none;
  }

@media (max-width: 430px) {
  flex-direction: column;
  gap: 1rem;

  & > svg:nth-child(2) {
    display: none;
  }
  & > svg:nth-child(3) {
    display: block;
  }
}
`

export const OpenSettingBuzzer = styled.button<{ $primary?: boolean }>`
display: flex;
align-items: center;
width: max-content;
height: 35px;
gap: .5rem;
padding: .5rem;
background-color: transparent;
border-radius: var(--border-radius-small);
border: 2px solid var(--main-color);

& > svg, span {
  color: var(--main-color);
  font-weight: bold;
}

&:hover {
  background-color: var(--main-color);
  transition: .3s;

  & > svg, span {
  color: var(--white);
  transition: .3s;
  }
}
`

export const ModalMuteHead = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: .5rem;
`