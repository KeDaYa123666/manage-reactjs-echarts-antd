import { Navigate } from 'react-router-dom'

export const RouterAuth = ({ children }) => {
    const token = localStorage.getItem('token')
    if (!token) {
        return <Navigate to='/login' replace />
    }
    return (
        children
    )
}

//路由守卫  当没有登陆时，无法跳转到其它页面，只能在登录页面