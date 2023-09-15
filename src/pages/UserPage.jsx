import { useEffect, useState } from "react"
import LeftContainer from "../component/LeftContainer"
import UserContainer from "../component/UserContainer"
import userActive from '../images/_base/userActive.png'
import { useNavigate } from "react-router-dom"
import { getUsers } from "../api/admin"
import db from "../configs/config"

const UserPage = () => {
  const navigate = useNavigate()
  const [ userList, setUserList ] = useState([])
  const [ postList, setPostList ] = useState([])

  // 初始拿推文
  useEffect(() => {
    // const getPostsAsync = async () => {
    //   try {
    //     const res = await getPosts()
    //     setPostList(res)

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // getPostsAsync()
    const getPostsAsync = async () => {
      db.ref('posts').on('value', snapshot => {
        let data = []
        snapshot.forEach(item => {
          data.push(item.val())
        })
        for (let item in data) {
          let post = data[item]
          if (!post.hasOwnProperty('like')) {
            post['like'] = []
          } else {
            let likeArr = []
            for (let item in post.like) {
              likeArr.push(post.like[item])
            }
            post.like = likeArr
          }
          if (!post.hasOwnProperty('reply')) {
            post['reply'] = []
          } else {
            let replyArr = []
            for (let item in post.reply) {
              replyArr.push(post.reply[item])
            }
            post.reply = replyArr.reverse()
          }
        }
        setPostList(data.reverse())
      })
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