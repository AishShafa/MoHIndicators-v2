
import React from "react";

export default function MaldivesMap({ onSelectRegion }) {
  return (
    <svg
      viewBox="0 0 300 150"
      style={{ width: "100%", height: "auto", cursor: "pointer" }}
    >
      {/* Simplified Maldives atolls */}
      <rect
        x="20"
        y="30"
        width="40"
        height="30"
        fill="#74c0fc"
        stroke="#333"
        onClick={() => onSelectRegion("Malé Atoll")}
      />
      <text x="40" y="50" fill="#000" fontSize="10" pointerEvents="none">
        Malé Atoll
      </text>

      <rect
        x="80"
        y="70"
        width="50"
        height="30"
        fill="#90e0ef"
        stroke="#333"
        onClick={() => onSelectRegion("Addu Atoll")}
      />
      <text x="100" y="90" fill="#000" fontSize="10" pointerEvents="none">
        Addu Atoll
      </text>

      <rect
        x="150"
        y="40"
        width="60"
        height="40"
        fill="#48cae4"
        stroke="#333"
        onClick={() => onSelectRegion("Faafu Atoll")}
      />
      <text x="170" y="60" fill="#000" fontSize="10" pointerEvents="none">
        Faafu Atoll
      </text>
    </svg>
  );
}
