import { Link } from "react-router-dom"
import "./NotFound.scss"

export const NotFound = () => {
    return (
        <section className="NotFound">
            <div className="NotFound__body">
                <h1 className="NotFound__title">4<span>0</span>4</h1>
                <p className="NotFound__text">Page not found</p>
                <Link to="/" replace className="NotFound__link">Back to the homepage</Link>
            </div>
        </section>
    )
}
