import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Container,
  TextField,
  Typography,
  Button,
  Avatar,
  ButtonBase,
} from "@mui/material";
import Modal from "react-bootstrap/Modal";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import login from "../Asstes/login.png";

function Home() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(undefined);
  const [form, setForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // keep token in sync when page reloads
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    alert("Logged out successfully!");
  };

  // ✅ Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", form);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setShowLogin(false);
      alert("Login successful!");
      navigate("/profile"); // ✅ redirect to profile page
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // ✅ Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", signupForm);
      alert("Signup successful! Please log in.");
      setShowSignup(false);
      setShowLogin(true);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  // ✅ Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarSrc(URL.createObjectURL(file));
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Skill<span className="text-dark">X</span>change
          </a>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact Us
                </Link>
              </li>
            </ul>

            {/* ✅ Conditional buttons */}
            {!token ? (
              <Button
                variant="contained"
                onClick={() => setShowLogin(true)}
                style={{
                  border: "2px solid white",
                  color: "white",
                  backgroundColor: "#0d6efd",
                  marginRight: "20px",
                }}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={handleLogout}
                style={{
                  border: "2px solid white",
                  color: "white",
                  backgroundColor: "#0d6efd",
                  marginRight: "20px",
                }}
              >
                Logout
              </Button>
            )}

            <Button
              component={Link}
              to="/profile"
              variant="outlined"
              style={{
                border: "2px solid white",
                color: "white",
                backgroundColor: "#0d6efd",
                marginRight: "20px",
              }}
            >
              Profile
            </Button>

            <ButtonBase component="label">
              <Avatar alt="Upload new avatar" src={avatarSrc} />
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </ButtonBase>
          </div>
        </div>
      </nav>

      {/* Carousel Section */}
      <Carousel>
        <Carousel.Item>
          <img className="d-block w-100" src={login} alt="First slide" />
          <Carousel.Caption>
            <h3>Welcome to SkillXchange</h3>
            <p>Share and learn new skills from others!</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button fullWidth variant="contained" type="submit" style={{ marginTop: "15px" }}>
              Login
            </Button>
          </form>
          <Typography align="center" style={{ marginTop: "10px" }}>
            Don’t have an account?{" "}
            <span
              onClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
              style={{ color: "blue", cursor: "pointer" }}
            >
              Sign up
            </span>
          </Typography>
        </Modal.Body>
      </Modal>

      {/* Signup Modal */}
      <Modal show={showSignup} onHide={() => setShowSignup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSignup}>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              required
            />
            <Button fullWidth variant="contained" type="submit" style={{ marginTop: "15px" }}>
              Sign Up
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Home;
