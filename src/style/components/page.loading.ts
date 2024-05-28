import styled from "styled-components"

export const PageLoadContainer = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: center;
align-items: center;
position: fixed;
height: 100dvh;
width: 100%;
top: 0;
left: 0;
background-color: rgba(0, 0, 0, 0.35);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
z-index: 10000;

&>div>span {
  color: white;
}

&>div>div>svg {
  font-size: 48px;
  fill: white;
}
`

export const FailedtoLoad = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: center;
align-items: center;
height: calc(100dvh - 200px);

&>div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;

  &>svg {
    fill: red;
  }
}
`