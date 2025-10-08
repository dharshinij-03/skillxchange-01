import React, { useState } from "react";
// Import useNavigate to perform the redirect after logout
import { Link, useNavigate } from "react-router-dom"; 
import SkillCard from "./SkillCard"; // Adjust path if needed
import { Button } from "react-bootstrap"; 
import { ButtonBase, Avatar } from "@mui/material"; 

const Suggestion = () => {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [avatarSrc, setAvatarSrc] = useState(""); 
  // const [showFirst, setShowFirst] = useState(false); // This is not needed for logout
  
  // 1. Initialize navigate
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarSrc(URL.createObjectURL(file));
    }
  };

  // 2. Define the proper logout handler
  const handleLogout = () => {
    // Clear user authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    
    // Redirect the user to the home or login page
    navigate("/"); 
  };


  const allSkills = [
    // ... (Your allSkills data remains the same) ...
    {
        name: "Rahul",
        skill: "Node.js Developer",
        email: "rahul@mail.com",
        location: "Ahmedabad",
        online: true,
        rating: 4,
        bio: "Full Stack Developer",
        profileImage: "https://randomuser.me/api/portraits/men/10.jpg",
        knownSkills: ["JavaScript", "Express", "MongoDB"]
    },
    {
        name: "Aisha",
        skill: "Graphic Designer",
        email: "aisha@mail.com",
        location: "Surat",
        online: false,
        rating: 5,
        bio: "Creative Designer",
        profileImage: "https://randomuser.me/api/portraits/women/40.jpg",
        knownSkills: ["Photoshop", "Illustrator", "Figma"]
    },
    {
        name: "Vikram",
        skill: "Python Developer",
        email: "vikram@mail.com",
        location: "Pune",
        online: true,
        rating: 4,
        bio: "Backend Python Expert",
        profileImage: "https://randomuser.me/api/portraits/men/30.jpg",
        knownSkills: ["Python", "Django", "Flask"]
    },
    {
        name: "Neha",
        skill: "UI/UX Designer",
        email: "neha@mail.com",
        location: "Mumbai",
        online: true,
        rating: 5,
        bio: "User Experience Specialist",
        profileImage: "https://randomuser.me/api/portraits/women/40.jpg",
        knownSkills: ["Figma", "Sketch", "Adobe XD"]
    },
    {
        name: "Karan",
        skill: "React Developer",
        email: "karan@mail.com",
        location: "Delhi",
        online: false,
        rating: 4,
        bio: "Frontend React Expert",
        profileImage: "https://randomuser.me/api/portraits/men/50.jpg",
        knownSkills: ["React", "Redux", "JavaScript"]
    },
    {
        name: "Sanya",
        skill: "Digital Marketing",
        email: "sanya@mail.com",
        location: "Bangalore",
        online: true,
        rating: 5,
        bio: "SEO & Ads Specialist",
        profileImage: "https://randomuser.me/api/portraits/women/60.jpg",
        knownSkills: ["SEO", "Google Ads", "Content Marketing"]
    },
    {
        name: "Rohit",
        skill: "Java Developer",
        email: "rohit@mail.com",
        location: "Chennai",
        online: true,
        rating: 4,
        bio: "Java & Spring Boot Developer",
        profileImage: "https://randomuser.me/api/portraits/men/70.jpg",
        knownSkills: ["Java", "Spring Boot", "Hibernate"]
    },
    {
        name: "Isha",
        skill: "Data Analyst",
        email: "isha@mail.com",
        location: "Hyderabad",
        online: false,
        rating: 5,
        bio: "Data Analysis & Visualization",
        profileImage: "https://randomuser.me/api/portraits/women/80.jpg",
        knownSkills: ["Excel", "Python", "Tableau"]
    },
    {
        name: "Ankit",
        skill: "Full Stack Developer",
        email: "ankit@mail.com",
        location: "Noida",
        online: true,
        rating: 4,
        bio: "Node.js & React Expert",
        profileImage: "https://randomuser.me/api/portraits/men/90.jpg",
        knownSkills: ["Node.js", "React", "MongoDB"]
    },
  ];


  const locations = ["All", "Ahmedabad", "Surat", "Rajkot", "Vadodara", "Gandhinagar","Chennai","Pune","Mumbai","Delhi","Bangalore","Hyderabad","Noida"];

  const filteredSkills = allSkills.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.skill.toLowerCase().includes(search.toLowerCase());
    const matchesLocation =
      locationFilter === "All" || user.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Skill<span className="text-dark">X</span>change
          </a>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact Us</Link>
              </li>
            </ul>

            {/* 3. Bind the handler to the Logout button */}
            <Button
              variant="primary"
              onClick={handleLogout} // ✅ FIX: Call the handleLogout function
              style={{ border: "2px solid white", color: "white", backgroundColor: "#f40505d2", marginRight: "20px" }}
            >
              LogOut
            </Button>

            <Button
              as={Link}
              to="/profile"
              variant="primary"
              style={{ border: "2px solid white", color: "white", backgroundColor: "#0d6efd", marginRight: "20px" }}
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
      {/* ... (Rest of the Suggestion component remains the same) ... */}
      <div className="container py-5" style={{ position: "relative", zIndex: 1 }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Explore Available Skills</h2>
          <p className="text-muted">Find learners or mentors by skill or location.</p>
        </div>

        <div className="row justify-content-center mb-4">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <select
              className="form-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              {locations.map((loc, i) => (
                <option key={i} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row justify-content-center">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((s, i) => (
              <div key={i} className="col-md-4 col-sm-6 d-flex justify-content-center mb-4">
                <SkillCard skill={s} />
              </div>
            ))
          ) : (
            <p className="text-muted text-center mt-4">No results found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Suggestion;
// SkillCard.js and App.js remain correct as provided by you.