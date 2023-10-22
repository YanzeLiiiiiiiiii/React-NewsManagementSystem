import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Descriptions, Button, Space } from 'antd';
import axios from 'axios';
import { HeartTwoTone } from '@ant-design/icons'
import moment from 'moment'
export default function Detail() {
    //Save the specific new's info
    const [newsInfo, setnewsInfo] = useState(null)


    let { id } = useParams()
    useEffect(() => {
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(re => {
            setnewsInfo(
                { ...re.data, view: re.data.view + 1 }
            )
            return re
        }).then(re => {
            axios.patch(`/news/${id}`, { view: re.data.view + 1 })
        })
    }, [id])
    const navigate = useNavigate()
    const items = [
        {
            key: '1',
            label: 'Author',
            children: newsInfo?.author,
        },
        {
            key: '2',
            label: 'Region',
            children: newsInfo?.region,
        },
        {
            key: '3',
            label: 'CreateTime',
            children: newsInfo?.createTime ? moment(newsInfo?.createTime).format('DD-MM-YYYY') : '-',
        },
        {
            key: '4',
            label: 'PublishTime',
            children: newsInfo?.publishTime ? moment(newsInfo?.publishTime).format('DD-MM-YYYY') : '-',
        },

        {
            key: '6',
            label: 'view',
            children: newsInfo?.view,
        },
        {
            key: '5',
            label: 'star',
            children: newsInfo?.star,
        },

    ]
    return (
        <div style={{ width: '80%', margin: '5% auto' }}>
            <Space wrap>
                <span>  <Descriptions title={newsInfo?.Title} items={items} /> </span>
                <div style={{ width: '100%', margin: '5% auto' }} >
                    <h3> Content <HeartTwoTone twoToneColor="#eb2f96" onClick={() => {
                        setnewsInfo(
                            { ...newsInfo, star: newsInfo.star + 1 }

                        )
                        axios.patch(`/news/${id}`, { star: newsInfo.star + 1 })

                    }} /></h3>
                    <div dangerouslySetInnerHTML={{ __html: newsInfo?.content }} style={{ border: '1px solid black', width: '100vh', height: '12rem' }}></div>
                    <Button onClick={() => {
                        navigate(-1)
                    }}> Back </Button>
                </div>
            </Space>

        </div>

    )
}
