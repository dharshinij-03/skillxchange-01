import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import { Button } from "@mui/material";

// IMPORTANT: Assuming 'java.pdf' is located at '../Asstes/java.pdf' relative to Chat.js
import partnerDemoPdf from '../Asstes/java.pdf';

// Define the simulated partner file using the imported path
const PARTNER_DEMO_FILE = {
    file: { name: "lesson_plan_demo.pdf", type: "application/pdf" },
    url: partnerDemoPdf
};

export default function Chat() {
    const navigate = useNavigate();
    const [avatarSrc, setAvatarSrc] = useState(undefined);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // --- State for Chat Functionality ---
    const [messages, setMessages] = useState([{ sender: "Me", text: "Hi" }]);
    const [input, setInput] = useState("");
    const [files, setFiles] = useState([]); // Files selected for *next* upload
    const [uploadedFiles, setUploadedFiles] = useState([]); // User's successfully uploaded files
    const [partnerFiles, setPartnerFiles] = useState([]); // Partner's simulated files
    const [loading, setLoading] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [rating, setRating] = useState(0);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    // ------------------------------------

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        } else {
            // Redirect to home if not logged in
            navigate("/");
        }
    }, [navigate]);

    // Handle avatar upload
    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setAvatarSrc(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        navigate("/");
    };

    // Chat send logic with partner response and file simulation
    const sendMessage = () => {
        if (input.trim() === "") return;
        const userMessage = input;

        // 1. Add user's message immediately
        setMessages((prev) => [...prev, { sender: "Me", text: userMessage }]);
        setInput("");

        // 2. Simulate partner's response after a short delay
        setTimeout(() => {
            // Add partner's text message
            setMessages((prev) => [
                ...prev,
                { sender: "Partner", text: "That's a good question! I just uploaded a quick PDF guide for that concept." }
            ]);

            // 3. Simulate partner's file upload (demo.pdf)
            setPartnerFiles((prev) => {
                const isAlreadySent = prev.some(f => f.file.name === PARTNER_DEMO_FILE.file.name);
                if (!isAlreadySent) {
                    return [...prev, PARTNER_DEMO_FILE];
                }
                return prev;
            });
        }, 1500); // 1.5 second delay
    };

    // File select (for the current user)
    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    // Upload action (for the current user)
    const handleUpload = () => {
        if (files.length === 0) {
            alert("Please select files to upload!");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const newUploads = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));
            setUploadedFiles([...uploadedFiles, ...newUploads]);
            setFiles([]);
            setLoading(false);
        }, 2000);
    };

    // Complete session
    const handleComplete = () => {
        setSessionComplete(true);
    };

    // Function to handle rating submission
    const handleRatingSubmit = () => {
        if (rating === 0) {
            alert("Please select a rating before submitting!");
            return;
        }
        console.log(`Submitting rating: ${rating} stars to partner.`);
        setRatingSubmitted(true);
        alert(`Thank you for rating your session ${rating} stars! Redirecting you home.`);
        // In a real app, you would send the rating to your backend here
        setTimeout(() => navigate("/"), 2000); // Redirect after alert and delay
    };


    // Star Rating Component (5 stars)
    const StarRating = () => {
        return (
            <div className="d-flex justify-content-center my-3">
                {[1, 2, 3, 4, 5].map((starValue) => (
                    <span
                        key={starValue}
                        onClick={() => !ratingSubmitted && setRating(starValue)}
                        style={{
                            cursor: ratingSubmitted ? 'default' : 'pointer',
                            fontSize: '1.8rem',
                            color: starValue <= rating ? '#ffc107' : '#e4e5e9',
                            transition: 'color 0.2s',
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    // Combine user's and partner's uploaded files for display
    const allFiles = [...uploadedFiles, ...partnerFiles];

    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        Skill<span className="text-dark">X</span>change
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/about-us">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/contact">Contact Us</Link>
                            </li>
                            {isLoggedIn && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile/suggestion">Suggestions</Link>
                                </li>
                            )}
                            <li className="nav-item">
                                <span className="nav-link active fw-bold text-white bg-secondary rounded-pill px-3">
                                    Current Session
                                </span>
                            </li>
                        </ul>

                        {/* Profile and Logout buttons for logged-in users */}
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
            {/* End Navbar */}

            <div className="container-fluid min-vh-100 bg-light d-flex align-items-stretch p-4">
                <div className="row flex-grow-1 w-100 g-4">

                    {/* Chat Section */}
                    <div className="col-md-4 d-flex flex-column">
                        <div className="card flex-grow-1 shadow-sm border-0 rounded-4">
                            <div className="card-header bg-white border-bottom fw-bold text-primary rounded-top-4">
                                💬 Chat
                            </div>
                            <div className="card-body d-flex flex-column">

                                {/* Chat messages */}
                                <div className="mb-3 flex-grow-1 overflow-auto border rounded bg-white p-2">
                                    {messages.map((msg, idx) => (
                                        <p key={idx} className="mb-1">
                                            <strong className={msg.sender === "Partner" ? "text-success" : "text-primary"}>
                                                {msg.sender}:
                                            </strong> {msg.text}
                                        </p>
                                    ))}
                                    {/* Display alert if partner file was "sent" */}
                                    {partnerFiles.length > 0 && (
                                        <p className="small text-muted mb-1 fst-italic text-center">
                                            (Partner has sent {partnerFiles.length} new file(s) - check the Uploads section!)
                                        </p>
                                    )}
                                </div>

                                {/* Input field (Hidden when session is complete) */}
                                {!sessionComplete && (
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Type your message..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        />
                                        <button className="btn btn-primary" onClick={sendMessage}>
                                            Send
                                        </button>
                                    </div>
                                )}

                                {/* Session Complete / Rating Section */}
                                {!sessionComplete ? (
                                    <button
                                        className="btn btn-success w-100 fw-semibold rounded-3 shadow-sm"
                                        onClick={handleComplete}
                                    >
                                        <span className="nav-link active text-white p-0">✅ Complete Session</span>
                                    </button>
                                ) : (
                                    <div className="p-3 bg-white border rounded-3 shadow-sm mt-2">
                                        <div className="alert alert-success text-center fw-bold rounded-3 mb-3">
                                            🎉 Session Completed! Please Rate Your Partner.
                                        </div>

                                        {/* ⭐ RATING SECTION ⭐ */}
                                        <h6 className="text-center fw-bold text-dark mb-1">How was the session?</h6>
                                        <StarRating />

                                        {!ratingSubmitted ? (
                                            <button
                                                className="btn btn-warning w-100 fw-semibold"
                                                onClick={handleRatingSubmit}
                                                disabled={rating === 0}
                                            >
                                                Submit {rating} Star Rating
                                            </button>
                                        ) : (
                                            // Once rated, show a button to navigate home
                                            <Link to="/" className="btn btn-primary w-100 fw-semibold">
                                                Go Back Home
                                            </Link>
                                        )}
                                        {/* ⭐ END RATING SECTION ⭐ */}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Upload Section (Combined User and Partner Files) */}
                    <div className="col-md-8 d-flex flex-column">
                        <div className="card flex-grow-1 shadow-sm border-0 rounded-4 p-3">
                            <div className="text-center text-muted">
                                <div className="fs-1 mb-3">📂</div>
                                <h5 className="fw-bold text-dark">Upload Course Videos</h5>
                                <p className="small">Choose files to upload</p>

                                {/* File input (for the current user) */}
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="form-control mb-3"
                                    multiple
                                    onChange={handleFileChange}
                                />

                                {/* Upload button with loader (for the current user) */}
                                <button
                                    className="btn btn-secondary fw-semibold rounded-3 px-4"
                                    onClick={handleUpload}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        "Upload My Files"
                                    )}
                                </button>

                                {/* Show all uploaded files (User + Partner) */}
                                {allFiles.length > 0 && (
                                    <div className="mt-4 text-start">
                                        <h6 className="fw-bold">All Shared Files:</h6>
                                        <ul className="list-unstyled small">
                                            {allFiles.map((fileObj, idx) => (
                                                <li key={idx} className="py-1">
                                                    {fileObj.file.type.includes('video') ? '🎥' : '📄'}{" "}
                                                    <a
                                                        href={fileObj.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-link p-0 text-decoration-none text-start"
                                                        onClick={(e) => {
                                                            // For videos, set the selected video to display in the player
                                                            if (fileObj.file.type.includes('video')) {
                                                                e.preventDefault();
                                                                setSelectedVideo(fileObj.url);
                                                            }
                                                            // For PDFs/other files, the default link behavior (open/download) is allowed
                                                        }}
                                                    >
                                                        {fileObj.file.name}
                                                        {partnerFiles.includes(fileObj) && <span className="text-success ms-2 fw-bold">(Partner's File)</span>}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Video Player */}
                                {selectedVideo && (
                                    <div className="mt-4">
                                        <h6 className="fw-bold">🎬 Now Playing:</h6>
                                        <video
                                            src={selectedVideo}
                                            controls
                                            className="w-100 rounded-3 shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}