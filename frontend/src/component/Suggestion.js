import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SkillCard from "./SkillCard";
import { Button } from "react-bootstrap";
import { ButtonBase, Avatar } from "@mui/material";

const Suggestion = () => {
  const [search, setSearch] = useState("");
  const [learnSearch, setLearnSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [avatarSrc, setAvatarSrc] = useState("");
  const [matchMode, setMatchMode] = useState(false);
  const [currentMatches, setCurrentMatches] = useState([]);

  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("token") !== null;

  // Current User Profile (Example)
  const currentUserProfile = {
    skills: "HTML, CSS",
    wantToLearn: "Java, Spring Boot",
    location: "Mumbai",
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarSrc(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const allSkills = [
    {
      name: "Perfect Matcher",
      skill: "Senior Java Developer",
      wantToLearn: "HTML, UI Design",
      email: "perfect@mail.com",
      location: "Pune",
      online: true,
      rating: 5,
      bio: "Expert in backend development.",
      knownSkills: ["Java", "Spring Boot", "MySQL"],
    },
    {
      name: "Rahul",
      skill: "Node.js Developer",
      wantToLearn: "HTML,Css",
      email: "rahul@mail.com",
      location: "Ahmedabad",
      online: true,
      rating: 4,
      bio: "Full Stack Developer",
      knownSkills: ["JavaScript", "Express", "MongoDB"],
    },
    {
      name: "Rohit",
      skill: "Java Developer",
      wantToLearn: "React",
      email: "rohit@mail.com",
      location: "Chennai",
      online: true,
      rating: 4,
      bio: "Java & Spring Boot Developer",
      knownSkills: ["Java", "Spring Boot", "Hibernate"],
    },
    {
      name: "Aisha",
      skill: "Graphic Designer",
      wantToLearn: "Video Editing",
      email: "aisha@mail.com",
      location: "Surat",
      online: false,
      rating: 5,
      bio: "Creative Designer",
      profileImage: "https://randomuser.me/api/portraits/women/40.jpg",
      knownSkills: ["Photoshop", "Illustrator", "Figma"],
    },
    {
      name: "Vikram",
      skill: "Python Developer",
      wantToLearn: "DevOps, AWS",
      email: "vikram@mail.com",
      location: "Pune",
      online: true,
      rating: 4,
      bio: "Backend Python Expert",
      profileImage: "https://randomuser.me/api/portraits/men/30.jpg",
      knownSkills: ["Python", "Django", "Flask"],
    },
    {
      name: "Neha",
      skill: "UI/UX Designer",
      wantToLearn: "Framer",
      email: "neha@mail.com",
      location: "Mumbai",
      online: true,
      rating: 5,
      bio: "User Experience Specialist",
      profileImage: "https://randomuser.me/api/portraits/women/40.jpg",
      knownSkills: ["Figma", "Sketch", "Adobe XD"],
    },
    {
      name: "Karan",
      skill: "React Developer",
      wantToLearn: "Node.js, GraphQL",
      email: "karan@mail.com",
      location: "Delhi",
      online: false,
      rating: 4,
      bio: "Frontend React Expert",
      profileImage: "https://randomuser.me/api/portraits/men/50.jpg",
      knownSkills: ["React", "Redux", "JavaScript"],
    },
    {
      name: "Sanya",
      skill: "Digital Marketing",
      wantToLearn: "Data Analysis",
      email: "sanya@mail.com",
      location: "Bangalore",
      online: true,
      rating: 5,
      bio: "SEO & Ads Specialist",
      profileImage: "https://randomuser.me/api/portraits/women/60.jpg",
      knownSkills: ["SEO", "Google Ads", "Content Marketing"],
    },
    {
      name: "Isha",
      skill: "Data Analyst",
      wantToLearn: "Machine Learning",
      email: "isha@mail.com",
      location: "Hyderabad",
      online: false,
      rating: 5,
      bio: "Data Analysis & Visualization",
      profileImage: "https://randomuser.me/api/portraits/women/80.jpg",
      knownSkills: ["Excel", "Python", "Tableau"],
    },
    {
      name: "Ankit",
      skill: "Full Stack Developer",
      wantToLearn: "Tailwind CSS",
      email: "ankit@mail.com",
      location: "Noida",
      online: true,
      rating: 4,
      bio: "Node.js & React Expert",
      profileImage: "https://randomuser.me/api/portraits/men/90.jpg",
      knownSkills: ["Node.js", "React", "MongoDB"],
    },
  ];

  const locations = [
    "All",
    "Ahmedabad",
    "Surat",
    "Rajkot",
    "Vadodara",
    "Gandhinagar",
    "Chennai",
    "Pune",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Noida",
  ];

  const checkSkillOverlap = (targetSkillsString, userSkills) => {
    if (!targetSkillsString || !userSkills) return false;
    const targets = targetSkillsString
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const user = userSkills
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return targets.some((target) =>
      user.some((u) => target.includes(u) || u.includes(target))
    );
  };

  const handleFindMatch = () => {
    setSearch("");
    setLearnSearch("");
    setLocationFilter("All");
    setMatchMode(true);

    if (!currentUserProfile.skills || !currentUserProfile.wantToLearn) {
      alert("Please set up both your skills and what you want to learn in your profile first!");
      setCurrentMatches([]);
      return;
    }

    const matches = allSkills.filter((otherUser) => {
      let otherUserKnownSkillsString = otherUser.skill || "";
      if (otherUser.knownSkills && otherUser.knownSkills.length > 0) {
        otherUserKnownSkillsString += "," + otherUser.knownSkills.join(",");
      }

      const canSupplySkill = checkSkillOverlap(
        otherUserKnownSkillsString,
        currentUserProfile.wantToLearn
      );
      const needsYourSkill = checkSkillOverlap(
        otherUser.wantToLearn,
        currentUserProfile.skills
      );

      return canSupplySkill && needsYourSkill;
    });

    setCurrentMatches(matches);
  };

  const filteredSkills = matchMode
    ? currentMatches
    : allSkills.filter((user) => {
        const matchesGeneralSearch =
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.skill.toLowerCase().includes(search.toLowerCase());

        const matchesLearnSearch =
          learnSearch === "" ||
          (user.wantToLearn &&
            user.wantToLearn.toLowerCase().includes(learnSearch.toLowerCase()));

        const matchesLocation =
          locationFilter === "All" || user.location === locationFilter;

        return matchesGeneralSearch && matchesLearnSearch && matchesLocation;
      });

  const handleFilterChange = (setter) => (e) => {
    if (matchMode) setMatchMode(false);
    setter(e.target.value);
  };

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
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/profile/suggestion">Suggestions</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact Us</Link>
              </li>
            </ul>

            <Button
              variant="contained"
              onClick={handleFindMatch}
              style={{
                border: "2px solid white",
                color: "white",
                backgroundColor: matchMode ? "#34a853" : "#0d6efd",
                marginRight: "20px",
              }}
            >
              {matchMode ? "✅ 100% Reciprocal Matches" : "🤝 Find My Match"}
            </Button>

            {isLoggedIn ? (
              <>
                <Button
                  variant="primary"
                  onClick={handleLogout}
                  style={{
                    border: "2px solid white",
                    color: "white",
                    backgroundColor: "#f40505d2",
                    marginRight: "20px",
                  }}
                >
                  LogOut
                </Button>
                <Button
                  as={Link}
                  to="/profile"
                  variant="primary"
                  style={{
                    border: "2px solid white",
                    color: "white",
                    backgroundColor: "#0d6efd",
                    marginRight: "20px",
                  }}
                >
                  Profile
                </Button>
              </>
            ) : (
              <Button
                as={Link}
                to="/"
                variant="primary"
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

            <ButtonBase component="label">
              <Avatar alt="Upload new avatar" src={avatarSrc} />
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </ButtonBase>
          </div>
        </div>
      </nav>

      <div className="container py-5" style={{ position: "relative", zIndex: 1 }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">
            {matchMode ? "🎯 100% Reciprocal Skill Matches Found" : "Explore Available Skills"}
          </h2>
          <p className="text-muted">
            {matchMode
              ? "These users both offer the skill you need (Java) AND need the skill you offer (HTML)."
              : "Find other members ready for an exchange by skill or location."}
          </p>
          {matchMode && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMatchMode(false)}
              className="mt-2"
            >
              Clear Matches & Return to General Search
            </Button>
          )}
        </div>

        {!matchMode && (
          <div className="row justify-content-center mb-4 g-3">
            <div className="col-md-4 col-sm-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or skill I can teach..."
                value={search}
                onChange={handleFilterChange(setSearch)}
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <input
                type="text"
                className="form-control"
                placeholder="Find someone who wants to learn..."
                value={learnSearch}
                onChange={handleFilterChange(setLearnSearch)}
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <select
                className="form-select"
                value={locationFilter}
                onChange={handleFilterChange(setLocationFilter)}
              >
                <option value="All">All Locations</option>
                {locations.slice(1).map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="row justify-content-center">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((s, i) => (
              <div key={i} className="col-md-4 col-sm-6 d-flex justify-content-center mb-4">
                <SkillCard skill={s} />
              </div>
            ))
          ) : (
            <p className="text-muted text-center mt-4">
              {matchMode
                ? "No 100% reciprocal matches found. Only users who both offer Java AND need HTML will appear here."
                : "No results found matching your criteria. Try adjusting your filters!"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Suggestion;
