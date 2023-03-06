import { useState, useEffect } from "react"
import { useDispatch} from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useLoginMutation } from "./authApiSlice"
import { setCredentials } from "./authSlice"
import { usePersist } from "../../hooks/usePersist"
import "./Login.scss"


export const Login = () => {
    const [login] = useLoginMutation()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        setErrMsg('')
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!username || !password) {
            setErrMsg('Invalid Entry')
            return
        }

        try {
            const accessToken = await login({username, password}).unwrap()
            dispatch(setCredentials(accessToken))
            setUsername('')
            setPassword('')
            navigate('/posts')
        } catch (err) {
            if (err?.status === 'PARSING_ERROR') {
                setErrMsg('Username or password not valid')
            } else if (err?.status === 400) {
                setErrMsg('Username and password are required!')
            } else if (err?.status === 429) {
                setErrMsg('Too Many Requests try again later')
            } else if (!err?.status) {
                setErrMsg('No Server Response')
            } else {
                setErrMsg('Failed')
            }
        }
    }

    const errClass = errMsg ? 'errmsg' : 'offscreen'

    return (
        <section className="Login">
            <div className="Login__body">
                <p className={errClass}>{errMsg}</p>
                <h1 className="Login__title">Login</h1>

                <form onSubmit={handleSubmit} noValidate autoCorrect="off">
                    <input
                        className="Login__input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Username"
                    />

                    <input
                        className="Login__input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                    />

                    <label className={`Login__label Login__check ${persist ? 'active' : ''}`}>
                        <input
                            className="Login__checkbox"
                            type="checkbox"
                            checked={persist}
                            onChange={() => setPersist(prev => !prev)}
                        />
                        Trust This Device
                    </label>

                    <button className="Login__button" disabled={!username || !password}>Sign In</button>
                </form>
                <p className="Login__msg">
                    Don't have an account yet? <br/>
                    <Link to="/register" className="Login__link">Sign up</Link>
                </p>
            </div>
        </section>

    )
}