import React from "react";
import { Container } from "react-bootstrap";
import "./BottomBar.css";

export default function BottomBar() {
  return (
    <footer className="bottom-bar">
      <Container className="text-center">
        <small>
          &copy; {new Date().getFullYear()} Ministry of Health, Republic of Maldives. All rights reserved.
        </small>
      </Container>
    </footer>
  );
}
