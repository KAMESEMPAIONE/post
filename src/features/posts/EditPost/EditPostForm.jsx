import {
    useUpdatePostMutation,
    useDeletePostMutation
} from "../postsApiSlice"
import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import "./EditPostForm.scss"

export const EditPostForm = ({post}) => {
    const [title, setTitle] = useState(post?.title || '')
    const [body, setBody] = useState(post?.body || '')
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        setErrMsg('')
    }, [title, body])

    const [updatePost] = useUpdatePostMutation()
    const [deletePost] = useDeletePostMutation()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(title.length < 4 || body.length < 12) {
            setErrMsg("Invalid entry")
            return
        }

        try {
            await updatePost({title, body, id: post.postId}).unwrap()
            alert("Post updated")
        } catch (err) {
            console.log(err)
            if(err?.status === 400) {
                setErrMsg('All fields required!')
            } else if (!err?.status) {
                setErrMsg('No Server Response')
            } else {
                setErrMsg('Failed')
            }
        }
    }

    const handleDelete = async () => {
        try {
            if(window.confirm('Delete this post?')) {
                await deletePost({ postId: post.postId }).unwrap()
                alert('Success post deleted!')
                navigate('/posts')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const errClass = errMsg ? "errmsg" : "offscreen"

    return (
        <section className="EditPost">
            <div className="EditPost__body">
                <p className={errClass}>{errMsg}</p>
                <h1 className="EditPost__title">Edit post</h1>

                <form onSubmit={handleSubmit} noValidate autoCorrect="off">
                    <input
                        className="EditPost__input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Post title"
                        minLength={4}
                        maxLength={96}
                    />

                    <textarea
                        className="EditPost__input"
                        type="text"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        placeholder="Post content"
                        minLength={12}
                        maxLength={16256}
                    />

                    <div className="EditPost__buttons">
                        <button
                            className="EditPost__button"
                            disabled={title.length < 4 || body.length < 12}
                        >Save</button>

                        <div
                            className="EditPost__button"
                            onClick={() => handleDelete()}
                        >Delete</div>
                    </div>

                </form>
            </div>
        </section>
    )
}