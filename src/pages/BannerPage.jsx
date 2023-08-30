import { useEffect, useState } from "react"
import BannerContainer from "../component/BannerContainer"
import LeftContainer from "../component/LeftContainer"
import bannerActive from '../images/_base/bannerActive.png'
import { useNavigate } from "react-router-dom"
import { getBanners } from "../api/admin"
import { Modal } from "antd"

const BannerPage = () => {
  const navigate = useNavigate()
  const [ bannerList, setBannerList ] = useState([])
  const [ bannerControlId, setBannerControlId ] = useState(0)
  const [ openStatus0Modal, setOpenStatus0Modal ] = useState(false);
  const [ openStatus1Modal, setOpenStatus1Modal ] = useState(false);
  const [ confirmLoading, setConfirmLoading ] = useState(false);

  const handleShowModal = (status, bannerId) => {
    if (status === 0) {
      setOpenStatus0Modal(true)
      setBannerControlId(bannerId)
    } else if (status === 1) {
      setOpenStatus1Modal(true)
      setBannerControlId(bannerId)
    }
  }

  const handleOk = async () => {
    setConfirmLoading(true);
    if ()
    setTimeout(() => {
      setOpenStatus0Modal(false);
      setOpenStatus1Modal(false);
      setConfirmLoading(false);
    }, 1000);
  };

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
        <BannerContainer bannerList={bannerList} showModal={handleShowModal} openModal={openModal}></BannerContainer>
        
        
      </div>
    </>
  )
}

export default BannerPage