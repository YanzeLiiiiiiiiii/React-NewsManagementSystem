// This is Login page 
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, message } from 'antd';
import ParticlesBg from 'particles-bg'
import './index.css'


export default function Index() {
    const navigate = useNavigate()

    const onFinish = (values) => {
        console.log('Success:', values);
        //Use json server to simulate login request function
        axios({
            url: `/users?username=${values.username}&password=${values.password}&_expand=role&roleState=true`
        }).then(res => {
            if (res.data.length === 0) {
                message.error('check the username and password');
            }
            else {
                // console.log(res.data[0]);
                localStorage.setItem('token', JSON.stringify(res.data[0]))
                navigate('/')
            }
        })
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <div style={{ height: '100%' }}>
            <ParticlesBg type="circle" bg={true} />
            <div className='LoginForm'>
                <Form
                    size='large'
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}


                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>



                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div>
    )
}
