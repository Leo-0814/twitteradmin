import LogoIcon from './LogoIcon'
import logOut from '../images/_base/logOut.png'
import { Link, useNavigate } from "react-router-dom"
import basePost from '../images/_base/post.png'
import baseUser from '../images/_base/user.png'
import baseBanner from  '../images/_base/banner.png'
import { clsx } from "clsx"
import { logout } from '../api/admin'

const LeftContainer = ({post, user, banner}) => {
  const navigate = useNavigate()

  // 點擊登出
  const handleClick = async () => {
    const token = localStorage.getItem('token')
    try {
      await logout(token)
      localStorage.removeItem('token')
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }  
  return (
    <div className="leftContainer">
      <LogoIcon></LogoIcon>
      <div className="leftContainer-list">
        <Link to='/posts'className="leftContainer-list-item">
          <img src={post? post: basePost} alt="post" className="leftContainer-list-icon" />
          <div className={clsx('leftContainer-list-text', { active: post })}>推文清單</div>
        </Link>
        <Link to={`/users`} className="leftContainer-list-item">
          <img src={user? user: baseUser} alt="user" className="leftContainer-list-icon" />
          <div className={clsx('leftContainer-list-text', { active: user })}>使用者列表</div>
        </Link>
        <Link to='/banners' className="leftContainer-list-item">
          <img src={banner? banner: baseBanner} alt="banner" className="leftContainer-list-icon" />
          <div className={clsx('leftContainer-list-text', { active: banner })}>輪播圖</div>
        </Link>

        <div className="leftContainer-list-item leftContainer-list-logOut" onClick={handleClick}>
          <img src={logOut} alt="logOut" className="leftContainer-list-icon" />
          <div className="leftContainer-list-text">登出</div>
        </div>
      </div>
    </div>
  )
}

export default LeftContainer