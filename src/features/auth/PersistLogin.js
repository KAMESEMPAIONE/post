import { Outlet, Navigate} from "react-router-dom"
import { useRefreshMutation } from "./authApiSlice"
import { useSelector} from "react-redux"
import { selectCurrentToken } from "./authSlice"
import { usePersist } from "../../hooks/usePersist"
import { useState, useEffect, useRef } from "react"

export const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, { isUninitialized, isSuccess, isError}] = useRefreshMutation()


    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            console.log('persist login')
            console.log(persist)
            console.log(process.env.NODE_ENV)
            console.log("token before",token)
            const verifyRefreshToken = async () => {
                try {
                    const refToken = await refresh().unwrap()
                    console.log(refToken)
                    setTrueSuccess(true)
                } catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }
        console.log("token after",token)
        return () => effectRan.current = true
        // eslint-disable-next-line
    }, [])

    let content
    if (!persist) {
        content = <Outlet />
    } else if (isError) {
        content = <Navigate to="/login"/>
    } else if (isSuccess && trueSuccess) {
        content = <Outlet />
    } else if (token && isUninitialized) {
        content = <Outlet/>
    }

    return content
}