import { useSendLogoutMutation } from "../../features/auth/authApiSlice"
import { useState } from "react"
import { useSelector } from "react-redux"
import { selectCurrentUser, selectCurrentRoles } from "../../features/auth/authSlice"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "./Header.scss"

export const Header = () => {
    const [active, setActive] = useState(false)

    const [logout] = useSendLogoutMutation()

    const currentUser = useSelector(selectCurrentUser)
    const roles = useSelector(selectCurrentRoles)
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        try {
            await logout().unwrap()
            navigate('/login')
        } catch (err) {
            console.error(err)
        }
    }

    const handleClick = () => {
        setActive(prev => !prev)
    }

    document.addEventListener('click', (e) => {
        const target = e.target

        if(!target.matches('.Header__user')) {
            return setActive(false)
        }
    })

    return (
        <header className="Header">
            <div className="container">
                <nav className="Header__nav">
                    <Link to="/" className="Header__link">Home</Link>

                    {location.pathname !== '/posts' &&
                        <Link to="/posts" className="Header__link">Posts</Link>
                    }
                    <div className={`Header__user ${active ? 'active' : ''}`} onClick={handleClick}>
                        {currentUser} <span>▼</span>

                        <div className={`Header__dropDown ${active ? 'dropDown__active' : ''}`}>
                            {roles?.includes('Editor') &&
                                <Link to="/posts/create" className="Header__dropLink">Create new post</Link>
                            }

                            {roles?.includes('Editor') &&
                                <Link to="/posts/my-posts" className="Header__dropLink">My posts</Link>
                            }
                            <Link to="/update-credentials" className="Header__dropLink">Change username</Link>
                            <Link to="/update-credentials/password" className="Header__dropLink">Change password</Link>
                            <Link onClick={handleLogout} className="Header__dropLink">Logout</Link>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}