import {
    useUpdateCommentMutation,
    useDeleteCommentMutation
} from "../postsApiSlice"
import {
    selectCurrentId,
    selectCurrentRoles
} from "../../auth/authSlice"
import { useSelector } from "react-redux"
import { useState } from "react"
import { AiFillEdit, AiFillCloseSquare, AiOutlineSave } from "react-icons/ai"
import { useParams } from "react-router-dom"
import "./Comment.scss"

export const Comment = ({ comment,  postAuthor}) => {
    const [updateComment] = useUpdateCommentMutation()
    const [deleteComment] = useDeleteCommentMutation()

    const userId = useSelector(selectCurrentId)
    const roles = useSelector(selectCurrentRoles)
    const {postId} = useParams()

    const [updatePerm, setUpdatePerm] = useState(false)
    const [body, setBody] = useState(comment.body)

    const permissionToDelete = roles.includes('Admin') || userId === comment.author
    const permissionToUpdate = userId === comment.author

    const handleDelete = async () => {
        try {
            if (window.confirm('Delete this comment?')) {
                await deleteComment({id: postId, commentId: comment._id}).unwrap()
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        if (!body || body.length > 512) {
            return
        }

        try {
            await updateComment({id: postId, commentId: comment._id, body}).unwrap()
            setUpdatePerm(false)
        } catch (err) {
            console.log(err)
        }
    }

    const updated = new Date(comment.updatedAt).toLocaleString('en-GB')
    const created = new Date(comment.createdAt).toLocaleString('en-GB')

    return (
        <div className="Comment">
            <div className="Comment__head">
                <div className="Comment__credentials">
                    <cite>
                        { comment.authorName } { (comment.author === postAuthor) && <span>[author]</span> }
                    </cite>

                    <time>
                        {updated} {(created !== updated) && <span>(updated)</span>}
                    </time>
                </div>

                <div className="Comment__icons">
                    { permissionToUpdate &&
                        <AiFillEdit
                            className="Comment__edit"
                            onClick={() => setUpdatePerm(prev => !prev)}
                        />
                    }

                    { permissionToDelete &&
                        <AiFillCloseSquare
                            className="Comment__delete"
                            onClick={() => handleDelete()}
                        />
                    }

                    { updatePerm &&
                        <button disabled={!body || body.length > 512} onClick={handleUpdate}>
                            <AiOutlineSave className="Comment__save"/>
                        </button>
                    }
                </div>
            </div>

            <div className="Comment__body">
                {updatePerm
                    ?
                    <form onSubmit={handleUpdate}>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="Comment__textarea"
                                maxLength={512}
                            />
                    </form>
                    :
                    <p>{comment.body}</p>
                }
            </div>
        </div>
    )
}