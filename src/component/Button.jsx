import { styled } from "styled-components"

const StyledButton = styled.button`
  background-color: rgba(255, 102, 0, 1);
  padding: 8px 24px 8px 24px;
  border-radius: 50px;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 102, 0, .9);
  }
`

const Button = ({children, className, onClick}) => {
  return (
    <StyledButton className={className} onClick={() => onClick?.()}>
      {children}
    </StyledButton>
  )
}

export default Button