import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./TopNavbar.css";

export default function TopNavbar() {
  return (
    <Navbar className="custom-navbar glass-navbar" expand="lg">
      <Navbar.Brand as={Link} to="/home" className="navbar-brand brand-with-logo">
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
          <Nav.Link as={Link} to="/home">Home</Nav.Link>
          <Nav.Link as={Link} to="/">Results</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
          <Nav.Link as={Link} to="/login" className="login-link">Login</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
