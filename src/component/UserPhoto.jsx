import { styled } from "styled-components";
import userPhoto from '../images/userPhoto.png'

const StyledUserPhoto = styled.img`
  width: 50px;
  height: 50px
`

const UserPhoto = () => {
  return (
    <StyledUserPhoto src={userPhoto} alt="userPhoto"></StyledUserPhoto>
  )
}

export default UserPhoto