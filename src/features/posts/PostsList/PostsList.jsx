import { useSelector } from "react-redux"
import { useGetAllPostsQuery, useDeletePostMutation } from "../postsApiSlice"
import { selectAllPosts } from "../postsApiSlice"
import { selectCurrentRoles, selectCurrentId } from "../../auth/authSlice"
import { Link } from "react-router-dom"
import { PuffLoader } from "react-spinners"
import { AiFillEdit, AiFillCloseSquare } from "react-icons/ai"
import "./PostsLists.scss"

export const PostsList = ({postByAuthor}) => {
    const { isSuccess, isLoading, isError, error } = useGetAllPostsQuery()
    let posts = useSelector(selectAllPosts)

    const userId = useSelector(selectCurrentId)
    const userRoles = useSelector(selectCurrentRoles)

    if(postByAuthor) {
      posts = posts.filter(post => post.author === userId)
    }

    const [deletePost] = useDeletePostMutation()

    const handleDelete = async ({postId}) => {
        try {
            if(window.confirm('Delete this post?')) {
                await deletePost({ postId }).unwrap()
            }
        } catch (err) {
            console.log(err)
        }
    }

    let content

    if(isLoading) {
        content = (
            <section className="PostsList-loading">
                <PuffLoader/>
            </section>
        )
    }

    if(isError) {
        if(error.status === 204) {
            return (<section className="PostsList-error">
                <p>There are no posts</p>
            </section>)
        }

        content = (
            <section className="PostsList-error">
                <p>{error?.data}</p>
            </section>
        )
    }

    if(isSuccess) {
        if(!posts.length) {
            return (<section className="PostsList-error">
                <p>You have not created any post yet</p>
            </section>)
        }

        content = posts.map(post => {
            const permissionToDelete = userRoles.includes('Admin') || userId === post.author
            const permissionToUpdate = userId === post.author


            const created = new Date(post.createdAt).toLocaleString('en-GB')
            const updated = new Date(post.updatedAt).toLocaleString('en-GB')

            const date = post.createdAt === post.updatedAt ?
                        <time>Created at: {created}</time> :
                        <time>Updated at: {updated}</time>

            const postContent = post.body.length > 200 ?
                    `${post.body.slice(0, 200)}...` :
                     post.body

            return (
                <article key={post.id} className="PostsList__post">
                    <Link to={`/posts/${post.id}`} className="PostsList__title-link">
                        <h2 className="PostsList__title">{post.title}</h2>
                    </Link>

                    {permissionToUpdate &&
                        <Link to={`/posts/${post.id}/edit`} className="PostsList__edit">
                            <AiFillEdit/>
                        </Link>
                    }

                    {permissionToDelete &&
                        <AiFillCloseSquare
                            onClick={() => handleDelete({postId: post.postId})}
                            className="PostsList__delete"
                        />
                    }


                    <p className="PostsList__body">{postContent}</p>

                    <div className="PostsList__cred">
                        <cite>Author: {post.authorName}</cite>
                        {date}
                    </div>
                </article>
            )
        })
    }

    return (
        <section className="PostsList">
            {content}
        </section>
    )
}