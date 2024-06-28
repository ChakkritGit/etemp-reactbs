import styled from "styled-components"

export const ChartContainerFull = styled.div`
@media (max-width: 430px) {
  max-width: 350px;

  &>div{
    min-height: 480px;
    min-width: 350px;
  }

  &>div>div, &>div>div>svg, &>div>div>svg>foreignObject {
    height: 480px;
    width: 350px !important;
  }
}
`