/* Permission component  */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Tag, Button, Modal, Space, Switch, Popover } from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';


export default function Permission() {
    const [modal, contextHolder] = Modal.useModal();

    const [dataSource, setdataSource] = useState([])



    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: id => <b>{id}</b>
        },
        {
            title: 'Title',
            dataIndex: 'title',

        },
        {
            title: 'Path',
            dataIndex: 'key',
            render: Path => <Tag color='volcano'>{Path}</Tag>
        },
        {
            title: 'Operate',
            render: (item) => {
                return <div style={{ padding: '0 5px' }}>
                    <Space>
                        <Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            confirm(item)
                        }} />
                        <Popover title="Permission" content={<Switch checked={item.pagepermisson} onChange={() => {
                            onChange(item)
                        }} />} trigger={item.pagepermisson === undefined ? '' : 'click'}>

                            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
                        </Popover>
                    </Space>

                </div >
            }
        }
    ]
    const onChange = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        setdataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }

    }
    //delete the specific right then updating the page and database
    const confirm = (item) => {
        modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            okText: 'Confirm',
            cancelText: 'Cancle',

            onOk: () => {
                if (item.grade === 1) {
                    const list = dataSource.filter(ele => ele.id !== item.id)
                    setdataSource(list)
                    axios({
                        url: `/rights/${item.id}`,
                        method: 'DELETE'
                    })
                } else {
                    const list = dataSource.filter(data => data.id === item.rightId)
                    list[0].children = list[0].children.filter(data => data.id !== item.id);
                    setdataSource([...dataSource])
                    axios({
                        url: `/children/${item.id}`,
                        method: 'DELETE'
                    })
                }

            }
        })


    }



    //get right list from database and render the page 
    useEffect(() => {
        axios({ url: '/rights?_embed=children' }).then(re => {
            re.data[0].children = ''
            setdataSource(re.data)
        })
    }, [])

    return (

        <div>

            <Table dataSource={dataSource} columns={columns} />
            {contextHolder}
        </div>
    )
}
