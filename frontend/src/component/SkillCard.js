import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SkillCard = ({ skill }) => {
  const navigate = useNavigate(); // Initialize navigate

  const handleConnect = () => {
    alert("Your connection request has been sent");
    navigate("/chat"); // Navigate to the chat page
  };

  return (
    <Card
      className="shadow-sm border-3 text-center"
      style={{
        width: "22rem",
        backgroundColor: "#bdd3e9ff",
        color: "white",
        position: "relative",
        borderRadius:"10px"
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

        {/* Skill */}
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

        {/* Known Skills */}
        <div className="mb-3 text-start">
          <strong style={{ color: "black" }}>Known Skills:</strong> <br />
          {skill.knownSkills && skill.knownSkills.length > 0 ? (
            skill.knownSkills.map((ks, idx) => (
              <span
                key={idx}
                className="badge me-1"
                style={{
                  backgroundColor: "transparent",
                  color: "#808000",
                  border: "1px solid #808000",
                  borderRadius: "4px",
                  padding: "0.25em 0.5em",
                  fontSize: "0.85em",
                }}
              >
                {ks}
              </span>
            ))
          ) : (
            <span className="text-muted">Not added</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 justify-content-center">
          <Button variant="outline-primary" size="sm">
            View Profile
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={handleConnect} // Use handleConnect function
          >
            Connect
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SkillCard;
