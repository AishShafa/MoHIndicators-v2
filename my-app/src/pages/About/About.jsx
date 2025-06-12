// src/pages/AboutPage.js
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./About.css"; // Optional for custom styling

export default function AboutPage() {
  return (
    <Container className="about-page mt-5 mb-5">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">About the Ministry of Health</h2>
          <p className="text-center text-muted">
            Republic of Maldives
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={12}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <Card.Text>
                The Ministry of Health (MoH) of the Republic of Maldives is the government body
                responsible for the oversight and development of public health systems, healthcare
                services, health regulations, and strategic planning for the health sector in the
                Maldives.
              </Card.Text>
              <Card.Text>
                The MoH works to ensure access to quality healthcare for all citizens, promote
                health and well-being, and respond to public health emergencies. The ministry is
                committed to achieving national and global health goals, including the Sustainable
                Development Goals (SDGs), by improving health infrastructure, reducing disease
                burden, and enhancing health governance.
              </Card.Text>
              <Card.Text>
                Key responsibilities include:
                <ul>
                  <li>Formulating health policies and plans</li>
                  <li>Managing public hospitals and clinics</li>
                  <li>Regulating medicines and medical professionals</li>
                  <li>Monitoring health indicators and outcomes</li>
                  <li>Coordinating with international health partners</li>
                </ul>
              </Card.Text>
              <Card.Text>
                For more information, please visit the official Ministry of Health website:{" "}
                <a href="https://health.gov.mv" target="_blank" rel="noopener noreferrer">
                  health.gov.mv
                </a>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
