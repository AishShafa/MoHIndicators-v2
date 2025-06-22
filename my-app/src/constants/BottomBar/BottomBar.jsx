import React, { useEffect, useState } from "react";
import "./BottomBar.css";

export default function BottomBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Show the footer only if near the bottom of the page
      setShow(scrollY + windowHeight >= docHeight - 5);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return show ? (
    <footer className="bottom-bar">
      &copy; {new Date().getFullYear()} Ministry of Health, Republic of Maldives.
    </footer>
  ) : null;
}
