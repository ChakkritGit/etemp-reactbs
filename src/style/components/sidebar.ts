import styled from "styled-components"

export const AboutVersion = styled.span<{ $primary?: boolean }>`
text-align: ${props => props.$primary ? 'center' : 'right'};
font-size: 14px;
padding: ${props => props.$primary ? 'unset' : '0px 16px 0px 16px'};
color: var(--grey);
margin-top: .5rem;
cursor: pointer;

&:hover {
  text-decoration: underline;
}
`