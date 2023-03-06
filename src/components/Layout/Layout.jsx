import { Outlet } from "react-router-dom"
import { Header } from "../Header/Header"

const divStyle = {
    padding : '50px 0 0 0'
}
export const Layout = () => {
    return (
        <>
            <Header/>
            <div className="container" style={divStyle}>
                <Outlet/>
            </div>
        </>
    )
}