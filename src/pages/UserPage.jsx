import LeftContainer from "../component/LeftContainer"
import userActive from '../images/_base/userActive.png'

const UserPage = () => {
  return (
    <>
      <div className="mainContainer">
        <LeftContainer user={userActive}></LeftContainer>
      </div>
    </>
  )
}

export default UserPage