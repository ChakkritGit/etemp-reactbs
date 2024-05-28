// GlobalColors.js
import { createGlobalStyle, css } from 'styled-components'

const GlobalColors = createGlobalStyle`
  ${props => {
    const colors = props.theme.colors
    return css`
      :root {
        ${colors === 1 ? `
          --blue-black: #2a2a60;
          --main-color: #4646DC;
          --main-color-f1: rgba(70, 70, 255, .3);
          --main-color-f2: rgba(145, 145, 255, .3);
        ` : colors === 2 ? `
          --blue-black: #21874C;
          --main-color: #2ECC71;
          --main-color-f1: rgba(33, 135, 76, .3);
          --main-color-f2: rgba(46, 204, 113, .3);
        ` : colors === 3 ? `
          --blue-black: #03AED2;
          --main-color: #68D2E8;
          --main-color-f1: rgba(3, 174, 210, .3);
          --main-color-f2: rgba(104, 210, 232, .3);
        ` : colors === 4 ? `
          --blue-black: #C99E00;
          --main-color: #FFC700;
          --main-color-f1: rgba(201, 158, 0, .3);
          --main-color-f2: rgba(255, 199, 0, .3);
        ` : `
          --blue-black: #734A84;
          --main-color: #A569BD;
          --main-color-f1: rgba(115, 74, 132, .3);
          --main-color-f2: rgba(165, 105, 189, .3);
        `}
      }
    `
  }}
`

export default GlobalColors
