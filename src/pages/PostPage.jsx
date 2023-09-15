import { useEffect, useState } from "react"
import LeftContainer from "../component/LeftContainer"
import postActive from '../images/_base/postActive.png'
import PostContainer from "../component/PostContainer"
import db from "../configs/config"

const PostPage = () => {
  const [ postList, setPostList ] = useState([])

  const handleConfirmToDelete = async (postId) => {
    // try {
    //   const { success } = await deletePost(postId)

    //   if (success) {
    //     const res = await getPosts()
    //     setPostList(res)
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
    db.ref(`posts/${postId}`).remove()
  }

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

  return (
    <>
      <div className="mainContainer">
        <LeftContainer post={postActive}></LeftContainer>
        <PostContainer postList={postList} onClickConfirmToDelete={handleConfirmToDelete}></PostContainer>
      </div>
      
    </>
  )
}

export default PostPage