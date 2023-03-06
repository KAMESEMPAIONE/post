import { selectCurrentUser } from "../../features/auth/authSlice"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import "./Home.scss"

export const Home = () => {
    const username = useSelector(selectCurrentUser)
    let content
    if (username) {
        content = (
            <>
                <p className="Home__msg">Hello {username}</p>
                <Link to="/posts" className="Home__link">Watch the posts</Link>
            </>
        )
    } else {
        content = (
            <p className="Home__msg">To watch the posts you must <br/>
                <Link to="/login" className="Home__link">Log in</Link>
            </p>
        )
    }

    return (
        <section className="Home">
            <h1 className="Home__title">Posts</h1>
            <p className="Home__desc">Website about news</p>
            {content}
        </section>
    )
}