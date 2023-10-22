import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import * as echarts from 'echarts';
import axios from 'axios'
import _ from 'lodash';
const { Meta } = Card;


export default function Index() {
    const [viewList, setViewList] = useState()
    const [starList, setStarList] = useState([])
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
    const [open, setOpen] = useState(false);
    const echart = useRef()
    const [pieChart, setPieChart] = useState(null);
    const piechart = useRef()
    const [pieDataList, setPieDataList] = useState([]);
    useEffect(() => {
        Promise.all([
            axios.get('/news?auditState=2&_expand=category&_sort=view&_order=desc&_limit=6'),
            axios.get('/news?auditState=2&_expand=category&_sort=star&_order=desc&_limit=6'),
            axios.get('/news?publishState=2&_expand=category')
        ]).then(re => {
            setViewList(re[0].data)
            setStarList(re[1].data);
            //group the data base on the title
            renderChart(_.groupBy(re[2].data, item => item.category.title));
            setPieDataList(re[2].data.filter(item => item.author === username));
        })
        return (() => {
            window.onresize = null;
        })

    }, [username])

    //barchart initial

    const renderChart = (obj) => {
        var myChart = echarts.init(echart.current)
        var option = {
            title: {
                text: 'News Categories'
            },
            tooltip: {},
            legend: {
                data: ['Numbers']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {

                    interval: '0'
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: 'Numbers',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };
        myChart.setOption(option);
        // set the chart adaptive 
        window.onresize = () => {
            myChart.resize()
        }
    }


    //piechart initial
    const renderPieChart = () => {
        var myChart;
        if (!pieChart) {
            myChart = echarts.init(piechart?.current);
            setPieChart(myChart);
        } else {
            myChart = pieChart;
        }
        let nowList = _.groupBy(pieDataList, item => item?.category.title);

        let list = [];
        for (var key in nowList) {
            list.push({
                name: key,
                value: nowList[key].length
            })
        }

        myChart.setOption({
            title: {
                text: 'Personal News Categories',
                subtext: 'PieChart',
                left: 'right'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });


    }



    return (
        <div>
            <Row gutter={16} >
                <Col span={8}>
                    <Card title="Most Viewed" bordered={false} >
                        <List
                            size="small"
                            bordered
                            dataSource={viewList}
                            renderItem={(item) =>
                                <List.Item><a href={`/news-manage/preview/:${item?.id}`}>{item?.title}</a></List.Item>
                            }
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Most Liked " bordered={false}>
                        <List
                            size="small"
                            bordered
                            dataSource={starList}
                            renderItem={(item) =>
                                <List.Item><a href={`/news-manage/preview/:${item?.id}`}>{item?.title}</a></List.Item>
                            }
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        title="Profile" bordered={false}
                        style={{ width: 300 }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined onClick={() => {
                                setOpen(true)
                                setTimeout(() => {
                                    renderPieChart()
                                }, 0)
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                            title={username}
                            description={<div>
                                <p>Reigon: {region === '' ? 'Global' : region} </p>
                                <p>Role: {roleName}</p>
                            </div>}
                        />
                    </Card>
                </Col>
            </Row>


            {/* Chart */}

            <div ref={echart} style={{ width: '80%', height: '400px' }}>

            </div>

            {/* Drawer */}
            <Drawer title="Personal Category" placement="right" width={'500px'} height={'600px'} onClose={() => {
                setOpen(false);
            }} open={open}>
                <div ref={piechart} style={{ width: '100%', height: '100%' }}>
                </div>
            </Drawer>
        </div>
    )
}
