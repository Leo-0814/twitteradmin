
import { styled } from 'styled-components';
import cancel from '../images/_base/cancle.png'
import Popup from 'reactjs-popup';
import Button from './Button';
import ButtonHollow from './Button-hollow';

const StyledPopup = styled.div`
  .background {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .popupContainer {
    position: absolute;
    top: 10%;
    left: 40%;
    width: 300px;
    height: 200px;
    border-radius: 5px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 10px;

    .popupContainer-title {
      padding: 10px;
      border-bottom: 1px solid rgba(230, 236, 240, 1);
    }
    .popupContainer-content {
      text-align: center;
      justify-self: center;
    }
    .popupContainer-btn {
      align-self: end;

      .popupContainer-btn-cancel, .popupContainer-btn-confirm {
        font-size: 16px;
        padding: 0;
        width: 80px;
        height: 30px;
        margin-right: 10px;
      }
    }
  }
`

const PopupModal = ({ className, onClickConfirmToDelete, postData }) => {
  return (
    <Popup
      trigger={<img src={cancel} alt="cancel" className='post-card-cancel' />} 
      modal
      nested
      className={className}
    >
      {close => (
        <StyledPopup>
          <div className="background"></div>
          <div className="popupContainer">
            <div className="popupContainer-title">刪除</div>
            <div className="popupContainer-content">是否確定刪除?</div>
            <div className="popupContainer-btn">
              <ButtonHollow className='popupContainer-btn-cancel' onClick={close}>取消</ButtonHollow>
              <Button className='popupContainer-btn-confirm' onClick={() => onClickConfirmToDelete?.(postData.id)}>確定</Button>
            </div>
          </div>
        </StyledPopup>
      )}
    </Popup>
  )
}

export default PopupModal