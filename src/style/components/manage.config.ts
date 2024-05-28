import styled from "styled-components";

export const ManageConfigAdd = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  width: 100%;
  /* max-width: 165px; */
  max-height: 45px;
  border-radius: var(--border-radius-small);
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

export const ModeNetworkFlex = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`