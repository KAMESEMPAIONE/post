import {
    useGetAllPostsQuery,
    useDeletePostMutation,
    useAddCommentMutation,
} from "../postsApiSlice"
import {
    selectCurrentId,
    selectCurrentRoles,
} from "../../auth/authSlice"
import { useSelector } from "react-redux"
import { useState } from "react"
import { useNavigate, useParams, Link, Navigate } from "react-router-dom"
import { memo } from "react"
import { PuffLoader } from "react-spinners"
import { AiFillEdit, AiFillCloseSquare } from "react-icons/ai"
import { Comment } from "../Comment/Comment"
import "./Post.scss"

const Post = () => {
    const {postId} = useParams()

    const userId = useSelector(selectCurrentId)
    const userRoles = useSelector(selectCurrentRoles)

    const [comment, setComment] = useState('')

    const {post, ids} = useGetAllPostsQuery("postsList", {
        selectFromResult: ({data}) => ({
            post: data?.entities[postId],
            ids: data?.ids
        }),
    })

    const [deletePost] = useDeletePostMutation()
    const [addComment] = useAddCommentMutation()
    const navigate = useNavigate()

    const handleDelete = async ({postId}) => {
        try {
            if (window.confirm('Delete this post?')) {
                await deletePost({postId}).unwrap()
                navigate('/posts')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault()

        if (!comment || comment.length > 512) {
            return
        }

        try {
            await addComment({id: postId, body: comment}).unwrap()
            setComment('')
        } catch (err) {
            console.log(err)
        }
    }

    if (ids) {
        if (!ids.includes(+postId)) {
            return <Navigate to="/not-found" replace/>
        }
    }

    if (!post) {
        return (
            <section className="Post-loading">
                <PuffLoader/>
            </section>
        )
    }


    if (post) {
        const permissionToDelete = userRoles.includes('Admin') || userId === post.author
        const permissionToUpdate = userId === post.author

        const created = new Date(post.createdAt).toLocaleString('en-GB')
        const updated = new Date(post.updatedAt).toLocaleString('en-GB')

        const date = post.createdAt === post.updatedAt ?
            <time>Created at: {created}</time> :
            <time>Updated at: {updated}</time>

        const commentsByAuthor = post.comments
            .slice()
            .filter(comment => comment.author === post.author)
            .sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })

        const commentsByRest = post.comments
            .slice()
            .filter(comment => comment.author !== post.author)
            .sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })


        return (
            <article className="Post">
                <div className="Post__content">
                    <h1 className="Post__title">{post.title}</h1>

                    { permissionToUpdate &&
                        <Link to={`/posts/${post.id}/edit`} className="Post__edit">
                            <AiFillEdit/>
                        </Link>
                    }

                    { permissionToDelete &&
                        <AiFillCloseSquare
                            onClick={() => handleDelete({postId: post.postId})}
                            className="Post__delete"
                        />
                    }

                    <div dangerouslySetInnerHTML={{__html: post.body}} className="Post__body">
                        {/*{post.body}*/}
                    </div>

                    <div className="Post__cred">
                        <cite>Author: {post.authorName}</cite>
                        {date}
                    </div>
                </div>

                <div className="Post__comments">
                    <div className="Post__comment-form">
                        <form onSubmit={handleCommentSubmit}>
                            <textarea
                                className="Post__textarea"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Leave a comment"
                                maxLength={512}
                            />

                            <button
                                className="Post__comment-button"
                                disabled={!comment}
                            >Comment
                            </button>
                        </form>
                    </div>

                    <div className="Post__comments-list">
                        {post.comments?.length
                            ?
                            [...commentsByAuthor, ...commentsByRest]
                                .map(comment => {
                                    return <Comment comment={comment} key={comment._id} postAuthor={post.author}/>
                                })
                            :
                            <p className="Post__noComments">There are no comments yet</p>
                        }
                    </div>
                </div>
            </article>
        )
    }
}

export const MemoizedPost = memo(Post)