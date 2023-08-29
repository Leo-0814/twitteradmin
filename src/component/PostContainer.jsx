import PostCard from "./PostCard"

const PostContainer = ({postList, onClickConfirmToDelete}) => {
  return (
    <div className="postContainer">
      <div className="postContainer-header">
          <div className="header-content">推文清單</div>
      </div>
      <div className='postContainer-post'>
        {postList.map(post => {
          return (
            <PostCard key={post.id} postData={post} onClickConfirmToDelete={(postId) => onClickConfirmToDelete?.(postId)}></PostCard>
          )
        })}
      </div>
    </div>
  )
}

export default PostContainer
