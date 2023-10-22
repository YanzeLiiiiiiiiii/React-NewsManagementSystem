/*  This is sideMenu page
    Antd used to for layout design
    axios used for the data requesting 

*/
import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import axios from 'axios'
import SubMenu from 'antd/lib/menu/SubMenu';
import MenuItem from 'antd/lib/menu/MenuItem';
import { useNavigate, useLocation } from 'react-router';
import { connect } from 'react-redux'

import {
    HomeOutlined,
    UserOutlined,
    TeamOutlined,
    EditOutlined,
    UnorderedListOutlined,
    UploadOutlined
} from '@ant-design/icons';

const iconList = {
    '/home': <HomeOutlined />,
    '/user-manage': <UserOutlined />,
    '/right-manage': <TeamOutlined />,
    '/publish-manage': <UploadOutlined />,
    '/audit-manage': <EditOutlined />,
    '/news-manage': <UnorderedListOutlined />,
}


const { Sider } = Layout;


//request data from database(mock by using json server)
function Index(props) {
    const navigate = useNavigate();
    const [collapsed] = useState(0);
    const [list, setList] = useState([])
    const location = useLocation()
    useEffect(() => {
        axios({
            url: '/rights?_embed=children'
        }).then(re => {
            setList(re.data)
        })
    }, [])
    let { role: { rights } } = JSON.parse(localStorage.getItem('token'));
    const userInfo = rights.checked ? rights.checked : rights
    const renderMenu = (list) => {
        return (
            list.map(item => {
                if (item.pagepermisson && userInfo?.includes(item.key)) {
                    if (item.children?.length > 0) {
                        return (
                            <SubMenu key={item.key} title={item.title} icon={iconList[item.key]}>
                                {renderMenu(item.children)}
                            </SubMenu>
                        )
                    } else {
                        return (
                            <MenuItem key={item.key} icon={iconList[item.key]} onClick={() => {
                                navigate(item.key)
                            }}>
                                {item.title}
                            </MenuItem>
                        )
                    }
                }
            })
        )
    }

    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapse}>
            <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                <div className="logo" onClick={() => {
                    navigate('/')
                }}>News System</div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[`${location.pathname}`]}
                        defaultOpenKeys={[`/${location.pathname.split('/')[1]}`]}
                    >
                        {renderMenu(list)}
                    </Menu>
                </div>


            </div>
        </Sider>
    )
}

export default connect(
    state => ({
        isCollapse: state.collapsedReducer.isCollapse
    })

)(Index) 