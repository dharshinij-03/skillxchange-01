// frontend/component/ContactUs.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import { Box, Card, Container, Typography, TextField, Button } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

function ContactUs() {
  const navigate = useNavigate();

  const [avatarSrc, setAvatarSrc] = useState(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Contact form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in all fields");
      return;
    }
    // For now just alert the message; in real app, send to backend
    alert(`Thank you, ${name}! Your message has been received.`);
    setName("");
    setEmail("");
    setMessage("");
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
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about-us">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/contact">
                  Contact Us
                </Link>
              </li>
              {isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link" to="/profile/suggestion">
                    Suggestions
                  </Link>
                </li>
              )}
            </ul>

            {/* Profile & Logout */}
            {isLoggedIn && (
              <>
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
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  style={{
                    border: "2px solid white",
                    color: "white",
                    backgroundColor: "#dc3545",
                    marginRight: "20px",
                  }}
                >
                  Logout
                </Button>
              </>
            )}

            {/* Avatar Upload */}
            <ButtonBase component="label">
              <Avatar alt="Upload new avatar" src={avatarSrc} />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </ButtonBase>
          </div>
        </div>
      </nav>

      {/* Contact Form */}
      <Container sx={{ marginTop: 5, marginBottom: 10, maxWidth: 600 }}>
        <Card variant="outlined" sx={{ borderRadius: 3, p: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            Contact Us
          </Typography>
          <Typography paragraph align="center">
            Have questions or feedback? Fill out the form below and we’ll get back to you!
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onSubmit={handleSubmit}
          >
            <TextField
              label="Name"
              variant="outlined"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Message"
              variant="outlined"
              required
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" color="primary" type="submit">
              Send Message
            </Button>
          </Box>
        </Card>
      </Container>
    </div>
  );
}

export default ContactUs;
