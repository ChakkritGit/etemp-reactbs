import styled from "styled-components"

export const AddWarrantyButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
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

export const PrintButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  height: 40px;
  border: unset;
  background-color: unset;
  text-align: left;
`