/* Guest component */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Col, Row, Layout, Typography, List } from 'antd';
import _ from 'lodash';
export default function News() {
    const { Header } = Layout;
    const { Title } = Typography;
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        axios.get('/news?_expand=category&publishState=2').then(
            re => {

                setDataSource(Object.entries(_.groupBy(re.data, item => item.category.title)));
            }
        )
    }, [])
    console.log(dataSource)
    return (

        <div style={{ width: '80%', margin: '0 auto' }}>
            <Header style={{ backgroundColor: 'white' }}>
                <Title level={2}>News System</Title>

            </Header>
            <Row gutter={[10, 10]}>
                {dataSource?.map(item => {
                    return (
                        <Col span={8} key={item[0]}>

                            <Card bordered={false} >
                                <List
                                    size="small"
                                    header={<h2 style={{ fontWeight: 'bold' }}>{item[0]}</h2>}
                                    bordered
                                    dataSource={item[1]}
                                    renderItem={(data) => <List.Item><a href={`/detail/${data.id}`}>{data.Title}</a></List.Item>}
                                />
                            </Card>
                        </Col>
                    )
                })}

            </Row>
        </div>
    )
}
