import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log(response.data);
      setLoading(false); // Stop loading spinner

      // Check if response has token and user data (successful login)
      if (response.data.token && response.data.user) {
        toast.success(`Welcome ${response.data.user.username}!`);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("keepLoggedIn", JSON.stringify(true));
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        
        // Navigate to admin page and reload to update navbar
        navigate("/admin");
        window.location.reload();
      } else {
        toast.error("Login failed - Invalid response format");
      }
    } catch (error) {
      setLoading(false); // Stop loading spinner
      console.error("Login error:", error);
      if (error.response && error.response.data) {
      toast.error(error.response.data.error || "An error occurred.");
    } else {
      toast.error("Unable to connect to the server.");
    }
    }
  };

  return (
    <>
      <Container className="login-container">
        <Card className="login-card">
          <Card.Body>
            <h2 className="login-header">Login</h2>
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

              <Button className="login-button mt-4" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form>
            <p className="mt-3">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Login;
