import { useEffect, useState } from "react"
import LeftContainer from "../component/LeftContainer"
import UserContainer from "../component/UserContainer"
import userActive from '../images/_base/userActive.png'
import { useNavigate } from "react-router-dom"
import { getUsers } from "../api/admin"
import { getPosts } from "../api/posts"

const UserPage = () => {
  const navigate = useNavigate()
  const [ userList, setUserList ] = useState([])
  const [ postList, setPostList ] = useState([])

  // 初始拿推文
  useEffect(() => {
    const getPostsAsync = async () => {
      try {
        const res = await getPosts()
        setPostList(res)

      } catch (error) {
        console.log(error)
      }
    }
    getPostsAsync()
  },[])

  // 初始拿用戶列表
  useEffect(() => {
    const getUsersAsync = async () => {
      const adminToken = localStorage.getItem('adminToken')

      if (!adminToken) {
        navigate('/login')
        return
      }

      try {
        const res = await getUsers(adminToken)
        
        if (res) {
          setUserList(res)
        } else {
          localStorage.removeItem('adminToken')
          navigate('/login')
        }
      } catch (error) {
        console.log(error)
      }
    }
    getUsersAsync()
  },[navigate])

  return (
    <>
      <div className="mainContainer">
        <LeftContainer user={userActive}></LeftContainer>
        <UserContainer userList={userList} postList={postList}></UserContainer>
      </div>
    </>
  )
}

export default UserPage