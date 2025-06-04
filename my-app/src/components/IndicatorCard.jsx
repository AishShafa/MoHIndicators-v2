// src/components/IndicatorCard.jsx
import React from "react";
import { Card } from "react-bootstrap";
import SDGBadge from "./SDGBadge";

export default function IndicatorCard({ title, value, description, sdgs }) {
  return (
    <Card border="info" className="h-100">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <h2>{value}%</h2>
        <Card.Text>{description}</Card.Text>
        <div>
          SDG Links: {sdgs.map((sdg) => <SDGBadge key={sdg} sdg={sdg} />)}
        </div>
      </Card.Body>
    </Card>
  );
}

