import axios from "axios"
import Swal from "sweetalert2"

const baseUrl = 'https://adminapi.ball188.cc'

export const Login = async({account, password, gcode}) => {
  try {
    const res = await axios.post(`${baseUrl}/admin/login`, {account, password, gcode})

    const token = res.data.data.token
    
    if(token) {
      return token
    }

  } catch (error) {
    const errorMessage = error.response.data.result.message
    Swal.fire({
      icon: 'error',
      title: '登入失敗',
      text: errorMessage
    })
    console.error('[Login error]', error)
  }
}

export const getUsers = async (token) => {
  try {
    const res = await axios.get(`${baseUrl}/BRL/user/list?current=1&pageSize=300&slow_query_status=0&sorter=%7B%7D&filter=%7B%7D&page_size=300&page=1&lang=zh`, {
      headers: {
        Authorization: 'bearer ' + token
      }
    })

    return res.data.data.user_list.data
  } catch (error) {
    console.error('[Get users]', error)
  }
}

export const logout = async (token) => {
  try {
    await axios({
      method: 'post',
      headers: {
        Authorization: 'bearer ' + token
      },
      url: `${baseUrl}/admin/logout`
    })
  } catch (error) {
    console.error('[Logout error]', error)
  }
}