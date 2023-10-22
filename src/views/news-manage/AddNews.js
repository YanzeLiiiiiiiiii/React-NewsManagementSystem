import { Steps, Button, Select, Form, Input, message, notification } from 'antd'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import style from './addNews.module.css'
import axios from 'axios';
import NewsContenEditor from '../../components/news-manage'
const { Option } = Select;


export default function AddNews() {
    const navigate = useNavigate();
    // prograss bar
    const [current, setCurrent] = useState(0)

    //render option
    const [categories, setcategories] = useState([])
    //save input value
    const [inputValue, setinputValue] = useState({})
    //save editor value

    const [editorValue, seteditorValue] = useState(" ")

    //Validate and save the input
    const formInput = useRef(null)

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    //Button operation
    const next = useCallback(() => {

        if (current === 0) {
            formInput.current.validateFields().then(re => {
                setinputValue(re)
                setCurrent(current + 1)
            }).catch(err => { console.log(err) })
        } else {
            if (editorValue === " " || editorValue.trim() === '<p></p>') {
                message.error('Can not leave the empty')
            } else {
                setCurrent(current + 1)
            }

        }


    }, [current, editorValue])


    const previous = useCallback(() => {
        setCurrent(current - 1)
    }, [current])

    //get select option data
    useEffect(() => {
        axios({
            url: '/categories'

        }).then(re => {
            setcategories(re.data)
        })

    }, [])



    //save draft && and submit clicking event
    const userInfo = JSON.parse(localStorage.getItem('token'))
    const handleSave = (state) => {
        axios({
            url: '/news',
            method: 'post',
            data: {
                ...inputValue,
                "content": editorValue,
                "region": userInfo.region ? userInfo.region : 'Global',
                "author": userInfo.username,
                "roleId": userInfo.roleId,
                "auditState": state,
                "publishState": 0,
                "createTime": Date.now(),
                "star": 0,
                "view": 0
            }
        }).then(re => {
            console.log(re)
            navigate(state === 1 ? '/audit-manage/list' : '/news-manage/draft')

            //antd notification
            notification.info({

                message: `Notification`,
                description:
                    `Your operation has been saved, and you can check the news in ${state === 0 ? 'draft box' : 'Audit List'}`,
                placement: 'bottomRight'
            });

        })
    }


    return (
        <div>
            <div style={{ fontSize: '1.75rem', marginBottom: '3rem' }}>AddNews</div>
            <Steps
                current={current}
                items={[
                    {
                        title: 'Basic Information',
                        description: 'Add title, categery',
                    },
                    {
                        title: 'Add content',
                        description: 'Add contents',
                    },
                    {
                        title: 'Submit News',
                        description: 'Save draft & Submit news',
                    },
                ]}
            />

            {/* Add news content form */}
            <div className={style.conentForm}>
                {/* tile and Categoey input  */}
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        size='large'
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        style={{
                            maxWidth: 1200,
                        }}
                        //save input 
                        ref={formInput}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}

                    >
                        <Form.Item
                            label="Title"
                            name="Title"
                            rules={[{ required: true, message: "Complete the form " }]}
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item name="categoryId" label="category" rules={[{ required: true, message: "Complete the form " }]}>
                            <Select
                                placeholder="Select the catergery of news"

                                allowClear
                            >
                                {
                                    categories.map(item => {
                                        return <Option value={item.id} key={item.id}>{item.title}</Option>

                                    })

                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                offset: 4,
                                span: 20,
                            }}
                        >
                        </Form.Item>
                    </Form>
                </div>


                <div className={current === 1 ? '' : style.active}>
                    {/* React Editor */}
                    <NewsContenEditor getEditor={(value) => {
                        seteditorValue(value)
                    }}></NewsContenEditor>
                </div>
                <div className={current === 2 ? '' : style.active}>3</div>
                <div>
                    {
                        current === 2 &&
                        <span>
                            <Button onClick={() => {
                                handleSave(0)
                            }}>Save Draft</Button>
                            <Button onClick={() => {
                                handleSave(1)
                            }}>Submit</Button>
                        </span>
                    }
                    {
                        current > 0 && <Button onClick={previous}> Previous </Button>
                    }
                    {
                        current < 2 && <Button onClick={next}> Next </Button>
                    }
                </div>
            </div>

        </div>
    )
}
