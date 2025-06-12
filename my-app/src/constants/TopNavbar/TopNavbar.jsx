//Main Navigation Bar of the Website

import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "./TopNavbar.css";
import logo from "../../assets/logo.png"; 
import { Link } from "react-router-dom";
import bgImage from "../../assets/Navbar.png";


export default function TopNavbar() {
  return (
    
    <Navbar
      className="custom-navbar"
      expand="lg"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "120px",
        borderRadius:"4px",
      }}
    >
      
      <Container fluid className="navbar-container">
        <Navbar.Brand className="navbar-brand brand-with-logo">
          <img src={logo} alt="MoH Logo" className="logo-image" />
          <div className="brand-text">
            <div className="line-one">Ministry of Health</div>
            <div className="line-two">Republic of Maldives</div>
            <span className="indicators-text">INDICATORS</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="nav-collapse" />

        <Navbar.Collapse id="nav-collapse">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/home">HOME</Nav.Link>
            <Nav.Link as={Link} to="/">RESULTS</Nav.Link>
            <Nav.Link as={Link} to="/about">ABOUT</Nav.Link>
            <Nav.Link as={Link} to="/login" className="login-link">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse> 
      </Container>
    </Navbar>
   );
}