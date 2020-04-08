import React from 'react';
import {
  Nav,
} from 'react-bootstrap';

const MobileMenu = () => {
  const handleClick = (path) => {
    window.location.pathname = path
  }
  return (
    <Nav className="mr-auto mobile-menu">
      <Nav.Item>
        <a
          onClick={() => handleClick("/SelfService/unauth/active-account")}
          className={'nav-link color-white'}
        >
          Active Account
        </a>
      </Nav.Item>
      <Nav.Item>
        <a
          onClick={() => handleClick("/SelfService/unauth/password-reset")}
          className={'nav-link color-white'}
        >
          Reset Password
        </a>
      </Nav.Item>
    </Nav>
  )
}

export default MobileMenu;
