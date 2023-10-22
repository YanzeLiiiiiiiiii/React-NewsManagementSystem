/* Permission component  */
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Space, Switch } from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined

} from '@ant-design/icons';
import Adduser from '../../components/user-manage/AddUserForm.jsx'

export default function Permission() {
    const [modal, contextHolder] = Modal.useModal();
    const [dataSource, setdataSource] = useState([])

    const addUser = useRef(null)

    const updateUser = useRef(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdateOpen, setIsUpdate] = useState(false)
    const [roleList, setRoleList] = useState([])
    const [isRegionDisable, setIsRegionDisable] = useState(true)
    const [regionList, setregionList] = useState([])
    //get login details from localstorage
    const { roleId, reigon, username } = JSON.parse(localStorage.getItem('token'))
    const columns = [
        {
            title: 'Area',
            dataIndex: 'region',
            render: (region) => {
                return <p>{region === '' ? 'Global' : region}</p>
            }

        },
        {
            title: 'RoleName',
            dataIndex: 'role',
            render: (role) => {
                return <p>{role?.roleName}</p>
            }

        },
        {
            title: 'UserName',
            dataIndex: 'username',

        },
        {
            title: 'UserStatus',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} onChange={() => {
                    handelChange(item)
                }} />
            }

        },
        {
            title: 'Operate',
            render: (item) => {
                return <div style={{ padding: '0 5px' }}>
                    <Space>

                        <Button type="primary" shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={() => {
                            confirm(item)
                        }} />

                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => { showUpdate(item) }} />

                    </Space>

                </div >
            }
        }
    ]


    //get role data 
    useEffect(() => {
        const roleObj = {
            '1': 'superadmin',
            '2': 'admin',
            '3': 'editor',
        }
        axios({ url: '/users?_expand=role' }).then(re => {
            re.data[0].children = ''
            const list = re.data
            setdataSource(roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(ele => ele.username === username),
                ...list.filter(ele => ele.reigon === reigon && roleObj[ele.roleId] === 'editor')
            ])
        })
    }, [roleId, reigon, username])

    //get role list
    useEffect(() => {
        axios({ url: '/roles' }).then(re => {
            setRoleList(re.data)
        })
    }, [])


    //get region list 
    useEffect(() => {
        axios({ url: '/regions' }).then(re => {
            setregionList(re.data)
        })
    }, [])



    //Add user modal
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);

        // get data from adduser form component
        addUser.current.validateFields().then(re => {
            axios({
                url: '/users',
                method: 'POST',
                data: {
                    ...re,
                    'roleState': true,
                    'default': false
                }

            }).then(res => {
                setdataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === re.id)[0]
                }])
            }).catch(err => { console.log(err) })
        })

    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };


    //change state
    const handelChange = (item) => {
        item.roleState = !item.roleState
        setdataSource([...dataSource])
        axios.patch(`http://localhost:5000/users/${item.id}`, {
            roleState: item.roleState
        })
    }

    //delete the specific right then updating the page and database
    const confirm = (item) => {
        modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            okText: 'Confirm',
            cancelText: 'Cancle',

            onOk: () => {
                const list = dataSource.filter(ele => ele.id !== item.id)
                setdataSource(list)
                axios({
                    url: `/users/${item.id}`,
                    method: 'DELETE'
                })


            }
        })


    }

    //Update user modal
    const showUpdate = (item) => {
        setTimeout(() => {
            if (item.roleId === 1) {
                setIsRegionDisable(true)
            } else {
                setIsRegionDisable(false)
            }
            updateUser?.current?.setFieldsValue(item)
            setIsUpdate(true)
        }, 0);
    };

    const handleUpdate = () => {
        setIsModalOpen(false);

        // get data from adduser form component
        updateUser.current.validateFields().then(re => {
            axios({
                url: '/users',
                method: 'POST',
                data: {
                    ...re,
                    'roleState': true,
                    'default': false
                }

            }).then(res => {
                setdataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === re.id)[0]
                }])
            }).catch(err => { console.log(err) })
        })

    };


    const updateCancle = () => {
        setIsUpdate(false);
    };

    return (

        <div >

            <Button type="primary" onClick={showModal}>Add User </Button>
            <Modal title="Add User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {/* Add user form */}
                <Adduser ref={addUser} roleList={roleList} regionList={regionList} />
            </Modal>
            <Modal title="Update User" open={isUpdateOpen} onOk={handleUpdate} onCancel={updateCancle}>
                {/* Update user form */}
                <Adduser ref={updateUser} roleList={roleList} regionList={regionList} isRegionDisable={isRegionDisable} />
            </Modal>

            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}
                pagination={
                    {
                        pageSize: 5,
                        style: { display: 'flex', justifyContent: 'center', margin: '0.75rem,0' }
                    }
                }
            />
            {contextHolder}

        </div>
    )
}
