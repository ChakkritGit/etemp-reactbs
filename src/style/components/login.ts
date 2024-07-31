import styled from "styled-components"

export const LangContainer = styled.div`
  display: flex;
  justify-content: right;
  width: 100%;
`

export const CardContainer = styled.div`
  height: calc(100dvh - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`

export const CardFlex = styled.div`
background-color: ${props => props.theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--white-grey-1)'};
color: ${props => props.theme.mode === 'dark' ? 'var(--white-grey-1)' : 'var(--main-last-color)'};
box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
border-radius: var(--border-radius-big);
padding: 1.5rem;
width: 450px;

@media (max-width: 430px) {
  width: 345px;
  padding: 1rem;
}
`

export const TimeStap = styled.div`
color: ${props => props.theme.mode === 'dark' ? 'var(--white-grey-1)' : 'black'};
text-align: right;
width: 450px;

@media (max-width: 430px) {
  width: 345px;
}
`

export const LoginButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  height: 40px;
  color: var(--white-grey-1);
  border: unset;
  background-color: var(--main-color);
  border-radius: var(--border-radius-big);

  &:disabled {
    background-color: ${props => props.$primary && 'var(--main-last-color)'};
  }

  &:hover {
    background-color: var(--login-btn-hover);
    transition: .3s;
  }
`

export const LoadingButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;

  & svg {
    width: 20px;
    height: 20px;
    /* Safari */
    -webkit-animation: spin 1.5s linear infinite;
    animation: spin 1.5s linear infinite;
  }

  /* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
`