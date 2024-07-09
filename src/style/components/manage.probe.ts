import styled, { css } from "styled-components"

export const ManageProbeContainer = styled.div<{ $primary?: boolean }>`
${props => props.theme.mode === 'dark' &&
    css`
    .hiTDLB-st>div>div>div>div,
    .hiTDLB-st>div>div>div {
      color: var(--white);
      background-color: var(--main-seccond-color);
      border-bottom-color: var(--border-dark-color);
    }

    div>nav {
      background-color: var(--main-seccond-color);
      color: var(--white);
      border-top-color: var(--border-dark-color);

      div>button {
        color: var(--white) !important;
        fill: var(--white) !important;
      }

      &>div>button:disabled {
    cursor: unset;
    color: rgba(255, 255, 255, .30) !important;
    fill: rgba(255, 255, 255, .30) !important;
  }
    }
`}
`

export const ManageProbeHeader = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: space-between;

&>div {
  display: flex;
  gap: .5rem;
}

& h3 {
  margin-bottom: unset;
}
`

export const ManageProbeBody = styled.div<{ $primary?: boolean }>`
&>div>div>div>div,&>div>div>div {
  background-color: transparent;
}

&>div>div>div>div>div,
&>div>nav {
  background-color: var(--bg-grey);
}
${props => props.theme.mode === 'dark' &&
    css`
    &>div>div>div>div:nth-child(2)>div {
    border-bottom: 1px solid rgba(255, 255, 255, .1);
  }

&>div>div>div>div>div,
&>div>nav {
  background-color: var(--main-seccond-color);
  color: var(--white);
  border-bottom: 1px solid rgba(255, 255, 255, .1);

  &>div>button {
    color: var(--white) !important;
    fill: var(--white) !important;
  }

  &>div>button:disabled {
    cursor: unset;
    color: rgba(255, 255, 255, .30) !important;
    fill: rgba(255, 255, 255, .30) !important;
  }
}
`}
`

export const Actiontableprobe = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: .5rem;
`

export const DelProbeButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  width: 30px;
  max-height: 30px;
  border-radius: var(--border-radius-big);
  border: 2px solid var(--danger-color);
  background-color: unset;
  color: var(--danger-color);
  font-weight: bold;
  padding: .5rem;

&:hover {
  background-color: var(--danger-color);
  color: var(--white);
  transition: .3s;
}

& svg {
  stroke-width: 1px;
}
`

export const ManageProbeAdd = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  width: max-content;
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