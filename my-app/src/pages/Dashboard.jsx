// src/pages/Dashboard.jsx
import { Container, Row, Navbar, Nav, Card } from "react-bootstrap";
import SearchMenu from "../components/SearchMenu";
import "../components/Dashboard.css";
import React, { useState } from "react";


export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Top navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container fluid>
          <Navbar.Brand href="#">MoH Health Indicators Data</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#results">Results</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Hamburger button – fixed and always visible */}
      <button className="menu-button" onClick={toggleMenu}></button>

      <Container fluid>
        <Row>
          {/* Sidebar menu */}
          <div className={`sidebar-menu ${isMenuOpen ? "open" : ""}`}>
            <SearchMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
          </div>

          {/* Main content – pushed if sidebar is open */}
          <div className={`main-content ${isMenuOpen ? "pushed" : ""}`}>
            <h3>Results</h3>

            <Card className="mb-3" style={{ height: "400px" }}>
              <Card.Body className="d-flex justify-content-center align-items-center">
                <span>Map or Interactive Chart Here</span>
              </Card.Body>
            </Card>

            <Card style={{ height: "200px" }}>
              <Card.Body className="d-flex justify-content-center align-items-center">
                <span>Additional Chart / Table</span>
              </Card.Body>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}