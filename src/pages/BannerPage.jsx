import { useEffect, useState } from "react"
import BannerContainer from "../component/BannerContainer"
import LeftContainer from "../component/LeftContainer"
import bannerActive from '../images/_base/bannerActive.png'
import { useNavigate } from "react-router-dom"
import { getBanners } from "../api/admin"

const BannerPage = () => {
  const navigate = useNavigate()
  const [ bannerList, setBannerList ] = useState([])

  // 初始拿輪播列表
  useEffect(() => {
    const getBannersAsync = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const res = await getBanners(token)
        
        if (res) {
          setBannerList(res)
        } else {
          localStorage.removeItem('token')
          navigate('/login')
        }
      } catch (error) {
        console.log(error)
      }
    }
    getBannersAsync()
  },[navigate])

  return (
    <>
      <div className="mainContainer">
        <LeftContainer banner={bannerActive}></LeftContainer>
        <BannerContainer bannerList={bannerList}></BannerContainer>
      </div>
    </>
  )
}

export default BannerPage