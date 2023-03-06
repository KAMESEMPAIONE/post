import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrentRoles } from "./authSlice"

export const RequireAuth = ({ allowedRoles }) => {
    const roles = useSelector(selectCurrentRoles)
    if(!roles) return <Navigate to="/login" replace/>

    const res = roles.filter(role => allowedRoles.includes(role))
    if(!res?.length) return <Navigate to="/access-denied" replace/>

    return <Outlet/>
}