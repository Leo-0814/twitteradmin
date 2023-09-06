import axios from "axios"
import Swal from "sweetalert2"
import { tranTime } from "../component/common/time"

const baseUrl = 'https://adminapi.ball188.cc'

export const login = async({account, password, gcode}) => {
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
    const res = await axios.get(`${baseUrl}/BRL/user/list?current=1&pageSize=11&slow_query_status=0&sorter=%7B%7D&filter=%7B%7D&page_size=11&page=1&lang=zh`, {
      headers: {
        Authorization: 'bearer ' + token
      }
    })

    return res.data.data.user_list.data
  } catch (error) {
    console.error('[Get users]', error)
  }
}

export const getBanners = async (token) => {
  try {
    const res = await axios.get(`${baseUrl}/BRL/banner?current=1&pageSize=20&sorter=%7B%7D&filter=%7B%7D&page=1&lang=zh`, {
      headers: {
        Authorization: 'bearer ' + token
      }
    })

    return res.data.data.data
  } catch (error) {
    console.error('[Get banners]', error)
  }
}

export const disableBanner = async (token, bannerId) => {
  try {
    const res = await axios({
      method: 'put',
      url: `${baseUrl}/BRL/banner/${bannerId}/disable`,
      headers: {
        Authorization: 'bearer ' + token
      }
    })

    return res.data.data
  } catch (error) {
    console.error('[Disable banner]', error)
  }
}

export const enableBanner = async (token, bannerId) => {
  try {
    const res = await axios({
      method: 'put',
      url: `${baseUrl}/BRL/banner/${bannerId}/enable`,
      headers: {
        Authorization: 'bearer ' + token
      }
    })

    return res.data.data
  } catch (error) {
    console.error('[Enable banner]', error)
  }
}

export const deleteBanner = async (token, bannerId) => {
  try {
    const res = await axios({
      method: 'delete',
      url: `${baseUrl}/BRL/banner/${bannerId}`,
      headers: {
        Authorization: 'bearer ' + token
      }
    })

    return res.data.data
  } catch (error) {
    console.error('[Delete banner]', error)
  }
}

export const editBanner = async ({token, bannerControlId, ...prop}) => {
  prop.position = '前台首頁'? 1: 2
  prop.end_time = tranTime(prop.end_time)
  prop.start_time = tranTime(prop.start_time)
  prop.img = prop.img[0].url
  try {
    const res = await axios({
      method: 'put',
      url: `${baseUrl}/BRL/banner/${bannerControlId}`,
      headers: {
        Authorization: 'bearer ' + token
      },
      data: {
        id: bannerControlId,
        ...prop,
      }
    })

    return res.data.data
  } catch (error) {
    console.error('[Edit banner]', error)
  }
}

export const createBanner = async ({token, ...prop}) => {
  prop.position = '前台首頁'? 1: 2
  prop.end_time = tranTime(prop.end_time)
  prop.start_time = tranTime(prop.start_time)
  prop.img = prop.img[0].path
  try {
    const res = await axios({
      method: 'post',
      url: `${baseUrl}/BRL/banner`,
      headers: {
        Authorization: 'bearer ' + token
      },
      data: {
        ...prop,
        type: 1,
      }
    })

    return res.data.data
  } catch (error) {
    console.error('[Create banner]', error)
  }
}

export const uploadImg = async (params, token) => {
  const form = params.params

  try {
    const res = await axios({
      method: 'post',
      url: 'https://image.ball188.cc/api/image/upload',
      headers: {
        Authorization: 'bearer ' + token
      },
      data: form
    })
    
    return res.data.data
  } catch (error) {
    console.error('[UploadImg]', error)
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