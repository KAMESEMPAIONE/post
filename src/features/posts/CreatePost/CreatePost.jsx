import { useCreatePostMutation } from "../postsApiSlice"
import { useState, useEffect, useRef } from "react"
import { marked } from "marked"
import { AiFillFileAdd } from "react-icons/ai"
import "./CreatePost.scss"

export const CreatePost = () => {
    const [createPost] = useCreatePostMutation()

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const titleRef = useRef(null)

    const fileRef = useRef(null)
    const [fileName, setFileName] = useState('')
    const [fileContent, setFileContent] = useState('')

    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        setErrMsg('')
    }, [title, body, fileContent])


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
                await createPost({title, body: fileContent}).unwrap()
            } else {
                const wrappedBody = `<p>${body}</p>`
                await createPost({title, body: wrappedBody}).unwrap()
            }

            setTitle('')
            setBody('')
            setFileContent('')
            fileRef.current.value = null

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
    const inputContent = (
        <>
            Choose File
            <AiFillFileAdd className="CreatePost__fileIcon"/>
        </>
    )
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
                        ref={titleRef}
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
                        disabled={!!fileContent}
                    />

                    <p className="CreatePost__mdp">Or drop md file</p>

                    <label>
                        <input
                            type="file"
                            accept=".md"
                            onChange={handleFileChange}
                            ref={fileRef}
                            className="CreatePost__input-file"
                        />

                        <div className="CreatePost__fileDropZone">
                            {fileName ?
                                fileName
                                : inputContent
                            }
                        </div>
                    </label>

                    <button
                        className="CreatePost__button"
                        disabled={(!fileContent || !title?.length) && (title.length < 4 || body.length < 12)}
                    >
                        Create
                    </button>
                </form>
            </div>
        </section>
    )
}