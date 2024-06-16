import styled, { css } from "styled-components"

export const BottomNavigateWrapper = styled.div<{ $primary?: boolean }>`
  display: none;
  position: -webkit-fixed;
  position: fixed;
  height: 75px;
  width: 100%;
  bottom: 0;
  z-index: 1020;

  @media (max-width: 430px) {
  display: block;
}
`

export const NavigationBottom = styled.nav<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: .5rem;
  gap: .5rem;
  height: 75px;
  max-height: 75px;
  background-color: rgba(255, 255, 255, .5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: .5px solid var(--soft-grey);
  box-shadow: 0px 15px 10px 15px rgba(0, 0, 0, .05);
  overflow: hidden;

  ${props => props.theme.mode === 'dark' &&
    css`
  background-color: rgba(53, 53, 53, .5);
  border-color: var(--border-dark-color);
  color: var(--white);
`}
`

export const NavigationItems = styled.button<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 3px;
  height: 100%;
  width: 100%;
  background-color: transparent;
  color: var(--real-black);
  border: unset;

  ${props => props.theme.mode === 'dark' &&
    css`
  color: var(--white);
`}

  ${props => props.$primary && css`
    & > svg, span {
      color: var(--main-color);
    }
    `}

  & > svg {
    font-size: 24px;
  }

  & > span {
    font-size: 10px;
    max-width: 50px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:focus {
    border: unset;
    outline: unset;
  }
`

export const ActiveNavBlur = styled.div<{ $primary?: boolean }>`
  display: none;

${props => props.$primary && css`
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  filter: blur(35px);
  background-color: var(--main-color);
  position: fixed;
  bottom: 20px;
  z-index: -1;
`}
`