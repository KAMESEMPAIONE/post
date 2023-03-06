import { useUpdateMutation, useRefreshMutation } from "../../features/auth/authApiSlice"
import { useState, useEffect } from "react"
import "./UpdateCredentials.scss"

const USER_REGEX = /^[A-z][A-z0-9-_]{3,24}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,32}$/

export const UpdateCredentials = ({field}) => {
    const [refresh] = useRefreshMutation()
    const [update] = useUpdateMutation()

    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [validPwd, setValidPwd] = useState(false)

    const [newUsername, setNewUsername] = useState('')
    const [validUser, setValidUser] = useState(false)

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        setErrMsg('')
    }, [password, newPassword, newUsername])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(newPassword))
    }, [newPassword])

    useEffect(() => {
        setValidUser(USER_REGEX.test(newUsername))
    }, [newUsername])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const v1 = USER_REGEX.test(newUsername)
        const v2 = PWD_REGEX.test(newPassword)

        if(!v1 && !v2) {
            setErrMsg('Invalid Entry')
            return
        }

        try {
            if (field === "Password") {
                await update({newPassword, password}).unwrap()
            } else if (field === "Username") {
                await update({newUsername, password}).unwrap()
                await refresh().unwrap()
            }

            setPassword('')
            setNewUsername('')
            setNewPassword('')
            setSuccess(true)
        } catch (err) {
            if (err?.status === 409) {
                setErrMsg('This username already exists')
            } else if (err?.status === 'PARSING_ERROR') {
                setErrMsg('Password not valid')
            } else if (err?.status === 400) {
                setErrMsg('Invalid data')
            } else if (!err?.status) {
                setErrMsg('No Server Response')
            } else {
                setErrMsg('Login Failed')
            }
        }
    }

    const errClass = errMsg ? 'errmsg' : 'offscreen'
    const successClass = success ? 'success' : 'offscreen'
    return (
        <section className="UpdateCred">
            <div className="UpdateCred__body">
                <p className={errClass}>{errMsg}</p>
                <p className={successClass}>Success data changed!</p>
                <h1 className="UpdateCred__title">Change {field}</h1>

                <form onSubmit={handleSubmit} noValidate autoCorrect="off">
                    <input
                        className="UpdateCred__input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="on"
                        placeholder="Password:"
                        maxLength={32}
                    />

                    {field === "Password"
                        ? (<input
                            className="UpdateCred__input"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            autoComplete="on"
                            placeholder="New password:"
                            maxLength={24}
                        />)
                        : (
                            <input
                                className="UpdateCred__input"
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                required
                                autoComplete="on"
                                placeholder="New username:"
                                maxLength={24}
                            />
                        )
                    }

                    <button
                        className="UpdateCred__button"
                        disabled={(field === 'Username' && (!validUser || !password)) || (field === 'Password' && (!validPwd || !password))}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
    )
}
