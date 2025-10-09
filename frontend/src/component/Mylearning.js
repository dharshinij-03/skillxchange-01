import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SkillCard from "./SkillCard"; // Assuming this component exists
import { Avatar, ButtonBase } from "@mui/material";

// Helper function to safely load connections from localStorage
const loadConnectedProfiles = () => {
    try {
        const connectionsString = localStorage.getItem("connectedProfiles");
        return connectionsString ? JSON.parse(connectionsString) : [];
    } catch (e) {
        console.error("Error loading connected profiles from localStorage:", e);
        return [];
    }
};

const MyLearning = () => {
    const [connectedProfiles, setConnectedProfiles] = useState(loadConnectedProfiles());
    const [avatarSrc, setAvatarSrc] = useState("");
    const isLoggedIn = localStorage.getItem("token") !== null;

    // Reload profiles when the component mounts
    useEffect(() => {
        setConnectedProfiles(loadConnectedProfiles());
    }, []);
    
    // Function to handle removing a connection (optional but recommended)
    const handleRemoveConnection = (emailToRemove) => {
        const newConnections = connectedProfiles.filter(p => p.email !== emailToRemove);
        setConnectedProfiles(newConnections);
        localStorage.setItem("connectedProfiles", JSON.stringify(newConnections));
        alert("Connection removed successfully.");
    };

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarSrc(URL.createObjectURL(file));
        }
    };
    
    // Dummy Logout function for completeness (assuming you're importing a shared one)
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        // navigate("/"); // You would need useNavigate() hook here
        window.location.href = "/";
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
                                <Link className="nav-link" to="/profile/suggestion">Suggestions</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/my-learning">My Learning</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/about">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/contact">Contact Us</Link>
                            </li>
                        </ul>

                        {isLoggedIn && (
                            <>
                                <button
                                    className="btn btn-danger me-3"
                                    onClick={handleLogout}
                                >
                                    LogOut
                                </button>
                                <Link to="/profile" className="btn btn-info me-3">
                                    Profile
                                </Link>
                            </>
                        )}

                        <ButtonBase component="label">
                            <Avatar alt="Upload new avatar" src={avatarSrc} />
                            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                        </ButtonBase>
                    </div>
                </div>
            </nav>

            <div className="container py-5" style={{ position: "relative", zIndex: 1 }}>
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-success">
                        📚 My Learning Network
                    </h2>
                    <p className="text-muted">
                        Profiles you have connected with and are learning from.
                    </p>
                </div>

                <div className="row justify-content-center">
                    {connectedProfiles.length > 0 ? (
                        connectedProfiles.map((profile, i) => (
                            <div key={i} className="col-md-4 col-sm-6 d-flex justify-content-center mb-4">
                                <SkillCard 
                                    skill={profile} 
                                    showRemove={true} // Prop to show a remove button
                                    onRemove={() => handleRemoveConnection(profile.email)} // Pass remove handler
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <div className="alert alert-info" role="alert">
                                You haven't connected with anyone yet. 
                                Go to the <Link to="/profile/suggestion">Suggestions</Link> page to find a partner!
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyLearning;