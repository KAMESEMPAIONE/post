import { useRegisterMutation } from "./registerApiSlice"
import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import "./Register.scss"

const EMAIL_REGEXP = /^\S+@\S+\.\S+$/
const USER_REGEX = /^[A-z][A-z0-9-_]{2,24}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,32}$/

export const Register = () => {
    const [register, {isSuccess}] = useRegisterMutation()

    const userRef = useRef(null)

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [emailFocus, setEmailFocus] = useState(false)

    const [user, setUser] = useState('')
    const [validUser, setValidUser] = useState(false)
    const [userFocus, setUserFocus] = useState(false)

    const [pwd, setPwd] = useState('')
    const [validPwd, setValidPwd] = useState(false)
    const [pwdFocus, setPwdFocus] = useState(false)

    const [matchPwd, setMatchPwd] = useState('')
    const [validMatch, setValidMatch] = useState(false)
    const [matchFocus, setMatchFocus] = useState(false)

    const [showPwd, setShowPwd] = useState(false)

    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setValidEmail(EMAIL_REGEXP.test(email))
    }, [email])

    useEffect(() => {
        setValidUser(USER_REGEX.test(user))
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd))
        setValidMatch(pwd === matchPwd)
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('')
    }, [email, user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const v1 = USER_REGEX.test(user)
        const v2 = PWD_REGEX.test(pwd)
        const v3 = EMAIL_REGEXP.test(email)
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry")
            return
        }
        try {
            await register({
                username: user,
                password: pwd,
                email
            }).unwrap()

            setUser('')
            setEmail('')
            setPwd('')
            setMatchPwd('')
        } catch (err) {
            if (err?.status === 409) {
                setErrMsg('This email already exists')
            } else if (err?.status === 406) {
                setErrMsg('This username already exists')
            } else if (err?.status === 400) {
                setErrMsg('Invalid data')
            } else if (!err?.status) {
                 setErrMsg('No Server Response')
            } else {
                setErrMsg('Login Failed')
            }
        }
    }

    return (
        <>
            {isSuccess ? (
                <section className="Register-complete">
                    <div>
                        <h1>Success</h1>
                        <p>Registration complete!</p>
                        <Link to="/login">Sign in</Link>
                    </div>
                </section>
            ) : (
                <section className="Register">
                    <div className="Register__body">
                        <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
                        <h1 className="Register__title">Register</h1>
                        <form onSubmit={handleSubmit} noValidate autoCorrect='off'>
                            <input
                                    className="Register__input"
                                    type="text"
                                    ref={userRef}
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                    required
                                    placeholder="Username:"
                                    maxLength={24}
                                    onFocus={() => setUserFocus(true)}
                                    onBlur={() => setUserFocus(false)}
                            />
                            <p className={userFocus && user && !validUser ? 'instructions' : 'offscreen'}>
                                    3 to 24 characters
                            </p>


                            <input
                                className="Register__input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email:"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                            />
                            <p className={emailFocus && email && !validEmail ? 'instructions' : 'offscreen'}>
                                Must be a valid email
                            </p>

                            <input
                                className="Register__input"
                                type={showPwd ? "text" : "password"}
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                required
                                autoComplete="on"
                                placeholder="Password:"
                                maxLength={32}
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                            />
                            <p className={pwdFocus && pwd && !validPwd? 'instructions' : 'offscreen'}>
                                8 to 24 characters.<br />
                                Must include uppercase and lowercase letters, <br/>
                                a number and a special character.<br />
                                Allowed special characters: ! @ # $ %
                            </p>

                            <input
                                className="Register__input"
                                type={showPwd ? "text" : "password"}
                                value={matchPwd}
                                onChange={(e) => setMatchPwd(e.target.value)}
                                required
                                autoComplete="on"
                                placeholder="Repeat password:"
                                maxLength={32}
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                            />
                            <p className={matchFocus && matchPwd && !validMatch ? 'instructions' : 'offscreen'}>
                                Must match the first password input field
                            </p>

                            <label className={`Register__label Register__check ${showPwd ? 'active' : ''}`}>
                                <input
                                    className="Register__checkbox"
                                    type="checkbox"
                                    checked={showPwd}
                                    onChange={() => setShowPwd(prev => !prev)}
                                />
                                Show password
                            </label>
                            <button className="Register__button" disabled={!validUser || !validEmail || !validPwd || !validMatch}>Submit!</button>
                        </form>

                        <p className="Register__msg">
                            Already registered?
                            <Link to="/login" className="Register__link">Sign in</Link>
                        </p>
                    </div>
                </section>
            )}
        </>
    )
}