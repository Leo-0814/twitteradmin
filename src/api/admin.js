import axios from "axios"
import Swal from "sweetalert2"
import { tranTime } from "../component/common/time"

const baseUrl = 'https://adminapi.ball188.cc'

export const login = async({account, password, gcode}) => {
  try {
    const res = await axios.post(`${baseUrl}/admin/login`, {account, password, gcode})

    const adminToken = res.data.data.token
    
    if(adminToken) {
      return adminToken
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

export const getUsers = async (adminToken) => {
  try {
    const res = await axios.get(`${baseUrl}/BRL/user/list?current=1&pageSize=11&slow_query_status=0&sorter=%7B%7D&filter=%7B%7D&page_size=11&page=1&lang=zh`, {
      headers: {
        Authorization: 'bearer ' + adminToken
      }
    })

    return res.data.data.user_list.data
  } catch (error) {
    console.error('[Get users]', error)
  }
}

export const getBanners = async (adminToken, current, pageSize, params) => {
  let url = `${baseUrl}/BRL/banner?current=${current}&pageSize=${pageSize}&sorter=%7B%7D&filter=%7B%7D&page=${current}&lang=zh`
  if (params) {
    let paramsArr = Object.entries(params)
    for (const [key, value] of paramsArr) {
      if (key === 'createDate') {
        url += `&start_time=${value[0]}%2000%3A00%3A00&end_time=${value[1]}%2023%3A59%3A59`
      } else if (key === 'startDate') {
        url += `&show_start_date=${value[0]}%2000%3A00%3A00&show_end_time=${value[1]}%2023%3A59%3A59`
      } else {
        url += `&${key}=${value}`
      }
    }
  }
  
  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: 'bearer ' + adminToken
      }
    })
    return res.data.data
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

export const enableBanner = async (adminToken, bannerId) => {
  try {
    const res = await axios({
      method: 'put',
      url: `${baseUrl}/BRL/banner/${bannerId}/enable`,
      headers: {
        Authorization: 'bearer ' + adminToken
      }
    })

    return res.data.data
  } catch (error) {
    console.error('[Enable banner]', error)
  }
}

export const deleteBanner = async (adminToken, bannerId) => {
  try {
    const res = await axios({
      method: 'delete',
      url: `${baseUrl}/BRL/banner/${bannerId}`,
      headers: {
        Authorization: 'bearer ' + adminToken
      }
    })

    return res.data.data
  } catch (error) {
    console.error('[Delete banner]', error)
  }
}

export const editBanner = async ({adminToken, bannerControlId, ...prop}) => {
  prop.position = '前台首頁'? 1: 2
  prop.end_time = tranTime(prop.end_time)
  prop.start_time = tranTime(prop.start_time)
  prop.img = prop.img[0].url
  try {
    const res = await axios({
      method: 'put',
      url: `${baseUrl}/BRL/banner/${bannerControlId}`,
      headers: {
        Authorization: 'bearer ' + adminToken
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

export const createBanner = async ({adminToken, banner}) => {
  banner.img = banner.img.path
  try {
    const res = await axios({
      method: 'post',
      url: `${baseUrl}/BRL/banner`,
      headers: {
        Authorization: 'bearer ' + adminToken
      },
      data: {...banner}
    })

    return res.data.data
  } catch (error) {
    console.error('[Create banner]', error)
  }
}

export const uploadImg = async (params, adminToken) => {
  const form = params.params

  try {
    const res = await axios({
      method: 'post',
      url: 'https://image.ball188.cc/api/image/upload',
      headers: {
        Authorization: 'bearer ' + adminToken
      },
      data: form
    })
    
    return res.data.data
  } catch (error) {
    console.error('[UploadImg]', error)
  }
}

export const logout = async (adminToken) => {
  try {
    await axios({
      method: 'post',
      headers: {
        Authorization: 'bearer ' + adminToken
      },
      url: `${baseUrl}/admin/logout`
    })
  } catch (error) {
    console.error('[Logout error]', error)
  }
}