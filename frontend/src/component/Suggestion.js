import React, { useState, useEffect } from "react"; // ⭐ IMPORT useEffect
import { Link, useNavigate } from "react-router-dom";
// NOTE: Assuming SkillCard is in the same directory or correctly imported
import SkillCard from "./SkillCard";
import { Button } from "react-bootstrap";
import { ButtonBase, Avatar } from "@mui/material";

// --- START: NEW/CORRECTED MATCHING HELPERS (No Change) ---

/**
 * Cleans and normalizes a comma-separated skill string into a Set of unique, lower-cased skills.
 * This is crucial for accurate matching.
 */
const normalizeSkills = (skillsString) => {
    if (!skillsString) return new Set();

    // Split by comma, lowercase, trim whitespace, and filter out empty strings
    return new Set(
        skillsString
            .toLowerCase()
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
    );
};

/**
 * Checks if there is any overlap (intersection) between two skill sets.
 * Used for checking reciprocal conditions.
 */
const checkSkillIntersection = (setA, setB) => {
    // If setA has any elements that are also in setB, return true
    for (const skill of setA) {
        if (setB.has(skill)) {
            return true;
        }
    }
    return false;
};

// --- END: NEW/CORRECTED MATCHING HELPERS ---

const Suggestion = () => {
    const [search, setSearch] = useState("");
    const [learnSearch, setLearnSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("All");
    const [avatarSrc, setAvatarSrc] = useState("");
    const [matchMode, setMatchMode] = useState(false);
    const [currentMatches, setCurrentMatches] = useState([]);
    // ⭐ NEW STATE: Store the list of connected profile emails for quick lookup
    const [connectedEmails, setConnectedEmails] = useState(new Set());

    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem("token") !== null;

    // --- NEW: Load Connected Profiles on Mount/Update ---
    useEffect(() => {
        const loadConnectedProfiles = () => {
            const connectionsString = localStorage.getItem("connectedProfiles");
            if (connectionsString) {
                try {
                    const connections = JSON.parse(connectionsString);
                    // Map the array of profiles to a Set of emails for O(1) lookup
                    const emails = new Set(connections.map(p => p.email));
                    setConnectedEmails(emails);
                } catch (e) {
                    console.error("Error parsing connected profiles from localStorage", e);
                    setConnectedEmails(new Set());
                }
            } else {
                setConnectedEmails(new Set());
            }
        };
        loadConnectedProfiles();
    }, []); // Run only once on component mount

    // Current User Profile (Example)
    const currentUserProfile = {
        // This simulates fetching your current user's profile data
        skills: "HTML, CSS",
        wantToLearn: "Java, Spring Boot",
        location: "Mumbai",
        email: localStorage.getItem("userEmail") || "placeholder@mail.com" // Use stored email for self-exclusion
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

    // ⭐ UPDATED: Logic to save connected profile to localStorage
    const handleConnect = (profile) => {
        // 1. Get current connections from localStorage
        const connectionsString = localStorage.getItem("connectedProfiles");
        let connections = connectionsString ? JSON.parse(connectionsString) : [];

        // 2. Check if the profile is already connected (use email as unique ID)
        const alreadyConnected = connections.some(p => p.email === profile.email);

        if (!alreadyConnected) {
            // 3. Add the new profile and save back to localStorage
            connections.push(profile);
            localStorage.setItem("connectedProfiles", JSON.stringify(connections));
            // 4. Update the connectedEmails state to trigger a re-render and change the button text
            setConnectedEmails(prev => new Set(prev).add(profile.email)); // Create a new Set to trigger update
            alert(`You are now connected with ${profile.name}! Check 'My Learning'.`);
        } else {
            alert(`You are already connected with ${profile.name}.`);
        }
    };

    // NOTE: This array should ideally be populated by fetching all profiles from your MERN backend.
    const allSkills = [
        // ... (allSkills array remains the same)
        {
            name: "Perfect Matcher",
            skill: "Senior Java Developer", // Primary skill field
            wantToLearn: "HTML, UI Design", // Needs a skill you know (HTML)
            email: "perfect@mail.com",
            location: "Pune",
            online: true,
            rating: 5,
            bio: "Expert in backend development.",
            knownSkills: ["Java", "Spring Boot", "MySQL"], // Additional known skills
        },
        {
            name: "Rahul",
            skill: "Node.js Developer",
            wantToLearn: "HTML,Css", // Needs a skill you know (HTML, CSS) -> YES
            email: "rahul@mail.com",
            location: "Ahmedabad",
            online: true,
            rating: 4,
            bio: "Full Stack Developer",
            knownSkills: ["JavaScript", "Express", "MongoDB"], // Does NOT know a skill you want (Java, Spring Boot) -> NO
        },
        {
            name: "Rohit",
            skill: "Java Developer",
            wantToLearn: "React", // Does NOT need a skill you know (HTML, CSS) -> NO
            email: "rohit@mail.com",
            location: "Chennai",
            online: true,
            rating: 4,
            bio: "Java & Spring Boot Developer",
            knownSkills: ["Java", "Spring Boot", "Hibernate"], // Knows a skill you want (Java, Spring Boot)
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

        // 1. Normalize Current User's Skills ONCE
        const userKnowsSet = normalizeSkills(currentUserProfile.skills);
        const userWantsToLearnSet = normalizeSkills(currentUserProfile.wantToLearn);

        if (userKnowsSet.size === 0 || userWantsToLearnSet.size === 0) {
            alert("Your profile is incomplete. Please add skills or wants-to-learn fields.");
            setCurrentMatches([]);
            return;
        }

        const matches = allSkills.filter((otherUser) => {
            // 2. Exclude self
            if (otherUser.email === currentUserProfile.email) return false;

            // 3. Combine other user's known skills (from 'skill' field and 'knownSkills' array)
            let allProviderSkills = new Set();
            if (otherUser.skill) {
                // Add the primary skill
                normalizeSkills(otherUser.skill).forEach(skill => allProviderSkills.add(skill));
            }
            if (otherUser.knownSkills) {
                // Add skills from the array
                otherUser.knownSkills.forEach(skill => allProviderSkills.add(skill.toLowerCase().trim()));
            }

            const providerKnowsSet = allProviderSkills;
            const providerWantsSet = normalizeSkills(otherUser.wantToLearn);

            // Condition A (Current User can teach Provider):
            // Provider's Wants To Learn INTERSECT Seeker's Knows
            const needsYourSkill = checkSkillIntersection(
                providerWantsSet,
                userKnowsSet
            );

            // Condition B (Provider can teach Current User):
            // Provider's Knows INTERSECT Seeker's Wants To Learn
            const canSupplySkill = checkSkillIntersection(
                providerKnowsSet,
                userWantsToLearnSet
            );

            // TRUE only if BOTH conditions for a reciprocal exchange are met
            return canSupplySkill && needsYourSkill;
        });

        setCurrentMatches(matches);
    };

    const filteredSkills = matchMode
        ? currentMatches
        : allSkills.filter((user) => {
            // Re-implementing the original filtering logic
            const matchesGeneralSearch =
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                (user.skill && user.skill.toLowerCase().includes(search.toLowerCase()));

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
                            {/* The "My Learning" Link is ALREADY Correctly in the Suggestions nav */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-learning">My Learning</Link>
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
                            {matchMode ? "Matches found" : "Find My Match"}
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
                        {matchMode ? " Skill Matches Found" : "Explore Available Skills"}
                    </h2>
                    <p className="text-muted">
                        {matchMode
                            ? `Showing users who offer: ${currentUserProfile.wantToLearn || 'N/A'} AND need: ${currentUserProfile.skills || 'N/A'}`
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
                                {/* ⭐ UPDATED: Pass the isConnected prop to SkillCard */}
                                <SkillCard
                                    skill={s}
                                    onConnect={handleConnect}
                                    showConnect={true} // Keep this to ensure the button is visible
                                    isConnected={connectedEmails.has(s.email)} // NEW PROP
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center mt-4">
                            {matchMode
                                ? "No matches found. Try refining your skills or wants-to-learn!"
                                : "No results found matching your criteria. Try adjusting your filters!"}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Suggestion;