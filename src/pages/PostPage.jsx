import { useEffect, useState } from "react"
import LeftContainer from "../component/LeftContainer"
import postActive from '../images/_base/postActive.png'
import { getPosts } from "../api/posts"
import PostContainer from "../component/PostContainer"

const PostPage = () => {
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

  return (
    <>
      <div className="mainContainer">
        <LeftContainer post={postActive}></LeftContainer>
        <PostContainer postList={postList}></PostContainer>
      </div>
    </>
  )
}

export default PostPage