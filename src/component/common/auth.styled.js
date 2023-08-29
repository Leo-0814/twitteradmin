import { styled } from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 65px auto;
  width: 356px;
  position: relative;
`

const StyledTitle = styled.h1`
  font-weight: 700;
  font-size: 28px;
  line-height: 26px;
`

const StyledAuthButton = styled.button`
  width: 356px;
  height: 46px;
  background-color: rgba(255, 102, 0, 1);
  padding: 8px 24px 8px 24px;
  border-radius: 50px;
  color: white;
  border: none;
  margin-top: 40px;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
`
const StyledLinkContainer = styled.div`
  display: flex;
  margin-top: 20px;
`

const StyledLinkText = styled.div`
  font-weight: 400;
  line-height: 24px;
  padding: 0px 12px;
  color: rgba(0, 98, 255, 1);
`

const StyledLinkSpan = styled.span`
  font-weight: 700;
  line-height: 24px;
  font-size: 16px;
`

export {
  StyledContainer as AuthContainer,
  StyledAuthButton as AuthButton,
  StyledLinkContainer as AuthLinkContainer,
  StyledLinkText as AuthLinkText,
  StyledLinkSpan as AuthLinkSpan,
  StyledTitle as AuthTitle,
}