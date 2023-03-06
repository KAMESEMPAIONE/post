import { useParams, Navigate } from "react-router-dom"
import { PuffLoader } from "react-spinners"
import { useGetAllPostsQuery } from "../postsApiSlice"
import { useSelector } from "react-redux"
import { selectCurrentId, selectCurrentRoles } from "../../auth/authSlice"
import { EditPostForm } from "./EditPostForm"

export const EditPost = () => {
    const { postId } = useParams()
    const userId = useSelector(selectCurrentId)
    const userRoles = useSelector(selectCurrentRoles)

    const { post, ids } =  useGetAllPostsQuery("postsList", {
        selectFromResult: ({ data }) => ({
            post: data?.entities[postId],
            ids: data?.ids
        }),
    })

    if(ids) {
        if(!ids.includes(+postId)) {
            return <Navigate to="/not-found" replace/>
        }
    }

    if(!post) return <PuffLoader/>

    if(post) {
        if(post.author !== userId) {
            return <Navigate to="/access-denied" replace/>
        }
    }

    const content = <EditPostForm post={post}/>

    return content
}