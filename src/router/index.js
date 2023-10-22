//Control all routes configuration
import axios from 'axios'
import Login from '../views/Login'
import Home from '../views/home'
import { store } from '../redux/store'
import { Navigate } from 'react-router-dom'
import ContentHome from '../views/contentHome'
import PermissionList from '../views/permissionList/Permission'
import RoleList from '../views/permissionList/Role'
import UserList from '../views/user-manage'
import NotFound from '../views/NotFound'
import AddNews from '../views/news-manage/AddNews'
import NewsDraft from '../views/news-manage/NewsDraft'
import NewsCategory from '../views/news-manage/NewsCategory'
import NewsPreview from '../views/news-manage/NewsPreview'
import NewsUpdate from '../views/news-manage/NewsUpdate'
import Audit from '../views/audit-manage/Audit'
import AuditList from '../views/audit-manage/AuditList'
import Published from '../views/publish-manage/Published'
import UnPublished from '../views/publish-manage/UnPublished'
import Subset from '../views/publish-manage/Subset'
import News from '../views/guest/News'
import Details from '../views/guest/Detail'
//set axios baseURL

axios.defaults.baseURL = 'http://localhost:5000'

//set axios interceptor

axios.interceptors.request.use(function (config) {
    store.dispatch({ type: 'ChangeLoading', state: true })
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    store.dispatch({ type: 'ChangeLoading', state: false })
    return response;
}, function (error) {
    return Promise.reject(error);
});

//route table
const element = [
    {
        path: '/',
        element: localStorage.getItem('token') ? <Home /> : <Navigate to='/login' />,
        children: [
            {
                path: 'home',
                element: <ContentHome />
            },
            {
                path: '/',
                element: <ContentHome />
            },
            {
                path: 'user-manage/list',
                element: <UserList />
            },

            {
                path: 'right-manage/role/list',
                element: <RoleList />
            },
            {
                path: 'right-manage/right/list',
                element: <PermissionList />
            },
            {
                path: 'audit-manage/list',
                element: <AuditList />
            },
            {
                path: 'news-manage/add',
                element: <AddNews />
            },
            {
                path: 'news-manage/draft',
                element: <NewsDraft />
            },
            {
                path: 'news-manage/preview/:id',
                element: <NewsPreview />
            },
            {
                path: 'news-manage/update/:id',
                element: <NewsUpdate />
            },
            {
                path: 'news-manage/category',
                element: <NewsCategory />
            },

            {
                path: 'audit-manage/audit',
                element: <Audit />
            },
            {
                path: 'publish-manage/unpublished',
                element: <UnPublished />
            },
            {
                path: 'publish-manage/published',
                element: <Published />
            },
            {
                path: 'publish-manage/sunset',
                element: <Subset />
            },


            {
                path: '*',
                element: <Navigate to='NotFound' />
            },
            {
                path: 'NotFound',
                element: <NotFound />
            }

        ]

    },
    {
        path: '/login',
        element: <Login />

    },
    {
        path: 'news',
        element: <News />
    },
    {
        path: 'detail/:id',
        element: <Details />
    },


]
export default element