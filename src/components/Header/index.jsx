//Top header 
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import collapse from '../../redux/action/collapse'
import { connect } from 'react-redux'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Button, theme, Dropdown, Space, Avatar } from 'antd';
const { Header } = Layout;

function Index(props) {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate();

    const [open, setOpen] = useState(false)



    const {
        token: { colorBgContainer },
    } = theme.useToken()
    const { username } = JSON.parse(localStorage.getItem('token'))

    const handleMenuClick = (e) => {
        localStorage.removeItem('token')
        navigate('/login')
    }
    const handleOpenChange = (flag) => {
        setOpen(flag);

    }
    const items = [

        {
            label: 'Logout',
            key: '1',
        }

    ];
    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
            }}
        >
            <Button
                type="text"
                icon={props.isCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => {
                    props.collapse()

                }}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <span style={{ float: 'right', margin: '0 5vh 0' }}>
                <span>Welcom<span style={{ fontWeight: '700', padding: '5px', color: "#1891ff" }}>{username}</span></span>
                <Dropdown
                    menu={{
                        items,
                        onClick: handleMenuClick,
                    }}
                    onOpenChange={handleOpenChange}
                    open={open}
                >
                    < span onClick={(e) => e.preventDefault()}>
                        <Space style={{ padding: '0 2vh' }}>
                            <Avatar size="large" icon={<UserOutlined />} />
                        </Space>
                    </span >
                </Dropdown>
            </span>

        </Header>
    )
}
export default connect(
    state => ({
        isCollapse: state.collapsedReducer.isCollapse
    }),
    {
        collapse
    }
)(Index) 