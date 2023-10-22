import React from 'react'
import { Outlet } from 'react-router-dom'
import { connect } from 'react-redux'
import { Spin } from 'antd'

function NewsRouter(props) {
    return (
        <Spin size='large' spinning={props.isloading}>
            <Outlet />
        </Spin>
    )

}



export default connect(
    state => ({
        isloading: state.loadingReducer.isLoading,
    })
)(NewsRouter)
