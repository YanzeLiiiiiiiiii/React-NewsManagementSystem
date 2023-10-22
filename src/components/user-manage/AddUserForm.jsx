/* This is add user form component that allows user to fill the form  */
import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Select, Input } from 'antd'

const AddUserForm = forwardRef((props, ref) => {
    const { Option } = Select;
    const [roleDisables, setDisabled] = useState(false)


    useEffect(() => {
        setDisabled(props.isRegionDisable)
    }, [props.isRegionDisable])

    return (
        <Form
            ref={ref}
            layout='vertical'
            style={{
                maxWidth: 600,

            }}
        >
            <Form.Item
                name="username"
                label="UserName"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="Area"
                rules={roleDisables ? [] : [
                    {
                        required: true,
                    },
                ]}
            >
                <Select disabled={roleDisables}>
                    {props.regionList.map(item => {
                        return <Option value={item.value} key={item.id}>{item.value}</Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="RoleName"

                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select onChange={(e) => {

                    if (e === 1) {
                        setDisabled(true)
                        ref.current.setFieldsValue({
                            region: ""
                        })
                    } else {
                        setDisabled(false)
                    }
                }}>
                    {props.roleList.map(item => {
                        return <Option value={item.id} key={item.id}>{item.roleName}</Option>
                    })}
                </Select>
            </Form.Item>

        </Form>
    )
}
)

export default AddUserForm