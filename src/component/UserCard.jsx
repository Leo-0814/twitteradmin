import { styled } from "styled-components"
import userBackground from '../images/userBackground.png'
import UserPhoto from "./UserPhoto"
import posting from '../images/_base/posting.png'
import like from '../images/_base/like.png'

const UserCard = ({ userData, postList }) => {
  const postCountOfUser = postList.filter(post => post.account === userData.account).length
  const likeCountOfUser = postList.filter(post => post.like.includes(userData.account_id)).length

  const StyledUserContainer = styled.div`
    width: 210px;
    height: 314px;
    border-radius: 10px;
    text-align: center;
    position: relative;
    background-color: #F6F7F8;
    // box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
    margin-right: 16px;
    margin-bottom: 20px;

    .userContainer-background {
      width: 210px;
      height: 140px;
      border-radius: 10px 10px 0px 0px;
      object-fit: cover;
    }
    .userContainer-photo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: white;
      position: absolute;
      top: 60px;
      left: 55px;

      .userContainer-photo-userPhoto {
        width: 92px;
        height: 92px;
        border-radius: 50%;
        position: absolute;
        top: 4px;
        left: 4px;
      }
    }
    .userContainer-data {
      margin: 30px 0 10px 0;

      .userContainer-data-account {
        font-weight: 700;
        font-size: 16px;
        line-height: 26px;
      }
      .userContainer-data-account_id {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #6C757D;
      }
    }
    .userContainer-posted {
      display: flex;
      justify-content: center;

      .userContainer-posted-posting {
        display: flex;
        align-items: center;
        margin-right: 16px;

        .posted-posting-icon {
          width: 24px;
          height: 24px;
        }
        .posted-posting-count {
          margin-left: 5px;
        }
      }
      .userContainer-posted-like {
        display: flex;
        align-items: center;

        .posted-like-icon {
          width: 24px;
          height: 24px;
        }
        .posted-like-count {
          margin-left: 5px;
        }
      }
    }
    .userContainer-follow {
      display: flex;
      justify-content: center;
      margin-top: 10px;

      .userContainer-follow-following {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        margin-right: 8px;
        color: #6C757D;

        & > span {
          color: #171725;
          font-weight: 700;
        }
      }
      .userContainer-follow-follower {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #6C757D;

        & > span {
          color: #171725;
          font-weight: 700;
        }
      }
    }
  `

  return (
    <StyledUserContainer>
      <img src={userBackground} alt='userBackground' className="userContainer-background" />
      <div className="userContainer-photo">
        <UserPhoto className='userContainer-photo-userPhoto'></UserPhoto>
      </div>
      <div className="userContainer-data">
        <div className="userContainer-data-account">{userData.account}</div>
        <div className="userContainer-data-account_id">@{userData.account_id}</div>
      </div>
      <div className="userContainer-posted">
        <div className="userContainer-posted-posting">
          <img src={posting} alt="posting" className="posted-posting-icon"/>
          <div className="posted-posting-count">{postCountOfUser}</div>
        </div>
        <div className="userContainer-posted-like">
          <img src={like} alt="like" className="posted-like-icon"/>
          <div className="posted-like-count">{likeCountOfUser}</div>
        </div>
      </div>
      <div className="userContainer-follow">
        <div className="userContainer-follow-following"><span>34個</span>跟隨中</div>
        <div className="userContainer-follow-follower"><span>59位</span>跟隨者</div>
      </div>
    </StyledUserContainer>
  )
}

export default UserCard