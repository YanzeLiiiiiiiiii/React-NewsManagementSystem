/* NewsDraft component  */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Space, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    UploadOutlined
} from '@ant-design/icons';


export default function NewsDraft() {
    const [modal, contextHolder] = Modal.useModal();
    const navigate = useNavigate()
    const [dataSource, setdataSource] = useState([])
    //get user info from local storage
    let { username } = JSON.parse(localStorage.getItem('token'));


    // get draft news from database and render the page
    useEffect(() => {
        axios({ url: `/news?auditState=0&_expand=category&author=${username}` }).then(

            re => {

                setdataSource(re.data)
            })
    }, [username])

    //Submit
    const handleSubmit = (id) => {
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(re => {
            navigate('/audit-manage/list')

            //antd notification
            notification.info({

                message: `Notification`,
                description:
                    `Your operation has been saved, you can check it in the audit`,
                placement: 'bottomRight'
            });


        })
    }

    //render pange
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: id => <b>{id}</b>
        },
        {
            title: 'Title',
            dataIndex: 'Title',
            render: (Title, item) => {
                return <a href={`/news-manage/preview/:${item.id}`}>{Title}</a>
            }

        },
        {
            title: 'Author',
            dataIndex: 'author',

        },
        {
            title: 'Category',
            dataIndex: 'category',
            render: category => category.title
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
                            navigate(`/news-manage/update/${item.id}`)
                        }} />

                        <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => {
                            handleSubmit(item.id)
                        }} />
                    </Space>

                </div >
            }
        }
    ]

    //delete the specific right then updating the page and database
    const confirm = (item) => {
        modal.confirm({
            title: 'Do you want to remove this new?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Confirm',
            cancelText: 'Cancle',

            onOk: () => {
                const list = dataSource.filter(ele => ele.id !== item.id)
                setdataSource(list)
                axios({
                    url: `/news/${item.id}`,
                    method: 'DELETE'
                })

            }
        })


    }



    return (

        <div>

            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} />
            {contextHolder}
        </div>
    )
}
