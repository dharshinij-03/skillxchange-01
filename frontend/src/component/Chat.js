import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function App() {
  const [messages, setMessages] = useState([{ sender: "Me", text: "Hi" }]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Chat send
  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "Me", text: input }]);
    setInput("");
  };

  // File select
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // Upload action with loading
  const handleUpload = () => {
    if (files.length === 0) {
      alert("Please select files to upload!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newUploads = files.map((file) => ({
        file,
        url: URL.createObjectURL(file), // create preview URL
      }));
      setUploadedFiles([...uploadedFiles, ...newUploads]);
      setFiles([]);
      setLoading(false);
    }, 2000); // 2 sec fake loading
  };

  // Complete session
  const handleComplete = () => {
    setSessionComplete(true);
  };

  return (
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
                    <strong>{msg.sender}:</strong> {msg.text}
                  </p>
                ))}
              </div>

              {/* Input field */}
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

              {/* Enhanced Complete Button */}
              {!sessionComplete ? (
                <button
                  className="btn btn-success w-100 fw-semibold rounded-3 shadow-sm"
                  onClick={handleComplete}
                 
                >
                   <Link className="nav-link active" to="/">✅ Complete Session</Link>
                  
                </button>
              ) : (
                <div className="alert alert-success text-center fw-bold mt-2 rounded-3">
                  🎉 Session Completed Successfully!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="col-md-8 d-flex flex-column">
          <div className="card flex-grow-1 shadow-sm border-0 rounded-4 p-3">
            <div className="text-center text-muted">
              <div className="fs-1 mb-3">📂</div>
              <h5 className="fw-bold text-dark">Upload Course Videos</h5>
              <p className="small">Choose files to upload</p>

              {/* File input */}
              <input
                type="file"
                accept="video/*"
                className="form-control mb-3"
                multiple
                onChange={handleFileChange}
              />

              {/* Upload button with loader */}
              <button
                className="btn btn-secondary fw-semibold rounded-3 px-4"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  "Upload"
                )}
              </button>

              {/* Show uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 text-start">
                  <h6 className="fw-bold">Uploaded Files:</h6>
                  <ul className="list-unstyled small">
                    {uploadedFiles.map((fileObj, idx) => (
                      <li key={idx}>
                        📄{" "}
                        <button
                          className="btn btn-link p-0"
                          onClick={() => setSelectedVideo(fileObj.url)}
                        >
                          {fileObj.file.name}
                        </button>
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
  );
}
