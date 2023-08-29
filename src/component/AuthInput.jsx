import { styled } from "styled-components"

const StyledContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`

const StyledLabel = styled.label`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: rgba(105, 105, 116, 1);
  background-color: rgba(245, 248, 250, 1);
  padding: 3px 6px 0px 6px;
`

const StyledInput = styled.input`
  height: 30px;
  border-radius: 0px 0px 4px 4px;
  background-color: rgba(245, 248, 250, 1);
  border: none;
  border-bottom: 2px solid #657786;
  padding: 0 6px;
  font-size: 16px;
  line-height: 26px;
  font-weight: 400;

  &:focus {
    outline: none;
  }
`

const AuthInput = ({type, name, value, placeholder, label, className, onChange, readOnly}) => {
    if (readOnly) {
      return (
        <StyledContainer>
          <StyledLabel htmlFor={name}>{label}</StyledLabel>
          <StyledInput id={name} type={type || 'text'} value={value} placeholder={placeholder || ''} className={className} readOnly onChange={(e) => onChange?.(e.target.value)} />
        </StyledContainer>
      )
    } else {
      return (
        <StyledContainer>
          <StyledLabel htmlFor={name}>{label}</StyledLabel>
          <StyledInput id={name} type={type || 'text'} value={value} placeholder={placeholder || ''} className={className}  onChange={(e) => onChange?.(e.target.value)} />
        </StyledContainer>
      )
    }
}

export default AuthInput