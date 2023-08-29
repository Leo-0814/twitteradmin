import { styled } from "styled-components";
import logo from '../images/logo.png'

const StyledLogoIcon = styled.img`
  width: 50px;
  height: 50px
`

const LogoIcon = () => {
  return (
    <StyledLogoIcon src={logo} alt="logo"></StyledLogoIcon>
  )
}

export default LogoIcon 