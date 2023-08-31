import { Badge, Button, Space, Table } from "antd"

const BannerContainer = ({ bannerList, showStatusModal, showDeleteModal,showCreateModal, showEditModal }) => {
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
    title: '創建時間',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 200,
  },
  {
    title: '創建人',
    dataIndex: 'creator',
    key: 'creator',
    width: 130,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      if (status === 1) {
        return (
          <Badge status="success" text="啟用" />
        )
      } else if (status === 0) {
        return (
          <Badge status="error" text="禁用" />
        )
      }
    },
    width: 100,
  },
  {
    title: '圖片',
    dataIndex: 'img',
    key: 'img',
    width: 230,
    render: (img) => <img src={img} alt="img" className="banner-table-img"/>
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
    dataIndex: 'status',
    key: 'action',
    fixed: 'right',
    render: (status, record) => (
      <Space size="middle">
        {status === 0? 
          <Button type="link" className="banner-table-btn" onClick={() => showStatusModal?.(status, record.id)}>啟用</Button>: 
          <Button type="link" danger className="banner-table-btn" onClick={() => showStatusModal?.(status, record.id)}>禁用</Button>
        }
        <Button type="link" className="banner-table-btn" onClick={() => showEditModal?.(record.id)}>編輯</Button>
        <Button type="link" danger className="banner-table-btn" onClick={() => showDeleteModal?.(record.id)}>刪除</Button>
      </Space>
    ),
    width: 180,
  },
];

  return (
    <div className="bannerContainer">
      <div className="bannerContainer-header">
          <div className="header-content">輪播圖設置</div>
      </div>
      {/* <div className="bannerContainer-search">

      </div> */}
      <div className='bannerContainer-banner'>
        <Button type='primary' onClick={() => showCreateModal?.()} className="bannerContainer-banner-create">
          新建
        </Button>
        <Table 
          className="bannerContainer-banner-table"
          columns={columns} 
          dataSource={bannerList} 
          scroll={{
            x: 1200,
            y: 500,
          }}
        />
      </div>
    </div>
  )
}

export default BannerContainer