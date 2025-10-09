// frontend/component/Home.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import Modal from "react-bootstrap/Modal";
import {
  Box,
  Card,
  Container,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import login from "../Asstes/login.png";

function Home() {
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  // States for Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // States for Signup
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // Modal controls
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Avatar upload state
  const [avatarSrc, setAvatarSrc] = useState(undefined);

  // Track login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle avatar upload
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle login
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userNameOrEmail: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        setShowLogin(false);
        
        // ✅ CRITICAL FIX: Save the user's email/ID needed for the Profile page fetch
        // Since the user logs in using loginEmail (which can be a username or email),
        // we save this value. If your backend returns the canonical email in 'data.email',
        // use that instead (e.g., localStorage.setItem("userEmail", data.email);)
        localStorage.setItem("userEmail", loginEmail); 
        
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        
        setIsLoggedIn(true); 
        navigate("/");

      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  // Handle signup
  const handleSignup = async () => {
    if (
      !signupUsername ||
      !signupEmail ||
      !signupPassword ||
      !signupConfirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful! Please log in.");
        setShowSignup(false);
        setShowLogin(true); // Direct to login after successful signup
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  // Switch modal
  const handleOpenSecond = () => {
    setShowLogin(false);
    setTimeout(() => setShowSignup(true), 300);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail"); // ✅ Clear userEmail on logout
    setIsLoggedIn(false);
    navigate("/"); // Redirect to home/login view
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
                <Link className="nav-link" to="/about-us">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact Us
                </Link>
              </li>
              
              {/* Only show Suggestions if logged in */}
              {isLoggedIn && (
                  <li className="nav-item">
                      <Link className="nav-link" to="/profile/suggestion">
                          Suggestions
                      </Link>
                  </li>
              )}
            </ul>

            {/* Show Login only if not logged in */}
            {!isLoggedIn && (
              <Button
                variant="primary"
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
            )}

            {/* Show Profile and Logout only if logged in */}
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

      {/* Login Modal (Content remains the same) */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Body>
          <Box sx={{ flex: 1, maxWidth: 500, width: "100%" }}>
            <Card variant="outlined" sx={{ borderRadius: "10px", p: 3 }}>
              <Typography variant="h5" color="primary" align="center" gutterBottom>
                <b>SkillXchange</b>
              </Typography>
              <Typography variant="h6" align="center" gutterBottom>
                LOGIN
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div>
                  <label>UserName / E-mail</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    required
                    value={loginEmail}
                    placeholder="Enter Your UserName or E-mail"
                    onChange={(e) => setLoginEmail(e.target.value)}
                    fullWidth
                  />
                </div>
                <div>
                  <label>Password</label>
                  <TextField
                    type="password"
                    variant="outlined"
                    size="small"
                    required
                    placeholder="Enter Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    fullWidth
                  />
                </div>
                <Button variant="contained" fullWidth onClick={handleLogin}>
                  Login
                </Button>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Don’t have an account?{" "}
                  <Button onClick={handleOpenSecond} size="small">
                    Signup
                  </Button>
                </Typography>
              </Box>
            </Card>
          </Box>
        </Modal.Body>
      </Modal>

      {/* Signup Modal (Content remains the same) */}
      <Modal show={showSignup} onHide={() => setShowSignup(false)} centered>
        <Modal.Body>
          <Box sx={{ flex: 1, maxWidth: 500, width: "100%" }}>
            <Card variant="outlined" sx={{ borderRadius: "10px", p: 3 }}>
              <Typography variant="h5" color="primary" align="center" gutterBottom>
                <b>SkillXchange</b>
              </Typography>
              <Typography variant="h6" align="center" gutterBottom>
                SIGN UP
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="UserName"
                  variant="outlined"
                  size="small"
                  required
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  size="small"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  size="small"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  size="small"
                  required
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </Box>
            </Card>
          </Box>
        </Modal.Body>
      </Modal>

      <br />

      {/* Main content (Content remains the same) */}
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          minHeight: "80vh",
          gap: 4,
        }}
      >
        {/* Left Side: Image */}
        <Box sx={{ flex: 1, textAlign: "center", marginTop: { xs: 2, md: -18 } }}>
          <img
            src={login}
            alt="Login Illustration"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "10px",
            }}
          />
        </Box>

        {/* Right Side: Text */}
        <Box
          sx={{
            flex: 1,
            textAlign: { xs: "center", md: "left" },
            marginBottom: 25,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign={{ xs: "center", md: "left-center" }}
            gutterBottom
          >
            Welcome to SkillXchange!
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            textAlign={{ xs: "center", md: "right" }}
            marginBottom={2}
          >
            Share skills. Learn together. Grow with SkillXchange.
          </Typography>
        </Box>
      </Container>

      <Container sx={{ marginTop: -15 }}>
        {/* About Us */}
        <Typography variant="h4" color="primary" gutterBottom>
          <b>About Us</b>
        </Typography>
        <Typography paragraph>
          SkillXchange is a peer-to-peer platform where people can learn, teach,
          and collaborate. It connects learners, mentors, and professionals to
          share knowledge and exchange skills.
        </Typography>
        <Typography paragraph>
          <b>Our mission:</b> Empower growth through collaboration.
        </Typography>
        <hr />

        {/* How to Use */}
        <Typography variant="h4" color="primary" gutterBottom>
          <b>How to Use</b>
        </Typography>
        <ul>
          <li>Sign up with your email and create your profile.</li>
          <li>List the skills you can teach and the skills you want to learn.</li>
          <li>Use the match feature to find learners and mentors.</li>
          <li>Start a chat, schedule a session, and exchange skills!</li>
        </ul>
        <hr />

        {/* Guide Section */}
        <Typography variant="h4" color="primary" gutterBottom>
          <b>Guide</b>
        </Typography>
        <Carousel
          style={{
            maxWidth: "800px",
            margin: "20px auto",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Step 1"
            />
            <Carousel.Caption>
              <h5>Create Your Profile</h5>
              <p>Sign up and showcase your skills and what you want to learn.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="Step 2"
            />
            <Carousel.Caption>
              <h5>Find Matches</h5>
              <p>Connect with learners and mentors who share your goals.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
              alt="Step 3"
            />
            <Carousel.Caption>
              <h5>Chat & Collaborate</h5>
              <p>Start a chat, schedule sessions, and exchange skills easily.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <hr />

        {/* Details */}
        <Typography variant="h4" color="primary" gutterBottom>
          <b>Details</b>
        </Typography>
        <Typography paragraph>
          SkillXchange supports a wide range of skills — from coding, design,
          photography to music, cooking, and more. The platform is designed to
          grow with the community, allowing you to build connections and
          collaborate globally.
        </Typography>
      </Container>
    </div>
  );
}

export default Home;