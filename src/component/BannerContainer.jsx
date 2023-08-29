import { Space, Table } from "antd"

const BannerContainer = ({ bannerList }) => {
  const columns = [
  {
    title: '排序',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '名稱',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '顯示位置',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
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
        <Table columns={columns} dataSource={bannerList}/>
      </div>
    </div>
  )
}

export default BannerContainer