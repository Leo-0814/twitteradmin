import axios from "axios"

const baseUrl = 'http://localhost:3001'

export const getPosts = async () => {
  try {
    const res = await axios.get(`${baseUrl}/posts`)

    return res.data.reverse()
  } catch (error) {
    console.error('[Get posts]', error)
  }
}

export const createPost = async ({token, id, create_at, getTime, postingContent, ...personInfo}) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${baseUrl}/posts`,
      headers: {
        Authorization: 'bearer ' + token
      },
      data: {
        id,
        account: personInfo.account,
        account_id: personInfo.account_id,
        real_name: personInfo.real_name,
        remark: personInfo.remark,
        create_at,
        getTime,
        content: postingContent,
        photo: '',
        reply: [],
        like: [],
      }
    })

    return res.data
  } catch (error) {
    console.error('[Create post]', error)
  }
}

export const editPost = async ({post, personInfo, token, replyModalInputValue, create_at, getTime}) => {
  let postLike = post[0].like
  let postReply = post[0].reply

  if (replyModalInputValue) {
    postReply.unshift({
      id: postReply.length,
      account: personInfo.account,
      account_id: personInfo.account_id,
      real_name: personInfo.real_name,
      create_at,
      getTime,
      post_account: post.account,
      content: replyModalInputValue
    })
  } else {
    if (postLike.includes(personInfo.account_id)) {
      const targetIndex = postLike.findIndex(item => item === personInfo.account_id)
      postLike.splice(targetIndex, 1)
    } else {
      postLike.push(personInfo.account_id)
    }
  }
  
  
  try {
    const res = await axios({
      method: 'put',
      url: `${baseUrl}/posts/${post[0].id}`,
      headers: {
        Authorization: 'bearer ' + token
      },
      data: {
        ...post[0],
        like: postLike,
        reply: postReply
      }
    })

    return res.data
  } catch (error) {
    console.error('[Edit post]', error)
  }
}