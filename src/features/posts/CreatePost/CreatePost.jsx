import { useCreatePostMutation } from "../postsApiSlice"
import { useState, useEffect } from "react"
import "./CreatePost.scss"

export const CreatePost = () => {
    const [createPost] = useCreatePostMutation()

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        setErrMsg('')
    }, [title, body])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(title.length < 4 || body.length < 12) {
            setErrMsg("Invalid entry")
            return
        }

        try {
            await createPost({title, body}).unwrap()
            setTitle('')
            setBody('')
            alert("Post created")
        } catch (err) {
            if(err?.status === 400) {
                setErrMsg('All fields required!')
            } else if (!err?.status) {
                setErrMsg('No Server Response')
            } else {
                setErrMsg('Failed')
            }
        }
    }

    const errClass = errMsg ? "errmsg" : "offscreen"

    return (
        <section className="CreatePost">
            <div className="CreatePost__body">
                <p className={errClass}>{errMsg}</p>
                <h1 className="CreatePost__title">Create new post</h1>

                <form onSubmit={handleSubmit}  noValidate autoCorrect="off">
                    <input
                        className="CreatePost__input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Post title"
                        minLength={4}
                        maxLength={96}
                    />

                    <textarea
                        className="CreatePost__input"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        placeholder="Post content"
                        minLength={12}
                        maxLength={16256}
                    />

                    <button
                        className="CreatePost__button"
                        disabled={title.length < 4 || body.length < 12}
                    >Create</button>
                </form>
            </div>
        </section>
    )
}