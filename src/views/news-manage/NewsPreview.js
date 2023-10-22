import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Descriptions, Button, Space } from 'antd';
import axios from 'axios';
import moment from 'moment'
export default function NewsPreview() {
    //Save the specific new's info
    const [newsInfo, setnewsInfo] = useState(null)


    let { id } = useParams()
    useEffect(() => {
        axios.get(`/news/${id.substring(1)}?_expand=category&_expand=role`).then(re => {
            setnewsInfo(re.data)
        })
    }, [id])

    const auditList = ['Queing', 'Under Review', 'Review passed ', 'Rejected']
    const publishList = ['Queing', 'Under Publish', 'Publish passed ', 'Rejected']
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
            key: '5',
            label: 'AuditState',
            children: auditList[newsInfo?.auditState],
        },
        {
            key: '6',
            label: 'view',
            children: newsInfo?.view,
        },
        {
            key: '6',
            label: 'publishState',
            children: publishList[newsInfo?.publishState],
        }
    ]
    return (
        <div>
            <Space wrap>
                <Descriptions title={newsInfo?.Title} items={items} />
                <div>
                    <h3> Content</h3>
                    <div dangerouslySetInnerHTML={{ __html: newsInfo?.content }} style={{ border: '1px solid black', width: '45rem', height: '12rem' }}></div>
                    <Button onClick={() => {
                        navigate(-1)
                    }}> Back </Button>
                </div>
            </Space>

        </div>

    )
}
