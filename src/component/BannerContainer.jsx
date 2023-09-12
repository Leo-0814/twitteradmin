import { PlusOutlined } from "@ant-design/icons";
import { ProFormDateRangePicker, ProFormSelect, ProFormText, ProTable, QueryFilter } from "@ant-design/pro-components";
import { Badge, Button, Space } from "antd"

const BannerContainer = ({ bannerList, showStatusModal, showDeleteModal,showCreateModal, showEditModal, onClickSearch, onClickReset, searchLoading, current, onChangePage, bannerTotal, pageSize, onClickReload }) => {
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
    ellipsis: true,
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
    sorter: true,
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
    sorter: true,
    width: 200,
  },
  {
    title: '結束時間',
    dataIndex: 'end_time',
    key: 'end_time',
    sorter: true,
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

      {/* 搜尋欄位 */}
      <div className="bannerContainer-search">
        <QueryFilter 
          defaultCollapsed={false} 
          onFinish={(params) => {onClickSearch?.(params)}} 
          onReset={() => onClickReset?.()}
          loading={searchLoading}
        >
          <ProFormText name="name" label="名稱" />
          <ProFormSelect
            name="position"
            label="顯示位置"
            valueEnum={{
              1: '前台首頁',
            }}
          />
          <ProFormDateRangePicker name="createDate" label="創建時間" />
          <ProFormSelect 
            name="status" 
            label="狀態" 
            valueEnum={{
              0: '禁用',
              1: '啟用',
            }}
          />
          <ProFormDateRangePicker name="startDate" label="顯示時間" />
        </QueryFilter>
      </div>

      {/* 表格 */}
      <div className='bannerContainer-banner'>
        <ProTable 
          tableClassName="bannerContainer-banner-table"
          columns={columns}
          dataSource={bannerList}
          request={ (params, sort, filter) => {
            return {
              data: bannerList,
              success: true,
            }
          }}
          loading={searchLoading}
          defaultCollapsed= {false}
          search={false}
          sticky={true}
          options= {{
            reload: () => onClickReload?.()
          }}
          toolBarRender={() => [
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => {
                showCreateModal?.();
              }}
              type="primary"
            >
              新建
            </Button>
          ]}
          scroll={{
            x: 1200,
          }}
          pagination={{
            current: current,
            onChange: ((page,pageSize) => onChangePage?.(page, pageSize)),
            total: bannerTotal,
            defaultPageSize: pageSize,
            defaultCurrent: 1,
            showSizeChanger: true,
            size: 'small',
          }}
        />
      </div>
    </div>
  )
}

export default BannerContainer