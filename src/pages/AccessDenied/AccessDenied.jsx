import { Link } from "react-router-dom"
import "./AccessDenied.scss"

export const AccessDenied = () => {
    return (
        <section className="AccessDenied">
            <div className="AccessDenied__body">
                <h1 className="AccessDenied__title">Access Denied</h1>
                <p className="AccessDenied__text">You don't have permission to visit this page</p>
                <Link to="/" replace className="AccessDenied__link">Back to the homepage</Link>
            </div>
        </section>
    )
}