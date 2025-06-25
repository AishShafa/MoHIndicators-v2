import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import "./Login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    console.log("Email:", email);
    console.log("Password:", password);
=======
>>>>>>> c2cc97f8ad3d73f1ef9103496a1b33c6f5c40c73

    try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert(`Welcome ${data.user.username}! Your role is: ${data.user.role}`);

        // Navigate to dashboard if using react-router
        // navigate("/dashboard");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred while logging in.");
    }
  };

  return (
    <Container className="login-container">
      <Card className="login-card">
        <Card.Body>
          <h2 className="login-header">LOGIN</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group id="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button className="login-button" type="submit">
              Log In
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
