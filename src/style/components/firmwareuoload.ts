import styled, { css } from "styled-components"

export const FirmwareContainer = styled.div<{ $primary?: boolean }>`
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

export const FirmwareHeader = styled.div<{ $primary?: boolean }>`
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

export const FirewareContent = styled.div<{ $primary?: boolean }>`
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

export const UploadButton = styled.button<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
width: max-content;
max-width: 165px;
max-height: 45px;
border-radius: var(--border-radius-small);
border: 2px solid var(--main-color);
background-color: unset;
color: var(--main-color);
font-weight: bold;
padding: .5rem;

${props => props.$primary &&
    css`
  width: 30px;
  height: 30px;
`}

&:hover {
  background-color: var(--main-color);
  color: var(--white);
  transition: .3s;
}

& svg {
  stroke-width: 1px;
}
`

export const DropContainer = styled.div<{ $primary?: File | undefined, $error?: boolean }>`
display: flex;
align-items: center;
justify-content: center;
height: 500px;
max-height: 500px;
border-radius: .5rem;
border: 3px dashed ${props => props.$primary ? 'var(--main-color)' : 'var(--grey)'};
background-color: ${props => props.$primary ? 'var(--main-color-f2)' : propsTheme => propsTheme.theme.mode === 'dark' ? 'var(--main-seccond-color)' : 'var(--soft-grey)'};
transition: .3s;

${props => props.$error && css`
  border: 3px dashed var(--danger-75);
  background-color: ${propsTheme => propsTheme.theme.mode === 'dark' ? 'var(--danger-25)' : 'var(--danger-50)'};
`}
`

export const RowChildren = styled.div`
  width: 100%;

  &>label {
    width: 100%;
    padding: 0;
  }
`

export const DropHereFile = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 2rem;

&>span {
  font-size: 18px;
}
`

export const FileDroped = styled.div<{ $primary?: boolean, $error?: boolean }>`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 2rem;

&>div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .5rem
}

${props => props.$primary && css`
  .CircularProgressbar .CircularProgressbar-text {
    fill: var(--main-color);
  }

  .CircularProgressbar .CircularProgressbar-trail {
    stroke: var(--main-color-f1);
  }

  .CircularProgressbar .CircularProgressbar-path {
    stroke: var(--main-color);;
  }

  &>svg {
  width: 200px;
  height: 200px;
}
`}

${props => props.$error && css`
.CircularProgressbar .CircularProgressbar-text {
    fill: var(--danger-100);
  }

  .CircularProgressbar .CircularProgressbar-trail {
    stroke: var(--danger-75);
  }

  .CircularProgressbar .CircularProgressbar-path {
    stroke: var(--danger-100);;
  }
`}

&>div>span, svg {
  font-size: 18px;
  color: var(--main-color);

  ${props => props.$error && css`
    color: var(--danger-100);
    `}
}
`