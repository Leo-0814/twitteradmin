import { useEffect, useState } from "react"
import BannerContainer from "../component/BannerContainer"
import LeftContainer from "../component/LeftContainer"
import bannerActive from '../images/_base/bannerActive.png'
import { useNavigate } from "react-router-dom"
import { createBanner, deleteBanner, disableBanner, editBanner, enableBanner, getBanners, uploadImg } from "../api/admin"
import { Button, Form, Input,  InputNumber, Select, Modal, DatePicker, Upload } from "antd"
import dayjs from "dayjs"

const BannerPage = ({
  filePath='imgs/fundding',
}) => {
  const navigate = useNavigate()
  const [ bannerList, setBannerList ] = useState([])
  const [ bannerControlId, setBannerControlId ] = useState(0)
  const [ bannerControlStatus, setBannerControlStatus ] = useState(0)
  const [ openStatus0Modal, setOpenStatus0Modal ] = useState(false);
  const [ openStatus1Modal, setOpenStatus1Modal ] = useState(false);
  const [ openDeleteModal, setOpenDeleteModal ] = useState(false);
  const [ openCreateModal, setOpenCreateModal ] = useState(false);
  const [ openEditModal, setOpenEditModal ] = useState(false);
  const [ confirmLoading, setConfirmLoading ] = useState(false);
  const [ searchLoading, setSearchLoading ] = useState(false);
  const [ fileList, setFileList ] = useState([]);
  const [ current, setCurrent ] = useState(1)
  const { Option } = Select;
  const [ createForm ] = Form.useForm()
  const [ editForm ] = Form.useForm()
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // 點擊預覽圖片
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
        
      });
    }
    console.log(src)
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // 限制檔案<2MB
  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      console.log("file.status", file);
      setFileList(fileList);
      console.log('The file is upper 2MB')
    } else {
      setFileList([...fileList, file]);
    }
    return isLt2M;
  }

  // 上傳圖片
  const handleUploadImage = async (options) => {
    const token = localStorage.getItem('token')
    const form = new FormData();
    form.append("img", options.file);
    form.append("folder", `${filePath}`);
    // form.forEach(value => console.log(value))

    try {
      const { filepath } = await uploadImg(
        { params: form },
        token
      );
      if (openCreateModal) {
        createForm.setFieldValue('img',[{
          uid: new Date().valueOf(),
          name: filepath.split("/").pop(),
          status: "done",
          url: `https://dl.ball188.cc/${filepath}`,
          path: filepath
        }])
      } else if (openEditModal) {
        editForm.setFieldValue('img',[{
          uid: new Date().valueOf(),
          name: filepath.split("/").pop(),
          status: "done",
          url: `https://dl.ball188.cc/${filepath}`,
        }])
      }
    } catch (error) {
      console.log(error)
    }
  };

  // 關閉新建Modal重置內容
  const handleCancelCreateModal = () => {
    setOpenCreateModal(false)
    createForm.resetFields(['sorting', 'name', 'url', 'position', 'start_time', 'end_time', 'img'])
  }

  // 顯示啟用/禁用modal
  const handleShowStatusModal = (status, bannerId) => {
    if (status === 0) {
      setOpenStatus0Modal(true)
    } else if (status === 1) {
      setOpenStatus1Modal(true)
    }
    setBannerControlId(bannerId)
    setBannerControlStatus(status)
  }

  // 顯示刪除modal
  const handleShowDeleteModal = (bannerId) => {
    setOpenDeleteModal(true)
    setBannerControlId(bannerId)
  }

  // 顯示新建modal
  const handleShowCreateModal = () => {
    setOpenCreateModal(true)
  }

  // 顯示編輯modal
  const handleShowEditModal = (bannerId) => {
    setOpenEditModal(true)
    setBannerControlId(bannerId)
    const targetBanner = bannerList.filter(banner => banner.id === bannerId)
    // console.log(targetBanner)
    editForm.setFieldsValue({
      sorting: targetBanner[0].sorting,
      name: targetBanner[0].name,
      url: targetBanner[0].url,
      position: targetBanner[0].position === 1? '前台首頁': targetBanner[0].position,
      start_time: dayjs(targetBanner[0].start_time),
      end_time: dayjs(targetBanner[0].end_time),
      img: [{
        url: targetBanner[0].img,
      }],
    })
  }

  // 點擊啟用/禁用確認
  const handleStatusModalOk = async () => {
    setConfirmLoading(true);
    const token = localStorage.getItem('token')

    try {
      if (bannerControlStatus === 0) {
        await enableBanner(token, bannerControlId)
      } else if (bannerControlStatus === 1) {
        await disableBanner(token, bannerControlId)
      }
      setOpenStatus0Modal(false);
      setOpenStatus1Modal(false);
      setConfirmLoading(false);
    } catch (error) {
      console.log(error)
    }

    setTimeout(async () => {
      setSearchLoading(true)
      const res = await getBanners(token)

      if (res) {
        setBannerList(res)
        setSearchLoading(false)
      }
    }, 0)
  };

  //點擊刪除確認
  const handleDeleteModalOk = async () => {
    setConfirmLoading(true);
    const token = localStorage.getItem('token')

    try {
      await deleteBanner(token, bannerControlId)
      setOpenDeleteModal(false);
      setConfirmLoading(false);
    } catch (error) {
      console.log(error)
    }

    setTimeout(async () => {
      setSearchLoading(true)
      const res = await getBanners(token)

      if (res) {
        setBannerList(res)
        setSearchLoading(false)
      }
    }, 0)
  }

  //點擊新建確認
  const handleCreateModalOk = async (values) => {
    const token = localStorage.getItem('token')
    setConfirmLoading(true);
    try {
      const res = await createBanner({token, ...values})

      if (res) {
        handleCancelCreateModal()
        setConfirmLoading(false);
      }

      setTimeout(async () => {
        setSearchLoading(true)
        const res = await getBanners(token)

        if (res) {
          setBannerList(res)
          setSearchLoading(false)
        }
      }, 0)
    } catch (error) {
      console.log(error)
    }
  }

  // 點擊編輯確認
  const handleEditModalOk = async (values) => {
    const token = localStorage.getItem('token')
    setConfirmLoading(true);
    try {
      const res = await editBanner({token, bannerControlId, ...values})

      if (res === 1) {
        setOpenEditModal(false);
        setConfirmLoading(false);
      }

      setTimeout(async () => {
        setSearchLoading(true)
        const res = await getBanners(token)

        if (res) {
          setBannerList(res)
          setSearchLoading(false)
        }
      }, 0)
    } catch (error) {
      console.log(error)
    }
  }

  // 點擊搜尋欄位查詢按鈕
  const handleClickSearch = async (params) => {
    const token = localStorage.getItem('token')
    setSearchLoading(true)
    try {
      const res = await getBanners(token, params)
      
      if (res) {
        setBannerList(res)
        setSearchLoading(false)
        setCurrent(1)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 點擊搜尋欄位重置按鈕
  const onClickReset = async () => {
    const token = localStorage.getItem('token')
    setSearchLoading(true)

    try {
      const res = await getBanners(token)
      
      if (res) {
        setBannerList(res)
        setSearchLoading(false)
        setCurrent(1)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 初始拿輪播列表
  useEffect(() => {
    const getBannersAsync = async () => {
      setSearchLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const res = await getBanners(token)
        
        if (res) {
          console.log(res)
          setBannerList(res)
          setSearchLoading(false)
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

        <BannerContainer bannerList={bannerList} showStatusModal={handleShowStatusModal} showDeleteModal={handleShowDeleteModal} showCreateModal={handleShowCreateModal} showEditModal={handleShowEditModal} bannerCount={bannerList.length} onClickSearch={handleClickSearch} onClickReset={onClickReset} confirmLoading={confirmLoading} searchLoading={searchLoading} current={current} onChangePage={(page) => setCurrent(page)}></BannerContainer>
        
        {/* Modal */}
        <>  
          <Modal //啟用
            title="啟用"
            open={openStatus0Modal}
            onOk={handleStatusModalOk}
            confirmLoading={confirmLoading}
            onCancel={() => setOpenStatus0Modal(false)}
            okText="確定"
            cancelText="取消"
          >
            <p>是否啟用輪播圖?</p>
          </Modal>:
          <Modal //禁用
            title="禁用"
            open={openStatus1Modal}
            onOk={handleStatusModalOk}
            confirmLoading={confirmLoading}
            onCancel={() => setOpenStatus1Modal(false)}
            okText="確定"
            cancelText="取消"
          >
            <p>是否禁用輪播圖?</p>
          </Modal>
          <Modal // 刪除
            title="刪除"
            open={openDeleteModal}
            onOk={handleDeleteModalOk}
            confirmLoading={confirmLoading}
            onCancel={() => setOpenDeleteModal(false)}
            okText="確定"
            cancelText="取消"
          >
            <p>是否刪除輪播圖?</p>
          </Modal>
          <Modal // 新建
            title="新建"
            open={openCreateModal}
            onCancel={handleCancelCreateModal}
            footer={
              [
              <Button form="createForm" onClick={handleCancelCreateModal}>
                  取消
              </Button>
              ,
              <Button form="createForm" type='primary' htmlType="submit" loading={confirmLoading}>
                  確認
              </Button>
              ]
            }
            className="banner-create-modal"
            width={800}
          >
            <Form
              {...formItemLayout}
              form={createForm}
              id="createForm"
              name="createForm"
              onFinish={handleCreateModalOk}
              layout="vertical"
              style={{
                maxWidth: 800,
              }}
              scrollToFirstError
              className="banner-create-form"
              initialValues={{
                sorting: '',
                name: '',
                url: '',
                position: '',
                start_time: '',
                end_time: '',
                img: []
              }}
            >
              <Form.Item // 排序
                name="sorting"
                label="排序"
                rules={[
                  {
                    required: true,
                    message: 'Please input sorting!',
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>

              <Form.Item // 名稱
                name="name"
                label="名稱"
                rules={[
                  {
                    required: true,
                    message: 'Please input name!',
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item // 顯示位置
                name="position"
                label="顯示位置"
                rules={[
                  {
                    required: true,
                    message: 'Please select position!',
                  },
                ]}
              >
                <Select placeholder="請選擇">
                  <Option value="1">前台首頁</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="img"
                label="圖片"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="图片格式限为.jpg/.png/.gif，图片须小于2M，图片最佳显示大小为：1600*586"
                rules={[
                  {
                    required: true,
                    message: 'Please input img!',
                  },
                ]}
              >
                <Upload
                  // className="custom-upload"
                  maxCount={1}
                  accept=".png, .jpg, .jpeg"
                  listType="picture-card"
                  // showUploadList={false}
                  name='createForm-img'
                  customRequest={handleUploadImage}
                  // onChange={handleUpdateImage}
                  beforeUpload={beforeUpload}
                  fileList={fileList}
                  onPreview={onPreview}
                >
                  {'+ Upload'}
                  {/* {uploadStatus === uploadStatusEnum.REMOVED ? (
                    <>
                      <div className={`${styles.footerContainer} ${uploadErrorRequired ? styles.error : ""}`}>
                        <Image
                          width={70}
                          height={70}
                          src={"/images/exchange/icon_upload.png"}
                          preview={false}
                        />
                        <div className={styles.title}>{t("normal.uploadScreenshot")}</div>
                      </div>
                      <div className={`${styles.errorMessage} ${uploadErrorRequired ? styles.error : ""}`}>
                        {t("deposit.errorImage")}
                      </div>
                    </>
                  ) : null} */}
                </Upload>
              </Form.Item>

              <Form.Item // 超連結
                name="url"
                label="超連結"
                rules={[
                  {
                    required: true,
                    message: 'Please input url!',
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item 
                name="start_time" 
                label="開始時間"
                rules={[
                  {
                    required: true,
                    message: 'Please input start_time!',
                  },
                ]}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="請選擇"/>
              </Form.Item>

              <Form.Item 
                name="end_time" 
                label="結束時間"
                rules={[
                  {
                    required: true,
                    message: 'Please input end_time!',
                  },
                ]}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="請選擇"/>
              </Form.Item>
            </Form>
          </Modal>
          <Modal // 編輯
            title="編輯"
            open={openEditModal}
            onCancel={() => setOpenEditModal(false)}
            footer={
              [
              <Button form="editForm" onClick={() => setOpenEditModal(false)}>
                  取消
              </Button>
              ,
              <Button form="editForm" type='primary' htmlType="submit" loading={confirmLoading}>
                  確認
              </Button>
              ]
            }
            className="banner-create-modal"
            width={800}
          >
            <Form
              {...formItemLayout}
              form={editForm}
              id="editForm"
              name="editForm"
              onFinish={handleEditModalOk}
              layout="vertical"
              style={{
                maxWidth: 800,
              }}
              scrollToFirstError
              className="banner-create-form"
            >
              <Form.Item // 排序
                name="sorting"
                label="排序"
                rules={[
                  {
                    required: true,
                    message: 'Please input sorting!',
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>

              <Form.Item // 名稱
                name="name"
                label="名稱"
                rules={[
                  {
                    required: true,
                    message: 'Please input name!',
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item // 顯示位置
                name="position"
                label="顯示位置"
                rules={[
                  {
                    required: true,
                    message: 'Please select position!',
                  },
                ]}
              >
                <Select placeholder="請選擇">
                  <Option value="1">前台首頁</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="img"
                label="圖片"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="图片格式限为.jpg/.png/.gif，图片须小于2M，图片最佳显示大小为：1600*586"
                rules={[
                  {
                    required: true,
                    message: 'Please input img!',
                  },
                ]}
              >
                <Upload
                  // className="custom-upload"
                  maxCount={1}
                  accept=".png, .jpg, .jpeg"
                  listType="picture-card"
                  // showUploadList={false}
                  name='editForm-img'
                  customRequest={handleUploadImage}
                  // onChange={handleUpdateImage}
                  beforeUpload={beforeUpload}
                  fileList={fileList}
                  onPreview={onPreview}
                >
                  {'+ Upload'}
                  {/* {uploadStatus === uploadStatusEnum.REMOVED ? (
                    <>
                      <div className={`${styles.footerContainer} ${uploadErrorRequired ? styles.error : ""}`}>
                        <Image
                          width={70}
                          height={70}
                          src={"/images/exchange/icon_upload.png"}
                          preview={false}
                        />
                        <div className={styles.title}>{t("normal.uploadScreenshot")}</div>
                      </div>
                      <div className={`${styles.errorMessage} ${uploadErrorRequired ? styles.error : ""}`}>
                        {t("deposit.errorImage")}
                      </div>
                    </>
                  ) : null} */}
                </Upload>
              </Form.Item>

              <Form.Item // 超連結
                name="url"
                label="超連結"
                rules={[
                  {
                    required: true,
                    message: 'Please input url!',
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item 
                name="start_time" 
                label="開始時間"
                rules={[
                  {
                    required: true,
                    message: 'Please input start_time!',
                  },
                ]}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="請選擇" onChange={(value) => console.log(value)}/>
              </Form.Item>

              <Form.Item 
                name="end_time" 
                label="結束時間"
                rules={[
                  {
                    required: true,
                    message: 'Please input end_time!',
                  },
                ]}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="請選擇"/>
              </Form.Item>
            </Form>
          </Modal>
        </>
      </div>
    </>
  )
}

export default BannerPage