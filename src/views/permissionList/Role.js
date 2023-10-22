/* Permission component  */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Space, Tree } from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';


export default function Permission() {
    const [modal, contextHolder] = Modal.useModal();

    const [dataSource, setdataSource] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [treeData, setTreeData] = useState([])

    const [currentTree, setCurrent] = useState()

    const [checkedId, setcheckedID] = useState()
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: id => <b>{id}</b>
        },
        {
            title: 'RoleName',
            dataIndex: 'roleName',

        },
        {
            title: 'Operate',
            render: (item) => {
                return <div style={{ padding: '0 5px' }}>
                    <Space>
                        <Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => {

                            confirm(item)
                        }} />
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {

                            showModal(item)
                            setCurrent(item.rights)
                            setcheckedID(item.id)
                        }} />
                        <Modal title="Roles List" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <Tree
                                checkable
                                treeData={treeData}
                                checkedKeys={currentTree}
                                onCheck={onCheck}
                                checkStrictly
                            />
                        </Modal>
                    </Space>

                </div >
            }
        }
    ]

    const confirm = (item) => {
        modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            okText: 'Confirm',
            cancelText: 'Cancle',

            onOk: () => {
                const list = dataSource.filter(ele => ele.id !== item.id)
                setdataSource(list)
                axios({
                    url: `/roles/${item.id}`,
                    method: 'DELETE'
                })

            }
        })


    }


    //get right list from database and render the page 
    useEffect(() => {
        axios({ url: '/roles' }).then(re => {
            re.data[0].children = ''
            setdataSource(re.data)
        })
    }, [])


    //open role list by chilcking change icon 
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setdataSource(dataSource.map(item => {
            if (item.id === checkedId) {
                return {
                    ...item,
                    rights: currentTree
                }
            }
            return item
        }))

        axios.patch(`/roles/${checkedId}`, {
            rights: currentTree
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    //tree data

    useEffect(() => {
        axios({
            url: '/rights?_embed=children'
        }).then(re => {

            setTreeData(re.data)
        })

    }, [])


    //update the checked
    const onCheck = (checkedKeysValue) => {
        setCurrent(checkedKeysValue)

    }

    return (

        <div>

            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} />
            {contextHolder}

        </div>
    )
}
