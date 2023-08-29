import { styled } from 'styled-components'
import { timeDifferent } from './common/time'
import UserPhoto from './UserPhoto'
import PopupModal from './PopupModal'
import { useState } from 'react'
import clsx from 'clsx'

const StyledPostCard = styled.div`
  width: 100%;
  padding: 12px 5px 12px 24px;
  border-bottom: 1px solid rgba(230, 236, 240, 1);
  display: flex;
  position: relative;

  .post-card-photo {
    margin-top: 5px
  }
  .post-card-data {
    margin-left: 5px;
    margin-top: 5px;

    .card-data-header {
      display: flex;
      align-items: center;

      & > a {
        text-decoration: none;
        color: black;
      }

      .data-header-username {
        font-weight: 700;
        font-size: 16px;
        line-height: 26px;
        margin-right: 5px;
      }
      .data-header-account {
        color: rgba(108, 117, 125, 1);
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
      }
      .data-header-dot {
        color: rgba(108, 117, 125, 1);
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
      }
      .data-header-time {
        color: rgba(108, 117, 125, 1);
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
      }
    }
    .card-data-content {
      font-weight: 400;
      font-size: 16px;
      line-height: 26px;
      margin-top: 5px;
      padding-right: 48px;
    }
  }
  .post-card-cancel {
    width: 24px;
    height: 24px;
    position: absolute;
    top: 12px;
    right: 0;
    cursor: pointer;
  }
`


const PostCard = ({ postData, onClickConfirmToDelete }) => {

  const timeDif = timeDifferent(postData.getTime)

  return (
    <StyledPostCard>
      <UserPhoto className='post-card-photo'></UserPhoto>
      <div className='post-card-data' >
        <div className='card-data-header' >
          <div className='data-header-username'>{postData.real_name}</div>
          <div className='data-header-account' >@{postData.account}</div>
          <span className='data-header-dot'>．</span>
          <div className='data-header-time'>{timeDif}</div>
        </div>
        <div className='card-data-content' >{postData.content}</div>
      </div>
      <PopupModal className='post-card-cancel' postData= {postData} onClickConfirmToDelete={(postId) => onClickConfirmToDelete?.(postId)}></PopupModal>
    </StyledPostCard>
  )
}

export default PostCard