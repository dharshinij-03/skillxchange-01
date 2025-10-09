import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Card } from "react-bootstrap";
import axios from "axios";

const Profile = () => {
    const navigate = useNavigate();

    const initialEmail = localStorage.getItem("userEmail") || "";

    const [formData, setFormData] = useState({
        fullName: "",
        email: initialEmail,
        skills: "",         // Stored as comma-separated string in state/form
        wantToLearn: "",    // Stored as comma-separated string in state/form
        state: "",
        city: "",
        about: "",
    });

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Helper to turn comma-separated string into a clean array
    const cleanSkills = (skillString) => {
        if (!skillString) return [];
        return skillString
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
    };

    // --- Profile Fetch Logic ---
    useEffect(() => {
        const fetchProfile = async () => {
            const email = localStorage.getItem("userEmail");
            const token = localStorage.getItem("token");

            if (!email) {
                setLoading(false);
                setIsEditing(true);
                return;
            }

            setFormData((prev) => ({ ...prev, email: email }));

            try {
                const response = await axios.get(
                    `http://localhost:5000/api/profile/${email}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data && response.data.fullName) {
                    // *** IMPORTANT: Convert the DB arrays back to comma-separated strings for the form input ***
                    const data = {
                        ...response.data,
                        skills: Array.isArray(response.data.skills) ? response.data.skills.join(', ') : response.data.skills || "",
                        wantToLearn: Array.isArray(response.data.wantToLearn) ? response.data.wantToLearn.join(', ') : response.data.wantToLearn || "",
                    };

                    setFormData(data);
                    setIsEditing(false);
                } else {
                    setIsEditing(true);
                }
            } catch (err) {
                setFormData((prev) => ({ ...prev, email: email }));
                setIsEditing(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // --- Handlers ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // *** CRITICAL CHANGE: Prepare data for the backend, converting strings to arrays ***
        const dataToSend = {
            ...formData,
            skills: cleanSkills(formData.skills),         // Now an Array of Strings
            wantToLearn: cleanSkills(formData.wantToLearn), // Now an Array of Strings
        };

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:5000/api/profile",
                dataToSend, // Send the array version of skills to your API
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Convert back to string for state consistency if API returns arrays
            const savedData = {
                ...response.data,
                skills: Array.isArray(response.data.skills) ? response.data.skills.join(', ') : response.data.skills || "",
                wantToLearn: Array.isArray(response.data.wantToLearn) ? response.data.wantToLearn.join(', ') : response.data.wantToLearn || "",
            };

            setFormData(savedData);
            setIsEditing(false);
            alert("🎉 Profile saved successfully!");
        } catch (err) {
            console.error(
                "Failed to save profile:",
                err.response ? err.response.data : err.message
            );
            alert("❌ Failed to save profile!");
        }
    };

    // --- Helper Function to render skills as styled badges ---
    const renderSkillsAsBadges = (skillsString, bgColor, textColor) => {
        if (!skillsString) {
            return <span className="text-muted fst-italic">Not specified</span>;
        }

        const skillsArray = skillsString
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        return skillsArray.map((s, idx) => (
            <span
                key={idx}
                className="me-1 my-1 d-inline-block"
                style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    border: `1px solid ${textColor}`,
                    borderRadius: "4px",
                    padding: "0.25em 0.5em",
                    fontSize: "0.85em",
                    fontWeight: 600,
                }}
            >
                {s}
            </span>
        ));
    };

    // --- Rendering Functions (No UI/structure changes here) ---
    const renderProfileView = () => {
        const skills = formData.skills;
        const wantToLearn = formData.wantToLearn;
        const about =
            formData.about || "No bio available. Click 'Edit Profile' to add one.";
        const location =
            `${formData.city || ""}, ${formData.state || ""}`.replace(
                /^, | ,$/g,
                ""
            ) || "Location Unknown";

        return (
            <Card
                className="shadow-lg border-3 text-center"
                style={{
                    width: "22rem",
                    backgroundColor: "#f0f8ff",
                    color: "black",
                    borderRadius: "10px",
                    maxWidth: "400px",
                    margin: "0 auto",
                }}
            >
                <Card.Body>
                    {/* Mock Profile Image Area */}
                    <div className="d-flex justify-content-center mb-3">
                        <div
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                backgroundColor: "#0d6efd",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                color: "white",
                                border: "3px solid #0d6efd",
                            }}
                        >
                            {formData.fullName
                                ? formData.fullName.charAt(0).toUpperCase()
                                : "U"}
                        </div>
                    </div>

                    {/* Name + Email */}
                    <Card.Title className="mb-1 text-primary">
                        {formData.fullName || "User Profile"}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
                        {formData.email}
                    </Card.Subtitle>

                    <hr className="my-3" />

                    {/* About Me */}
                    <div className="mb-3 text-start">
                        <strong className="text-dark">📝 About Me:</strong>
                        <p className="text-secondary small fst-italic">{about}</p>
                    </div>

                    {/* Known Skills - Teaching */}
                    <div className="mb-2 text-start">
                        <strong className="text-success">✅ My Skills:</strong>
                        <br />
                        <div className="d-flex flex-wrap pt-1">
                            {renderSkillsAsBadges(skills, "#e9f7ef", "#198754")}
                        </div>
                    </div>

                    {/* Want to Learn - Seeking Mentors */}
                    <div className="mb-3 text-start">
                        <strong className="text-info">💡 Want to Learn:</strong>
                        <br />
                        <div className="d-flex flex-wrap pt-1">
                            {renderSkillsAsBadges(wantToLearn, "#e0f7fa", "#0dcaf0")}
                        </div>
                    </div>

                    <hr className="my-3" />

                    {/* Location */}
                    <Card.Text className="mb-3 text-start small text-muted">
                        <strong>📍 Location:</strong> {location}
                    </Card.Text>

                    {/* Action Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        className="w-100 fw-bold"
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
        <div
            className="card bg-light text-dark shadow-lg border-light rounded-4 p-4"
            style={{ maxWidth: "600px", margin: "0 auto" }}
        >
            <h2 className="text-center mb-2 fw-bold text-primary">
                {isEditing && formData.fullName ? "EDIT PROFILE" : "CREATE PROFILE"}
            </h2>
            <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly={!!formData.email}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">
                        Your Skills (Comma separated)
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Python, Design"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">
                        Want to Learn (Comma separated)
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Web Dev, Marketing"
                        name="wantToLearn"
                        value={formData.wantToLearn}
                        onChange={handleChange}
                    />
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Country</label>
                        <select className="form-select" disabled>
                            <option value="India">India</option>
                        </select>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">State</label>
                        <select
                            className="form-select"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        >
                            <option value="">Select State</option>
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
                        <label className="form-label fw-semibold">City</label>
                        <select
                            className="form-select"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        >
                            <option value="">Select City</option>
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
                    <label className="form-label fw-semibold">About You</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        placeholder="Tell others about yourself..."
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-semibold">
                    Save Profile
                </button>
            </form>
        </div>
    );

    // --- Main Render (No UI changes here) ---
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
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile/suggestion">
                                    Suggestions
                                </Link>
                            </li>
                        </ul>
                        <Button
                            component={Link}
                            to="/profile"
                            variant="outlined"
                            style={{
                                border: "2px solid white",
                                color: "white",
                                backgroundColor: "#0d6efd",
                                marginRight: "10px",
                            }}
                        >
                            Profile
                        </Button>
                        <Button
                            onClick={handleLogout}
                            variant="outlined"
                            style={{
                                border: "2px solid white",
                                color: "white",
                                backgroundColor: "red",
                            }}
                        >
                            Logout
                        </Button>
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