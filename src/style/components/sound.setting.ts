import styled from "styled-components"

export const MuteEtemp = styled.button<{ $primary?: boolean }>`
  position: relative;
  width: 60px;
  height: 35px;
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
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${(propss) => (propss.$primary ? 'var(--white-grey-1)' : 'var(--white-grey-1)')};
    transition: transform 0.3s ease;
    transform: ${(propss) =>
    propss.$primary ? 'translateX(25.5px)' : 'translateX(2px)'};
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