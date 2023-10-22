/* PublishList component  */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button } from 'antd'

export default function PublishList(props) {

    const [dataSource, setdataSource] = useState()

    //button map
    const typeList = ['', 'publish', 'sunset', 'delete'];

    const { username } = JSON.parse(localStorage.getItem('token'))

    //get data base on the publishState and render the page 
    let stateNumber = props.state
    useEffect(() => {
        axios(`/news?author=${username}&publishState=${stateNumber}&_expand=category`).then(
            re => {
                setdataSource(re.data)
            }
        )
    }, [username, stateNumber])

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
            title: ' Operate',
            render: (item) => {
                return (
                    <Button danger={stateNumber === 2 ? true : false} type='primary' onClick={() => {
                        handleclick(stateNumber, item);
                    }}>{typeList[stateNumber]}</Button>
                )
            }
        }


    ]


    const handleclick = (stateNumber, item) => {
        setdataSource(dataSource.filter(data => data.id !== item.id));
        if (stateNumber === 1) {
            axios.patch(`/news/${item.id}`, { publishState: 2 });
        }
        else if (stateNumber === 2) {
            axios.patch(`/news/${item.id}`, { publishState: 3 });
        }
        else
            axios.delete(`/news/${item.id}`);
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

        </div>
    )
}
