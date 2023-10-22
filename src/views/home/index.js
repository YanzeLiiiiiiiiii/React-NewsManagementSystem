//This is Home Container
import React from 'react'
import TopHeader from '../../components/Header'
import SideMenu from '../../components/SideMenu'
import { Layout, theme } from 'antd';
import Router from '../../components/Router.jsx'
import './index.css'
const { Content } = Layout;

export default function Index() {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout>
                <TopHeader></TopHeader>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        overflow: 'auto'
                    }}
                >
                    <Router></Router>
                </Content>
            </Layout>


        </Layout>

    )
}
