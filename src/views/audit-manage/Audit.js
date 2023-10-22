/* Permission component  */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button, Modal } from 'antd'
import {
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';


export default function Audit() {
    const [modal, contextHolder] = Modal.useModal();

    const [dataSource, setdataSource] = useState([])

    const { roleId, reigon, username } = JSON.parse(localStorage.getItem('token'))



    //get aucdit list from database and render the page 
    useEffect(() => {
        const roleObj = {
            '1': 'superadmin',
            '2': 'admin',
            '3': 'editor',
        }

        axios({ url: '/news?auditState=1&_expand=category' }).then(re => {

            const list = re?.data
            setdataSource(roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(ele => ele.author === username),
                ...list.filter(ele => ele.reigon === reigon && roleObj[ele.roleId] === 'editor')
            ])
            // console.log(list)
        }).catch(err => {
            console.log(err)
        })
    }, [roleId, reigon, username])


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


            title: 'Operate',
            render: (item) => {
                return <div style={{ padding: '0 5px' }}>
                    <Button type='primary' shape='circle' icon={<CheckOutlined />} onClick={() => { handlePublish(item, 2, 1) }} ></Button>
                    <Button type='primary' shape='circle' danger icon={<CloseOutlined />} onClick={() => { handlePublish(item, 3, 0) }} ></Button>
                </div >
            }
        },
    ]

    //handle the punblish operation
    const handlePublish = (item, auditState, publishState) => {
        setdataSource(dataSource.filter(ele => ele.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState,
            publishState
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
