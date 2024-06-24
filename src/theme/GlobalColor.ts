// GlobalColors.js
import { createGlobalStyle, css } from 'styled-components'

const getColorStyles = (colors: number) => {
  switch (colors) {
    case 1:
      return css`
        --blue-black: #2a2a60;
        --main-color: #4646DC;
        --main-color-f1: rgba(70, 70, 255, .3);
        --main-color-f2: rgba(145, 145, 255, .3);
      `
    case 2:
      return css`
        --blue-black: #21874C;
        --main-color: #2ECC71;
        --main-color-f1: rgba(33, 135, 76, .3);
        --main-color-f2: rgba(46, 204, 113, .3);
      `
    case 3:
      return css`
        --blue-black: #03AED2;
        --main-color: #68D2E8;
        --main-color-f1: rgba(3, 174, 210, .3);
        --main-color-f2: rgba(104, 210, 232, .3);
      `
    case 4:
      return css`
        --blue-black: #C99E00;
        --main-color: #FFC700;
        --main-color-f1: rgba(201, 158, 0, .3);
        --main-color-f2: rgba(255, 199, 0, .3);
      `
    case 5:
      return css`
        --blue-black: #734A84;
        --main-color: #A569BD;
        --main-color-f1: rgba(115, 74, 132, .3);
        --main-color-f2: rgba(165, 105, 189, .3);
      `
    case 6:
      return css`
        --blue-black: #D67536;
        --main-color: #E48D55;
        --main-color-f1: rgba(228, 141, 85, .3);
        --main-color-f2: rgba(214, 117, 54, .3);
      `
    case 7:
      return css`
        --blue-black: #26355D;
        --main-color: #3C4E7F;
        --main-color-f1: rgba(60, 78, 127, .3);
        --main-color-f2: rgba(38, 53, 93, .3);
      `
    case 8:
      return css`
        --blue-black: #DF3737;
        --main-color: #EE4545;
        --main-color-f1: rgba(238, 69, 69, .3);
        --main-color-f2: rgba(223, 55, 55, .3);
      `
    case 9:
      return css`
        --blue-black: #3FA28E;
        --main-color: #53C1AB;
        --main-color-f1: rgba(83, 193, 171, .3);
        --main-color-f2: rgba(63, 162, 142, .3);
      `
    case 10:
      return css`
        --blue-black: #888983;
        --main-color: #9A9B94;
        --main-color-f1: rgba(154, 155, 148, .3);
        --main-color-f2: rgba(136, 137, 131, .3);
      `
    case 11:
      return css`
        --blue-black: #70AAE4;
        --main-color: #8DC6FF;
        --main-color-f1: rgba(141, 198, 255, .3);
        --main-color-f2: rgba(112, 170, 228, .3);
      `
    case 12:
      return css`
        --blue-black: #C04D00;
        --main-color: #D65F00;
        --main-color-f1: rgba(214, 95, 0, .3);
        --main-color-f2: rgba(192, 77, 0, .3);
      `
    case 13:
      return css`
        --blue-black: #059212;
        --main-color: #06D001;
        --main-color-f1: rgba(6, 208, 1, .3);
        --main-color-f2: rgba(5, 146, 18, .3);
      `
    case 14:
      return css`
        --blue-black: #39375B;
        --main-color: #745C97;
        --main-color-f1: rgba(116, 92, 151, .3);
        --main-color-f2: rgba(57, 55, 91, .3);
      `
    case 15:
      return css`
        --blue-black: #212121;
        --main-color: #000000;
        --main-color-f1: rgba(0, 0, 0, .3);
        --main-color-f2: rgba(33, 33, 33, .3);
      `
    case 16:
      return css`
        --blue-black: #7A5947;
        --main-color: #93786A;
        --main-color-f1: rgba(147, 120, 106, .3);
        --main-color-f2: rgba(122, 89, 71, .3);
      `
    default:
      return css`
        --blue-black: #EA6B6C;
        --main-color: #F57B7C;
        --main-color-f1: rgba(245, 123, 124, .3);
        --main-color-f2: rgba(234, 107, 108, .3);
      `
  }
}

export const GlobalColors = createGlobalStyle`
  ${props => css`
    :root {
      ${getColorStyles(props.theme.colors)}
    }
  `}
`

export default GlobalColors
