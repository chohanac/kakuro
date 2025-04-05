import { NavLink, useLocation } from "react-router";
import "./Header.scss";

const Header = () => {
    return (
        <nav className="header">
            <NavLink to="/">
                <h3>Cross Sums</h3>
            </NavLink>
            <div className="header__links">
                <NavLink to="/" className="header__link">
                    <h3>Home</h3>
                </NavLink>
                <NavLink to="/create" className="header__link">
                    <h3>Create</h3>
                </NavLink>
                <NavLink to="/instructions" className="header__link">
                    <h3>Instructions</h3>
                </NavLink>
            </div>
        </nav>
    )
}
export default Header;


