// frontend/component/AboutUs.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import { Box, Card, Container, Typography, Button } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

function AboutUs() {
  const navigate = useNavigate();

  // Avatar upload state
  const [avatarSrc, setAvatarSrc] = useState(undefined);

  // Track login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                <Link className="nav-link active" to="/about-us">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
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

      <Container sx={{ marginTop: 5, marginBottom: 10 }}>
        <Typography variant="h3" color="primary" gutterBottom>
          <b>About SkillXchange</b>
        </Typography>
        <Typography paragraph>
          SkillXchange is a peer-to-peer platform where people can learn, teach,
          and collaborate. It connects learners, mentors, and professionals to
          share knowledge and exchange skills in a simple and effective way.
        </Typography>
        <Typography paragraph>
          <b>Our Mission:</b> To empower personal and professional growth through
          collaborative learning and skill sharing.
        </Typography>
        <Typography paragraph>
          With SkillXchange, you can:
        </Typography>
        <ul>
          <li>Create a profile highlighting your skills and interests.</li>
          <li>List the skills you want to learn and skills you can teach.</li>
          <li>Find perfect matches with learners and mentors in your community or globally.</li>
          <li>Start conversations, schedule sessions, and exchange knowledge effortlessly.</li>
        </ul>
        <Typography paragraph>
          We support a wide range of skills — from coding, design, photography, and music to cooking, languages, and more. Join us to grow with a global community of passionate learners!
        </Typography>
      </Container>
    </div>
  );
}

export default AboutUs;
