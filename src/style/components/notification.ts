import styled, { css } from "styled-components"

export const NotiHead = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: 1rem .5rem;
  background-color: ${(propss) => (propss.theme.mode === 'dark' ? 'var(--main-last-rgba)' : 'var(--main-white-rgba)')};
  backdrop-filter: ${(propss) => (propss.theme.mode === 'dark' ? 'blur(35px)' : 'blur(20px)')};
  -webkit-backdrop-filter: ${(propss) => (propss.theme.mode === 'dark' ? 'blur(35px)' : 'blur(20px)')};
  position: sticky;
  top: 0;
`

export const NotiHeadBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 35px;
  border-radius: var(--border-radius-small);
  border: 2px solid var(--main-color);
  background-color: unset;
  color: var(--main-color);
  font-weight: bold;
  padding: 0.5rem;

  &:hover {
    background-color: var(--main-color);
    color: var(--white);
    transition: .3s;
  }

  ${props => props.$primary &&
    css`
    background-color: var(--main-color);
    color: var(--white);
  `}
`