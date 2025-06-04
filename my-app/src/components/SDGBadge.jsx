// src/components/SDGBadge.jsx
import React from "react";
import { Badge } from "react-bootstrap";

export default function SDGBadge({ sdg, variant = "success" }) {
  return (
    <Badge bg={variant} className="me-1" style={{ fontSize: "0.9em" }}>
      {sdg}
    </Badge>
  );
}
