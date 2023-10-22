/* Category component  */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Modal, Button } from 'antd'



export default function NewsCategory() {
    const [modal, contextHolder] = Modal.useModal();

    const [dataSource, setdataSource] = useState([])


    //get aucdit list from database and render the page 
    useEffect(() => {
        axios({ url: `/categories` }).then(re => {
            setdataSource(re.data)
            console.log(re)
        })
    }, [])



    const columns = [
        {
            title: 'ID',
            dataIndex: 'id'

        },
        {
            title: 'Title',
            dataIndex: 'title',

        },

        {


            title: 'Operate',
            render: (item) => {
                return <div style={{ padding: '0 5px' }}>
                    <Button type="primary" danger ghost onClick={() => {
                        handleDelete(item.id)
                    }}>
                        Delete
                    </Button>
                </div >
            }
        }
    ]

    const handleDelete = (id) => {
        setdataSource(dataSource.filter(ele => ele.id !== id))
        axios.delete(`/categories/${id}`)
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
