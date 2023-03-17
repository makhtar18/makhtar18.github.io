import React from "react";
import Nav from 'react-bootstrap/Nav';
import {Link, useMatch, useResolvedPath} from "react-router-dom";
const NavBar = ()=>{
    return (
    <Nav variant="pills" defaultActiveKey="link-1" className='justify-content-end mt-2' style={{ width: "100%" }}>
      <CustomLink to="/search">Search</CustomLink>
      <CustomLink to="/favorites">Favorites</CustomLink>
    </Nav>
    )
};

function CustomLink({to, children, ...props}){
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({path: resolvedPath.pathname, end:true});
    return(
        <Nav.Item>
            <Link to={to} className={isActive? "active nav-link":"nav-link"}> {children}</Link>
        </Nav.Item>
    )
}

export default NavBar;