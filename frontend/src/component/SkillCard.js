import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SkillCard = ({ skill }) => {
    const navigate = useNavigate();

    const handleConnect = () => {
        alert(`Your connection request to ${skill.name} has been sent`);
        navigate("/chat");
    };

    // Helper function to render a single skill string (comma-separated or array)
    const renderSkillsBadge = (skillsData, title, color) => {
        let skillsArray = [];
        
        // Handle both comma-separated string (wantToLearn) and array (knownSkills)
        if (Array.isArray(skillsData)) {
            skillsArray = skillsData;
        } else if (typeof skillsData === 'string' && skillsData) {
            skillsArray = skillsData.split(',').map(s => s.trim()).filter(s => s.length > 0);
        } else {
            return (
                 <div className="mb-3 text-start">
                    <strong style={{ color: "black" }}>{title}:</strong> <br />
                    <span className="text-muted">Not added</span>
                </div>
            );
        }

        return (
             <div className="mb-3 text-start">
                <strong style={{ color: "black" }}>{title}:</strong> <br />
                {skillsArray.map((s, idx) => (
                    <span
                        key={idx}
                        className="badge me-1 my-1"
                        style={{
                            backgroundColor: "transparent",
                            color: color,
                            border: `1px solid ${color}`,
                            borderRadius: "4px",
                            padding: "0.25em 0.5em",
                            fontSize: "0.85em",
                            fontWeight: 600,
                        }}
                    >
                        {s}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <Card
            className="shadow-lg border-3 text-center"
            style={{
                width: "22rem",
                backgroundColor: "#bdd3e9ff", // Reverting to original card background
                color: "white",
                position: "relative",
                borderRadius: "10px"
            }}
        >
            <Card.Body>
                {/* Profile Image with Online/Offline Dot */}
                <div className="d-flex justify-content-center mb-3" style={{ position: "relative" }}>
                    <img
                        src={skill.profileImage || "https://via.placeholder.com/100"}
                        alt={`${skill.name}'s profile`}
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "2px solid #eef0eeff",
                        }}
                    />
                    {/* Online/Offline Badge */}
                    <div
                        className="d-flex justify-content-between align-items-center mb-2"
                        style={{ position: "absolute", top: 0, right: 0 }}
                    >
                        <span
                            className={`badge rounded-pill ${skill.online ? "bg-success" : "bg-danger"}`}
                        >
                            {skill.online ? "Online" : "Offline"}
                        </span>
                    </div>
                </div>

                {/* Name + Bio */}
                <Card.Title className="mb-1" style={{ color: "black" }}>{skill.name}</Card.Title>
                {skill.bio && (
                    <Card.Subtitle className="mb-2 text-dark" style={{ fontSize: "0.9rem" }}>
                        {skill.bio}
                    </Card.Subtitle>
                )}

                {/* Skill (Primary Field) */}
                <Card.Subtitle className="mb-2 text-dark" style={{ color: "#adb5bd"}}>
                    {skill.skill}
                </Card.Subtitle>

                {/* Rating */}
                <div className="mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} style={{ color: i < skill.rating ? "#ffc107" : "#6c757d" }}>
                            ★
                        </span>
                    ))}
                </div>

                {/* Details */}
                <Card.Text className="mb-1 text-start" style={{ color: "black" }}>
                    <strong>Location:</strong> {skill.location} <br />
                    <strong>Email:</strong> {skill.email}
                </Card.Text>

                {/* Known Skills - Using the new helper function for cleanliness */}
                {renderSkillsBadge(skill.knownSkills, "Known Skills (Offer)", "#808000")}

                {/* NEWLY ADDED SECTION TO DISPLAY WANTS TO LEARN */}
                {renderSkillsBadge(skill.wantToLearn, "Wants to Learn (Need)", "#0d6efd")}
                {/* END NEWLY ADDED SECTION */}

                {/* Action Buttons */}
                <div className="d-flex gap-2 justify-content-center">
                    <Button variant="outline-primary" size="sm">
                        View Profile
                    </Button>
                    <Button
                        variant="success"
                        size="sm"
                        onClick={handleConnect}
                    >
                        Connect
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default SkillCard;