import styled from "styled-components"

export const MuteEtemp = styled.button<{ $primary?: boolean }>`
  position: relative;
  width: 50px;
  height: 30px;
  background-color: ${(propss) => (propss.$primary ? 'var(--main-color)' : '#ddd')};
  border: 1px solid ${(propss) => (propss.$primary ? 'var(--main-color)' : '#ccc')};
  border-radius: 20px;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  overflow: hidden;

  .icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${(propss) => (propss.$primary ? 'var(--white)' : 'var(--white)')};
    transition: transform 0.3s ease;
    transform: ${(propss) =>
    propss.$primary ? 'translateX(22px)' : 'translateX(2px)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(propss) => (propss.$primary ? 'var(--main-last-color)' : 'var(--main-last-color)')};
    transition: .3s;
  }

  &:hover {
  border-color: var(--main-color);
  transition: .3s;
}
`