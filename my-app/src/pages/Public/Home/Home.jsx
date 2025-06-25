import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Home.css";

export default function HomePage() {
  const [population, setPopulation] = useState(523787); // Base population

  useEffect(() => {
    const interval = setInterval(() => {
      setPopulation((prev) => prev + 1); // Simulated increase
    }, 1000); // Every second

    return () => clearInterval(interval); // Clean up
  }, []);

  return (
    <Container className="home-page mt-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Ministry of Health</h1>
          <h4 className="text-center text-muted">Republic of Maldives</h4>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="population-card text-center shadow">
            <Card.Body>
              <Card.Title className="mb-3">Live Maldivian Population</Card.Title>
              <h2 className="population-number">
                {population.toLocaleString("en-US")}
              </h2>
              <p className="text-muted small">
                * Approximate real-time simulation for display purposes
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
