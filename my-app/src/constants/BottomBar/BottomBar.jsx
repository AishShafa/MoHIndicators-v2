import React from "react";
import "./BottomBar.css";

export default function BottomBar() {
  return (
    <footer className="bottom-bar">
      &copy; {new Date().getFullYear()} Ministry of Health, Republic of Maldives.
    </footer>
  );
}
