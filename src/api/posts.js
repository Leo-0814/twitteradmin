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

export const deletePost = async (postId) => {
  try {
    const res = await axios({
      method: 'delete',
      url: `${baseUrl}/posts/${postId}`,
    })
    
    return {success: true, ...res}
  } catch (error) {
    console.error('[Delete post]', error)
  }
}