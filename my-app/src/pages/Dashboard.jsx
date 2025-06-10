// src/pages/Dashboard.jsx
//Main Dashboard wh filters
import { Container, Row, Navbar, Nav, Card } from "react-bootstrap";
import SearchMenu from "../components/SearchMenu";
import "../components/Dashboard.css";
import React, { useState } from "react";


export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(true); /*Menu Open by Default*/

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
      <button
       className="menu-button" 
       onClick={toggleMenu}
       style={{ left: isMenuOpen ? "295px" : "0px" }} /*width to side of page on menu from open to close*/
>
  {isMenuOpen ? "←" : "☰"}

       </button>

    
          {/* Sidebar menu */}
          <div className="dashboard-layout">
        <SearchMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />

          {/* Main content – pushed if sidebar is open */}

        <div className="main-content">
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
      </div>
    </>
  );
}