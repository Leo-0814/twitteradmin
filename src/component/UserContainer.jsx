import UserCard from "./UserCard"

const UserContainer = ({ userList, postList }) => {
  return (
    <div className="userContainer">
      <div className="userContainer-header">
          <div className="header-content">使用者列表</div>
      </div>
      <div className='userContainer-user'>
        {userList.map(user => {
          return (
            <UserCard userData={user} postList={postList}></UserCard>
          )
        })}
      </div>
    </div>
  )
}

export default UserContainer
