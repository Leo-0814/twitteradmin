import { useEffect, useState } from "react"
import BannerContainer from "../component/BannerContainer"
import LeftContainer from "../component/LeftContainer"
import bannerActive from '../images/_base/bannerActive.png'
import { useNavigate } from "react-router-dom"
import { createBanner, deleteBanner, disableBanner, editBanner, enableBanner, getBanners, uploadImg } from "../api/admin"
import { Button, Form, Input,  InputNumber, Select, Modal, DatePicker, Upload, Tooltip, Space } from "antd"
import dayjs from "dayjs"
import { ProCard, ProTable } from "@ant-design/pro-components"
import { CopyOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { tranTime } from "../component/common/time"

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
  const [ pageSize, setPageSize ] = useState(10)
  const [ bannerPreList, setBannerPreList ] = useState([])
  const [ bannerPreControlId, setBannerPreControlId ] = useState(0)
  const [ bannerTotal, setBannerTotal ] = useState()
  const [ params, setParams ] = useState({})
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
  const columns = [
    {
      title: '排序',
      dataIndex: 'sorting',
      key: 'sorting',
      width: 60,
    },
    {
      title: '名稱',
      dataIndex: 'name',
      key: 'name',
      width: 130,
    },
    {
      title: '顯示位置',
      dataIndex: 'position',
      key: 'position',
      width: 100,
      render: (position) => {
        if (position === 1) {
          return (
            <span>前台首頁</span>
          )
        }
      }
    },
    {
      title: '圖片',
      dataIndex: 'img',
      key: 'img',
      width: 230,
      render: (img) => <img src={img.url} alt="img" className="create-modal-table-img"/>
    },
    {
      title: '超連結',
      dataIndex: 'url',
      key: 'url',
      render: (text) => <a href={text} target="_blank" rel="noreferrer">{text}</a>,
      width: 200,
    },
    {
      title: '開始時間',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 200,
    },
    {
      title: '結束時間',
      dataIndex: 'end_time',
      key: 'end_time',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'action',
      fixed: 'right',
      render: (id, record) => (
        <Space size="middle">
          <CopyOutlined className='create-modal-table-icon' onClick={() => handleCreateModalCopy(id)}/>
          <DeleteOutlined className='create-modal-table-icon' onClick={() => handleCreateModalDelete(id)} />
        </Space>
      ),
      width: 60,
    },
  ];

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
    const adminToken = localStorage.getItem('adminToken')
    const form = new FormData();
    form.append("img", options.file);
    form.append("folder", `${filePath}`);
    // form.forEach(value => console.log(value))

    try {
      const { filepath } = await uploadImg(
        { params: form },
        adminToken
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
    setBannerPreControlId(0)
    setBannerPreList([])
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
    const adminToken = localStorage.getItem('adminToken')

    try {
      if (bannerControlStatus === 0) {
        await enableBanner(adminToken, bannerControlId)
      } else if (bannerControlStatus === 1) {
        await disableBanner(adminToken, bannerControlId)
      }
      setOpenStatus0Modal(false);
      setOpenStatus1Modal(false);
      setConfirmLoading(false);
    } catch (error) {
      console.log(error)
    }

    setTimeout(async () => {
      setSearchLoading(true)
      let { data, total } = await getBanners(adminToken, current, pageSize, params)
      setBannerTotal(total)
      data = data.map(banner => {
        return ({
          ...banner,
          key: banner.id
        })
      })

      if (data) {
        setBannerList(data)
        setSearchLoading(false)
      }
    }, 0)
  };

  //點擊刪除確認
  const handleDeleteModalOk = async () => {
    setConfirmLoading(true);
    const adminToken = localStorage.getItem('adminToken')

    try {
      await deleteBanner(adminToken, bannerControlId)
      setOpenDeleteModal(false);
      setConfirmLoading(false);
    } catch (error) {
      console.log(error)
    }

    setTimeout(async () => {
      setSearchLoading(true)
      let { data, total } = await getBanners(adminToken, current, pageSize, params)
      setBannerTotal(total)
      data = data.map(banner => {
        return ({
          ...banner,
          key: banner.id
        })
      })

      if (data) {
        setBannerList(data)
        setSearchLoading(false)
      }
    }, 0)
  }

  //點擊新建確認
  const handleCreateModalOk = () => {
    if (bannerPreList.length === 0) {
      return
    }

    const adminToken = localStorage.getItem('adminToken')
    setConfirmLoading(true);
    try {
      bannerPreList.forEach(async (banner) => {
        await createBanner({adminToken, banner})
      })

      handleCancelCreateModal()
      setConfirmLoading(false);
      setCurrent(1)

      setTimeout(async () => {
        setSearchLoading(true)
        let { data, total } = await getBanners(adminToken, current, pageSize, params)
        setBannerTotal(total)
        data = data.map(banner => {
          return ({
            ...banner,
            key: banner.id
          })
        })
        
        if (data) {
          setBannerList(data)
          setSearchLoading(false)
        }
      }, 0)
    } catch (error) {
      console.log(error)
    }
  }

  // 點擊新建添加
  const handleCreateModalAdd = (values) => {
    if (values.name && values.sorting) {
      values.end_time = tranTime(values.end_time)
      values.start_time = tranTime(values.start_time)
    
      setBannerPreList((preProp) => {
        return ([
          ...preProp,
          {
            key: bannerPreControlId,
            id: bannerPreControlId,
            position: values.position = '前台首頁'? 1: 2,
            end_time: values.end_time,
            start_time: values.start_time,
            img: values.img[0],
            name: values.name,
            sorting: values.sorting,
            url: values.url,
            type: 1,
          }
        ])
      })
      setBannerPreControlId(id => id += 1)
      createForm.resetFields(['sorting', 'name', 'url', 'position', 'start_time', 'end_time', 'img'])
    }
  }

  // 點擊新建複製
  const handleCreateModalCopy = (id) => {
    let targetBanner = bannerPreList.filter(banner => banner.id === id)
    createForm.setFieldsValue({
      sorting: targetBanner[0].sorting,
      name: targetBanner[0].name,
      url: targetBanner[0].url,
      position: targetBanner[0].position === 1 ? '前台首頁' : targetBanner[0].position,
      start_time: dayjs(targetBanner[0].start_time),
      end_time: dayjs(targetBanner[0].end_time),
      img: [targetBanner[0].img],
    })
  }

  // 點擊新建刪除
  const handleCreateModalDelete = (id) => {
    let targetBanner = bannerPreList.filter(banner => banner.id !== id)
    setBannerPreList(targetBanner)
  }

  // 點擊編輯確認
  const handleEditModalOk = async (values) => {
    const adminToken = localStorage.getItem('adminToken')
    setConfirmLoading(true);
    try {
      const res = await editBanner({adminToken, bannerControlId, ...values})

      if (res === 1) {
        setOpenEditModal(false);
        setConfirmLoading(false);
      }

      setTimeout(async () => {
        setSearchLoading(true)
        let { data, total } = await getBanners(adminToken, current, pageSize, params)
        setBannerTotal(total)
        data = data.map(banner => {
          return ({
            ...banner,
            key: banner.id
          })
        })
        
        if (data) {
          setBannerList(data)
          setSearchLoading(false)
        }
      }, 0)
    } catch (error) {
      console.log(error)
    }
  }

  // 點擊搜尋欄位查詢按鈕
  const handleClickSearch = async (params) => {
    const adminToken = localStorage.getItem('adminToken')
    setSearchLoading(true)
    try {
      let { data, total } = await getBanners(adminToken, 1, pageSize, params)
      setBannerTotal(total)
      data = data.map(banner => {
        return ({
          ...banner,
          key: banner.id
        })
      })
      
      if (data) {
        setBannerList(data)
        setSearchLoading(false)
        setCurrent(1)
        setParams(params)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 點擊搜尋欄位重置按鈕
  const handleClickReset = async () => {
    const adminToken = localStorage.getItem('adminToken')
    setSearchLoading(true)
    setParams({})

    try {
      let { data, total } = await getBanners(adminToken, 1, pageSize)
      setBannerTotal(total)
      data = data.map(banner => {
        return ({
          ...banner,
          key: banner.id
        })
      })
      
      if (data) {
        setBannerList(data)
        setSearchLoading(false)
        setCurrent(1)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 切換頁面
  const handleChangePage = async (page, size) => {
    const adminToken = localStorage.getItem('adminToken')
    setSearchLoading(true)
    setCurrent(page)
    setPageSize(size)
    try {
      let { data, total } = await getBanners(adminToken, page, size, params)
      setBannerTotal(total)
      data = data.map(banner => {
        return ({
          ...banner,
          key: banner.id
        })
      })

      if (data) {
        setBannerList(data)
        setSearchLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 初始拿輪播列表
  useEffect(() => {
    const getBannersAsync = async () => {
      setSearchLoading(true)
      const adminToken = localStorage.getItem('adminToken')
      if (!adminToken) {
        navigate('/login')
        return
      }

      try {
        let { data, total } = await getBanners(adminToken, current, pageSize)
        setBannerTotal(total)
        data = data.map(banner => {
          return ({
            ...banner,
            key: banner.id
          })
        })

        if (data) {
          setBannerList(data)
          setSearchLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getBannersAsync()
  },[navigate, current, pageSize])

  return (
    <>
      <div className="mainContainer">
        <LeftContainer banner={bannerActive}></LeftContainer>

        <BannerContainer bannerList={bannerList} showStatusModal={handleShowStatusModal} showDeleteModal={handleShowDeleteModal} showCreateModal={handleShowCreateModal} showEditModal={handleShowEditModal} bannerCount={bannerList.length} onClickSearch={handleClickSearch} onClickReset={handleClickReset} confirmLoading={confirmLoading} searchLoading={searchLoading} current={current} onChangePage={handleChangePage} bannerTotal={bannerTotal} pageSize={pageSize}></BannerContainer>
        
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
              <Button key='0' form="createForm" onClick={handleCancelCreateModal}>
                  取消
              </Button>
              ,
              <Button key='1' type='primary' htmlType="submit" loading={confirmLoading} onClick={handleCreateModalOk}>
                  確認
              </Button>
              ]
            }
            className="banner-create-modal"
            width={1100}
          >
            <ProCard
              split='vertical'
              bordered
              className='create-modal-proCard-container'
            >
              <ProCard colSpan="40%" className='create-modal-leftCard'>
                <div>
                  <Form
                    {...formItemLayout}
                    form={createForm}
                    id="createForm"
                    name="createForm"
                    onFinish={handleCreateModalAdd}
                    layout="vertical"
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
                        <Tooltip placement="top" title="图片格式限为.jpg/.png/.gif，图片须小于2M，图片最佳显示大小为：1600*586" className="create-modal-img-tooltip">
                          <QuestionCircleOutlined />
                        </Tooltip>
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
                    <Button type="primary" htmlType="submit" onClick={handleCreateModalAdd}>
                      添加
                    </Button>
                  </Form>
                </div>
              </ProCard>
              <ProCard className="create-modal-rightCard">
                <div>
                  <ProTable 
                    tableClassName="rightCard-table"
                    columns={columns}
                    dataSource={bannerPreList}
                    search={false}
                    sticky={true}
                    scroll={{
                      x: 1200,
                    }}
                    pagination={false}
                  />
                </div>
              </ProCard>
            </ProCard>
          </Modal>
          <Modal // 編輯
            title="編輯"
            open={openEditModal}
            onCancel={() => setOpenEditModal(false)}
            footer={
              [
              <Button key='0' form="editForm" onClick={() => setOpenEditModal(false)}>
                  取消
              </Button>
              ,
              <Button key='1' form="editForm" type='primary' htmlType="submit" loading={confirmLoading}>
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