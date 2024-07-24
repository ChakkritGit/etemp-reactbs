import styled from "styled-components"

export const AddWarrantyButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  width: ${props => props.$primary ? '30px' : 'max-content'};
  height: ${props => props.$primary ? '30px' : 'max-content'};
  max-width: 165px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid var(--main-color);
  background-color: unset;
  color: var(--main-color);
  font-weight: bold;
  padding: .5rem;

  &:hover {
    background-color: var(--main-color);
    color: var(--white);
    transition: .3s;
  }

  & svg {
    stroke-width: 1px;
  }
`