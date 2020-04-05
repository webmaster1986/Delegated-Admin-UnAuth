import React, { Component } from 'react';
import {
  Container,
  Nav,
  Navbar
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom'

import badge from '../components/images/FDNY.png';
import MobileMenu from "./MobileMenu";
import "./nav.css"

class Header extends Component {
  getReactAppEnv  = () => {
    const host = window.location.host;
    let env = "";
    if (host.includes("dev")) {
      console.log ("dev");
      env = "dev";
    } else if (host.includes("tst")) {
      console.log ("tst");
      env = "tst";
    } else if (host.includes("stg")) {
      console.log ("stg");
      env = "stg";
    } else {
      console.log ("prod");
      env = "prod";
    }
    return env
  };

  render() {
    const envMode =  this.getReactAppEnv();
    const className = envMode === 'dev' ? 'green-banner' : envMode === 'tst' ? 'blue-banner' : envMode === 'stg' ? 'purple-banner' : 'red-banner';
    return (
      <div
        className={`header-nav ${className}`}
      >
        <Container>
          <Navbar collapseOnSelect expand="lg">
            <Navbar.Brand href='http://www.fdny.org' target="_blank">
              <img
                src={badge}
                alt='FDNY icon'
                style={{height: '60px'}}
              />
              <span className='nav-text align-middle pl-2'>FDNY</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto desktop-menu">
              </Nav>
              <MobileMenu/>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </div>
    );
  }
}

export default withRouter(Header);
