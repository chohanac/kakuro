import { NavLink, useLocation } from "react-router";
import "./Header.scss";

const Header = () => {
    return (
        <nav className="header">
            <NavLink to="/">
                <img className="header__image" src="" alt="Instock logo" />
            </NavLink>
            <div className="header__links">
                <NavLink to="/" className="header__link">
                    <h3>Warehouses</h3>
                </NavLink>
                <NavLink to="/inventory" className="header__link">
                    <h3>Inventory</h3>
                </NavLink>
            </div>
        </nav>
    )
}
export default Header;


