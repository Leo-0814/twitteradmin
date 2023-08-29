import LeftContainer from "../component/LeftContainer"
import bannerActive from '../images/_base/bannerActive.png'

const BannerPage = () => {
  return (
    <>
      <div className="mainContainer">
        <LeftContainer banner={bannerActive}></LeftContainer>
      </div>
    </>
  )
}

export default BannerPage