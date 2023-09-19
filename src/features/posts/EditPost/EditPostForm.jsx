import {
    useUpdatePostMutation,
    useDeletePostMutation
} from "../postsApiSlice"
import {useState, useEffect, useRef} from "react"
import { useNavigate } from "react-router-dom"
import { marked } from "marked"
import { AiFillFileAdd } from "react-icons/ai"
import "./EditPostForm.scss"

export const EditPostForm = ({post}) => {
    const [title, setTitle] = useState(post?.title || '')
    const [body, setBody] = useState(post?.body || '')
    const titleRef = useRef(null)

    const fileRef = useRef(null)
    const [fileName, setFileName] = useState('')
    const [fileContent, setFileContent] = useState('')

    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        setErrMsg('')
    }, [title, body, fileContent])

    const [updatePost] = useUpdatePostMutation()
    const [deletePost] = useDeletePostMutation()
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files[0]

        const lastDot = file.name.lastIndexOf('.')
        const fileType = file.name.slice(lastDot)
        if (fileType !== '.md') {
            setErrMsg("File must be in the md format")
            return
        }

        const reader = new FileReader()
        reader.readAsText(file)

        reader.onload = () => {
            const parsedFile = marked.parse(reader.result)
            setFileName(file.name)
            setFileContent(parsedFile)
            titleRef.current.focus()
        }

        reader.onerror = () => {
            setErrMsg('File error')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!title) {
            setErrMsg("Enter the title")
            return
        }

        if(!fileContent && (title.length < 4 || body.length < 12)) {
            setErrMsg("Invalid entry")
            return
        }

        try {
            if(fileContent) {
                await updatePost({title, body: fileContent, id: post.postId}).unwrap()
            } else {
                const wrappedBody = `<p>${body}</p>`
                await updatePost({title, body:wrappedBody, id: post.postId}).unwrap()
            }

            fileRef.current.value = null
            alert("Post updated")
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

    const handleDelete = async () => {
        try {
            if(window.confirm('Delete this post?')) {
                await deletePost({ postId: post.postId }).unwrap()
                navigate('/posts')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const errClass = errMsg ? "errmsg" : "offscreen"
    const inputContent = (
        <>
            Choose File
            <AiFillFileAdd className="CreatePost__fileIcon"/>
        </>
    )

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
                        ref={titleRef}
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
                        disabled={!!fileContent}
                    />

                    <p className="EditPost__mdp">Or drop md file</p>

                    <label>
                        <input
                            type="file"
                            accept=".md"
                            onChange={handleFileChange}
                            ref={fileRef}
                            className="EditPost__input-file"
                        />

                        <div className="EditPost__fileDropZone">
                            {fileName ?
                                fileName
                                : inputContent
                            }
                        </div>
                    </label>

                    <div className="EditPost__buttons">
                        <button
                            className="EditPost__button"
                            disabled={(!fileContent || !title?.length) && (title.length < 4 || body.length < 12)}
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