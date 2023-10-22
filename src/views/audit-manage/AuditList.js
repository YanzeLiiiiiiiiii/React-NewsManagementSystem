/* Permission component  */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Tag, notification } from 'antd'
import { useNavigate } from 'react-router-dom'


export default function Permission() {
    const [modal, contextHolder] = Modal.useModal();

    const [dataSource, setdataSource] = useState([])

    const { username } = JSON.parse(localStorage.getItem('token'))

    const navigate = useNavigate()

    //get aucdit list from database and render the page 
    useEffect(() => {
        axios({ url: `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category` }).then(re => {

            setdataSource(re.data)
        })
    }, [username])

    //map the audit state
    const auditStateList = [
        '', 'Reviewing', 'Passed', 'Rejected'
    ]
    const auditStateColor = [
        '', 'volcano', 'green', 'red'
    ]

    const columns = [
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
            title: 'AuditState',
            dataIndex: 'auditState',
            render: auditState => <Tag color={auditStateColor[auditState]}>{auditStateList[auditState]}</Tag>
        },
        {


            title: 'Operate',
            render: (item) => {
                return <div style={{ padding: '0 5px' }}>

                    {item.auditState === 1 && <Button type="dashed" danger onClick={() => {
                        handleCancle(item)
                    }} >Cancel</Button>}

                    {item.auditState === 2 && <Button type="primary" default onClick={() => {
                        handlePublish(item.id)
                    }} >Upload</Button>}


                    {item.auditState === 3 && <Button type="primary" onClick={() => {
                        navigate(`/news-manage/update/${item.id}`)
                    }}>Update</Button>}
                </div >
            }
        }
    ]

    //cancle operation
    const handleCancle = (item) => {
        setdataSource(dataSource.filter(ele => ele.id !== item.id))
        axios.patch(`/news/${item.id}`, { auditState: 0 }).then(re => {
            navigate('/news-manage/draft')
            //antd notification
            notification.info({

                message: `Notification`,
                description:
                    `Your operation has been saved, and you can check it in the draft box `,
                placement: 'bottomRight'
            });
        })
    }

    //upload the news
    const handlePublish = (id) => {
        axios({
            url: `/news/${id}`,
            method: 'patch',
            data: {
                publishState: 2,
                publishTime: Date.now()
            }
        }).then(re => {

            navigate('/publish-manage/published')

            //antd notification
            notification.info({
                message: `Notification`,
                description:
                    `Your operation has been saved, and you can check it in unpublished page`,
                placement: 'bottomRight'
            });

        })
    }


    return (

        <div>

            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}
                pagination={
                    {
                        pageSize: 5,
                        style: { display: 'flex', justifyContent: 'center', margin: '1rem ' }
                    }
                }
            />

            {contextHolder}
        </div>
    )
}
