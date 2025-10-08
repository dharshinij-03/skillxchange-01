import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    skills: "",
    learn: "",
    state: "",
    city: "",
    about: "",
  });

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/profile", formData);
      alert("🎉 Profile submitted successfully!");
      navigate("/profile/Suggestion");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit profile!");
    }
  };

  return (
    <>
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

            <Button
              className="nav-link"
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
          </div>
        </div>
      </nav>

      {/* Profile Form */}
      <div className="container py-5" style={{ position: "relative", zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card bg-light text-dark shadow-lg border-light rounded-4 p-4">
              <h2 className="text-center mb-2 fw-bold text-primary">PROFILE</h2>
              <hr />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "black", fontWeight: "600" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: "black", fontWeight: "600" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: "black", fontWeight: "600" }}>
                    Your Skills
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Python, Design, Public Speaking"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: "black", fontWeight: "600" }}>
                    Want to Learn
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Web Dev, Marketing"
                    name="learn"
                    value={formData.learn}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label" style={{ color: "black", fontWeight: "600" }}>
                      Country
                    </label>
                    <select className="form-select" disabled>
                      <option value="India" defaultValue>
                        India
                      </option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label" style={{ color: "black", fontWeight: "600" }}>
                      State
                    </label>
                    <select
                      className="form-select"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option>Gujarat</option>
                      <option>Maharashtra</option>
                      <option>Rajasthan</option>
                      <option>Karnataka</option>
                      <option>Tamil Nadu</option>
                      <option>Kerala</option>
                      <option>Andhra Pradesh</option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label" style={{ color: "black", fontWeight: "600" }}>
                      City
                    </label>
                    <select
                      className="form-select"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    >
                      <option>Ahmedabad</option>
                      <option>Surat</option>
                      <option>Chennai</option>
                      <option>Salem</option>
                      <option>Coimbatore</option>
                      <option>Bangalore</option>
                      <option>Mumbai</option>
                      <option>Pune</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: "black", fontWeight: "600" }}>
                    About You
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Tell others about yourself..."
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-semibold">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
