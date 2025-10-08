// frontend/component/Profile.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Card } from "react-bootstrap"; 
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  // Ensure we get the email immediately
  const initialEmail = localStorage.getItem("userEmail") || ""; 
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: initialEmail, 
    skills: "",
    wantToLearn: "", 
    state: "",
    city: "",
    about: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // --- Profile Fetch Logic (Runs once on load) ---
  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem("userEmail");
      const token = localStorage.getItem("token"); 
      
      console.log('--- Profile Load Attempt ---');
      console.log('Email to fetch:', email);

      if (!email) {
        console.error("DEBUG: User is not authenticated. Cannot fetch profile.");
        setLoading(false);
        setIsEditing(true); // Force edit mode if no email is found
        return;
      }
      
      // Ensure formData is pre-set with the email even before fetching
      setFormData(prev => ({ ...prev, email: email }));

      try {
        const response = await axios.get(`http://localhost:5000/api/profile/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if the response data is NOT empty and has a crucial field (like fullName)
        if (response.data && response.data.fullName) {
          // Data found: Load data and switch to VIEWING mode
          setFormData(response.data); 
          setIsEditing(false); // SUCCESS: Show the saved card
          console.log("DEBUG: Profile data found. Switching to VIEW mode.");
        } else {
          // Profile is incomplete/empty
          setIsEditing(true);
          console.log("DEBUG: Profile data incomplete. Switching to EDIT mode.");
        }
      } catch (err) {
        // Fetch failed (404: no profile, 401: bad token, etc.)
        const status = err.response ? err.response.status : 'Network Error';
        console.error(`DEBUG: Fetch failed (Status: ${status}). Switching to EDIT mode.`, err.response ? err.response.data : err.message);
        
        // Ensure the form has the email even if fetching failed
        setFormData(prev => ({ ...prev, email: email }));
        setIsEditing(true); 
      } finally {
        setLoading(false);
        console.log("--------------------------");
      }
    };

    fetchProfile();
  }, []); 

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleLogout = () => {
    // Note: The logout logic should ideally be in Home.js and App.js to ensure all state is cleared
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/"); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post("http://localhost:5000/api/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setFormData(response.data); 
      setIsEditing(false); // Switch to VIEWING mode immediately after successful save
      alert("🎉 Profile saved successfully!");
      
    } catch (err) {
      console.error("Failed to save profile:", err.response ? err.response.data : err.message);
      alert("❌ Failed to save profile!");
    }
  };

  // --- Rendering Functions ---

  const renderProfileView = () => {
    const skills = formData.skills || "No skills added";
    const wantToLearn = formData.wantToLearn || "Nothing specified";
    const about = formData.about || "No bio available";
    const location = `${formData.city || ''}, ${formData.state || ''}`.replace(/^, | ,$/g, '') || "Location Unknown";

    return (
      <Card
        className="shadow-lg border-primary text-center"
        style={{ width: "100%", backgroundColor: "#e3f2fd", color: "black", borderRadius: "10px", maxWidth: '800px', margin: '0 auto' }}
      >
        <Card.Body>
          <Card.Title className="text-primary fs-3 mb-2">Hello, {formData.fullName}! (Your Profile)</Card.Title>
          <p className="text-muted">{formData.email}</p>
          <hr />

          <div className="text-start row">
            <div className="col-md-6 mb-3">
              <strong className="text-dark">Your Skills:</strong>
              <p className="text-success fw-bold">{skills}</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong className="text-dark">Want to Learn:</strong>
              <p className="text-warning fw-bold">{wantToLearn}</p>
            </div>
            <div className="col-12 mb-3">
              <strong className="text-dark">Location:</strong> {location}
            </div>
            <div className="col-12 mb-3">
              <strong className="text-dark">About Me:</strong> 
              <p>{about}</p>
            </div>
          </div>

          <Button 
            variant="contained" 
            color="primary"
            className="mt-3 w-100 fw-bold"
            onClick={() => setIsEditing(true)} 
            style={{ backgroundColor: "#0d6efd", color: "white" }}
          >
            Edit Profile
          </Button>
        </Card.Body>
      </Card>
    );
  };

  const renderProfileForm = () => (
    <div className="card bg-light text-dark shadow-lg border-light rounded-4 p-4">
      <h2 className="text-center mb-2 fw-bold text-primary">
        {isEditing && formData.fullName ? "EDIT PROFILE" : "CREATE PROFILE"}
      </h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input type="text" className="form-control" required name="fullName" value={formData.fullName} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Email Address</label>
          <input type="email" className="form-control" required name="email" value={formData.email} onChange={handleChange} readOnly={!!formData.email} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Your Skills</label>
          <input type="text" className="form-control" placeholder="e.g., Python, Design" name="skills" value={formData.skills} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Want to Learn</label>
          <input type="text" className="form-control" placeholder="e.g., Web Dev, Marketing" name="wantToLearn" value={formData.wantToLearn} onChange={handleChange} />
        </div>
        <div className="row">
          <div className="col-md-4 mb-3"><label className="form-label fw-semibold">Country</label><select className="form-select" disabled><option value="India">India</option></select></div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">State</label>
            <select className="form-select" name="state" value={formData.state} onChange={handleChange}>
              <option>Gujarat</option><option>Maharashtra</option><option>Rajasthan</option><option>Karnataka</option><option>Tamil Nadu</option><option>Kerala</option><option>Andhra Pradesh</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">City</label>
            <select className="form-select" name="city" value={formData.city} onChange={handleChange}>
              <option>Ahmedabad</option><option>Surat</option><option>Chennai</option><option>Salem</option><option>Coimbatore</option><option>Bangalore</option><option>Mumbai</option><option>Pune</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">About You</label>
          <textarea className="form-control" rows="3" name="about" value={formData.about} onChange={handleChange} placeholder="Tell others about yourself..."></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100 fw-semibold">
          Save Profile
        </button>
      </form>
    </div>
  );

  // --- Main Render ---
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Skill<span className="text-dark">X</span>change</a>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact">Contact Us</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/profile/suggestion">Suggestions</Link></li>
            </ul>
             <Button component={Link} to="/profile" variant="outlined" style={{ border: "2px solid white", color: "white", backgroundColor: "#0d6efd", marginRight: "10px" }}>Profile</Button>
            <Button onClick={handleLogout} variant="outlined" style={{ border: "2px solid white", color: "white", backgroundColor: "red" }}>Logout</Button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            {isEditing ? renderProfileForm() : renderProfileView()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;