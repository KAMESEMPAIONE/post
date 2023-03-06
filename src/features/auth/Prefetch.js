import { store } from "../../app/store"
import { postsApiSlice } from "../posts/postsApiSlice"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

export const Prefetch = () => {

    useEffect(() => {
        store.dispatch(postsApiSlice.util.prefetch('getAllPosts', 'postsList', { force: true }))
    }, [])

    return <Outlet/>
}