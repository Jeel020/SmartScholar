import { useState, useEffect } from "react";

// Helper function for safe localStorage parsing
const getSavedValue = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

function App() {
  // 1. Safe & Lazy Initialization for localStorage
  const [assignments, setAssignments] = useState(() => getSavedValue("assignments", []));
  const [assignmentFiles, setAssignmentFiles] = useState(() => getSavedValue("assignmentFiles", []));
  const [present, setPresent] = useState(() => getSavedValue("present", 0));
  const [absent, setAbsent] = useState(() => getSavedValue("absent", 0));
  const [notesCount, setNotesCount] = useState(() => getSavedValue("notesCount", 0));
  const [darkMode, setDarkMode] = useState(() => getSavedValue("darkMode", false));

  // 2. Standard Application State
  const [notification, setNotification] = useState("");
  const [showPopup, setShowPopup] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [assignment, setAssignment] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState("");

  // 3. Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("assignmentFiles", JSON.stringify(assignmentFiles));
  }, [assignmentFiles]);

  useEffect(() => {
    localStorage.setItem("present", JSON.stringify(present));
    localStorage.setItem("absent", JSON.stringify(absent));
  }, [present, absent]);

  useEffect(() => {
    localStorage.setItem("notesCount", JSON.stringify(notesCount));
  }, [notesCount]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // 4. Computed Values
  const totalClasses = present + absent;
  const attendancePercentage =
    totalClasses === 0 ? 0 : ((present / totalClasses) * 100).toFixed(2);

  // 5. Functions
  const addAssignment = () => {
    if (assignment.trim() === "") return;

    // Fixed: Using previous state callback to prevent stale closures
    setAssignments(prev => [...prev, { name: assignment, dueDate: dueDate }]);
    setDueDate("");
    setAssignment("");

    setNotification("✅ Assignment Added Successfully");
    setTimeout(() => setNotification(""), 3000);
  };

  const generateSummary = async () => {
    if (notes.trim() === "") {
      setSummary("Please upload notes first.");
      return;
    }

    setSummary("Generating summary... Please wait ⏳");

    try {
      const response = await fetch("http://localhost:5000/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();
      
      if (data.error) {
        setSummary(`❌ Error: ${data.error}`);
      } else {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error(error);
      setSummary("❌ Backend server is not running.");
    }
  };

  const generateQuiz = async () => {
    if (notes.trim() === "") {
      setQuiz("Please upload notes first.");
      return;
    }

    setQuiz("Generating quiz... Please wait ⏳");

    try {
      const response = await fetch("http://localhost:5000/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();
      
      if (data.error) {
        setQuiz(`❌ Error: ${data.error}`);
      } else {
        setQuiz(data.quiz);
      }
    } catch (error) {
      console.error(error);
      setQuiz("❌ Backend server is not running.");
    }
  };

  // 6. Styles
  const cardStyle = {
    width: "250px",
    height: "140px",
    border: "none",
    borderRadius: "15px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    background: "linear-gradient(135deg, #b32020 0%, #169ecb 100%)",
    boxShadow: "0 6px 15px rgba(5, 82, 19, 0.87)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    color: "#242a14",
    transition: "transform 0.2s",
  };

  const backButtonStyle = {
    marginBottom: "20px",
    padding: "8px 16px",
    fontSize: "14px",
    background: "#4a5568",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const statsCardStyle = {
    background: darkMode
      ? "linear-gradient(135deg,#2c3e50,#34495e)"
      : "linear-gradient(135deg,#667eea,#764ba2)",
    padding: "20px",
    borderRadius: "20px",
    minWidth: "220px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    transition: "0.3s",
  };

  return (
    <>
      {/* Welcome Window */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              textAlign: "center",
              width: "500px",
              boxShadow: "0 10px 30px rgba(255, 248, 248, 0.3)",
            }}
          >
            <h1
              style={{
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              🎓 Welcome to SmartScholar
            </h1>

            <p style={{ fontSize: "18px", color: "#764ba2" }}>
              Your AI-Powered Academic Assistant
            </p>

            <p style={{ color: "#333" }}>
              Manage assignments, track attendance, upload notes, generate AI summaries, and create quizzes — all in one place.
            </p>

            <button
              onClick={() => setShowPopup(false)}
              style={{
                marginTop: "20px",
                padding: "12px 30px",
                fontSize: "18px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                background: "#667eea",
                color: "white"
              }}
            >
              Start 🚀
            </button>
          </div>
        </div>
      )}

      {/* Main App Container */}
      <div
        style={{
          padding: "40px",
          fontFamily: "Arial, sans-serif",
          background: darkMode
            ? "#121212"
            : "linear-gradient(120deg, #494993, #14bcbc)",
          minHeight: "100vh",
          color: "white",
        }}
      >
        <h1 style={{ marginBottom: "30px" }}>🎓 SmartScholar Dashboard</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "20px",
            cursor: "pointer",
            border: "none",
          }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {notification && (
          <div
            style={{
              background: "#00b894",
              color: "white",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontWeight: "bold",
              width: "fit-content",
            }}
          >
            {notification}
          </div>
        )}

        {/* Dashboard Grid */}
        {activeSection === "" && (
          <>
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "40px",
                flexWrap: "wrap",
              }}
            >
              <div style={statsCardStyle}>
                <h3>📚 Assignments</h3>
                <h2>{assignments.length}</h2>
              </div>

              <div style={statsCardStyle}>
                <h3>📅 Attendance</h3>
                <h2>{attendancePercentage}%</h2>
              </div>

              <div style={statsCardStyle}>
                <h3>📝 Notes Uploaded</h3>
                <h2>{notesCount}</h2>
              </div>

              <div style={statsCardStyle}>
                <h3>📂 Assignment Files</h3>
                <h2>{assignmentFiles.length}</h2>
              </div>

              <div style={statsCardStyle}>
                <h3>📖 Total Classes</h3>
                <h2>{totalClasses}</h2>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "40px",
                marginTop: "100px",
              }}
            >
              <button style={cardStyle} onClick={() => setActiveSection("assignment")}>
                <span>📚</span> Assignment Tracker
              </button>
              <button style={cardStyle} onClick={() => setActiveSection("attendance")}>
                <span>📅</span> Attendance Tracker
              </button>
              <button style={cardStyle} onClick={() => setActiveSection("notes")}>
                <span>📝</span> Notes Upload
              </button>
              <button style={cardStyle} onClick={() => setActiveSection("summary")}>
                <span>🤖</span> AI Summary Generator
              </button>
              <button style={cardStyle} onClick={() => setActiveSection("quiz")}>
                <span>❓</span> AI Quiz Generator
              </button>
            </div>
          </>
        )}

        {/* Back Button */}
        {activeSection !== "" && (
          <button style={backButtonStyle} onClick={() => setActiveSection("")}>
            ← Back to Dashboard
          </button>
        )}

        {/* Sections */}
        {activeSection === "assignment" && (
          <div>
            <h2>📚 Assignment Tracker</h2>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                marginRight: "10px",
                padding: "8px",
                borderRadius: "5px",
                border: "none"
              }}
            />
            <input
              type="text"
              placeholder="Enter assignment"
              value={assignment}
              onChange={(e) => setAssignment(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: "none",
                marginRight: "10px",
              }}
            />

            <button
              onClick={addAssignment}
              style={{
                padding: "8px 15px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                background: "#00b894",
                color: "white"
              }}
            >
              Add
            </button>

            <ul style={{ listStyleType: "none", padding: 0 }}>
              {assignments.map((item, index) => (
                <li
                  key={index}
                  style={{
                    margin: "15px 0",
                    padding: "15px",
                    background: darkMode ? "#2c2c2c" : "#ffffff20",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>📝 {item.name} | 📅 {item.dueDate}</span>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this assignment?")) {
                        // Fixed: Using prev to prevent stale closures during deletion
                        setAssignments(prev => prev.filter((_, i) => i !== index));
                      }
                    }}
                    style={{
                      background: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            <h3 style={{ marginTop: "30px" }}>📂 Upload Assignment File</h3>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                // Fixed: Prevents stale file arrays
                setAssignmentFiles(prev => [...prev, file.name]);
                setNotification(`📁 ${file.name} uploaded successfully`);
                setTimeout(() => setNotification(""), 3000);
              }}
              style={{ marginBottom: "20px" }}
            />

            <h3>Uploaded Files</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {assignmentFiles.map((file, index) => (
                <li key={index} style={{ margin: "10px 0" }}>📄 {file}</li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === "attendance" && (
          <div>
            <h2>📅 Attendance Tracker</h2>
            <div style={{ background: darkMode ? "#2c2c2c" : "#ffffff20", padding: "20px", borderRadius: "10px", width: "fit-content" }}>
              <p>Present Days: <strong>{present}</strong></p>
              <p>Absent Days: <strong>{absent}</strong></p>
              <p>Total Classes: <strong>{totalClasses}</strong></p>
              <p>Attendance Percentage: <strong>{attendancePercentage}%</strong></p>
            </div>
            
            <br />

            {attendancePercentage < 75 && totalClasses > 0 && (
              <div
                style={{
                  background: "#e74c3c",
                  color: "white",
                  padding: "12px",
                  borderRadius: "10px",
                  width: "fit-content",
                  marginBottom: "15px",
                  fontWeight: "bold",
                }}
              >
                ⚠️ Warning: Attendance below 75%
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setPresent(prev => prev + 1)} style={{ padding: "10px 15px", borderRadius: "5px", border: "none", cursor: "pointer", background: "#2ecc71", color: "white" }}>
                Mark Present
              </button>
              <button onClick={() => setAbsent(prev => prev + 1)} style={{ padding: "10px 15px", borderRadius: "5px", border: "none", cursor: "pointer", background: "#f39c12", color: "white" }}>
                Mark Absent
              </button>
              <button
                onClick={() => {
                  setPresent(0);
                  setAbsent(0);
                }}
                style={{ padding: "10px 15px", background: "#e74c3c", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                Reset Attendance
              </button>
            </div>
          </div>
        )}

        {activeSection === "notes" && (
          <div>
            <h2>📝 Notes Upload</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
              <input
                type="file"
                accept=".txt,.jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  // Fixed: Prevents notes count from overwriting itself with old data
                  setNotesCount(prev => prev + 1);
                  const reader = new FileReader();

                  reader.onload = (event) => {
                    setNotes(event.target.result);
                  };

                  if (file.type.startsWith("image/")) {
                    reader.readAsDataURL(file);
                  } else {
                    reader.readAsText(file);
                  }
                }}
              />
              <button 
                onClick={() => setNotesCount(0)}
                style={{ padding: "8px 12px", background: "#e74c3c", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px" }}
              >
                Reset Notes Count
              </button>
            </div>
            
            <p style={{ fontStyle: "italic", fontSize: "14px", opacity: 0.8 }}>
              Note: Uploaded files are sent to the AI temporarily, but not saved to storage to save browser space.
            </p>

            <br />
            
            {notes && (notes.startsWith("data:image") ? (
              <img
                src={notes}
                alt="Uploaded Note"
                style={{
                  maxWidth: "500px",
                  borderRadius: "10px",
                  marginTop: "15px",
                }}
              />
            ) : (
              <textarea
                rows="15"
                cols="80"
                value={notes}
                readOnly
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  background: darkMode ? "#2c2c2c" : "white",
                  color: darkMode ? "white" : "black",
                  border: "none",
                  width: "100%",
                  maxWidth: "600px"
                }}
              />
            ))}
          </div>
        )}

        {activeSection === "summary" && (
          <div>
            <h2>🤖 AI Summary Generator</h2>
            <button 
              onClick={generateSummary} 
              style={{ padding: "10px 15px", borderRadius: "5px", border: "none", cursor: "pointer", background: "#9b59b6", color: "white" }}>
              Generate Summary
            </button>
            {summary && (
              <div style={{ marginTop: "20px", background: darkMode ? "#2c2c2c" : "#111b44", padding: "20px", borderRadius: "8px", lineHeight: "1.6" }}>
                {summary}
              </div>
            )}
          </div>
        )}

        {activeSection === "quiz" && (
          <div>
            <h2>❓ AI Quiz Generator</h2>
            <button 
              onClick={generateQuiz} 
              style={{ padding: "10px 15px", borderRadius: "5px", border: "none", cursor: "pointer", background: "#e67e22", color: "white" }}>
              Generate Quiz
            </button>
            {quiz && (
              <div style={{ marginTop: "20px", background: darkMode ? "#2c2c2c" : "#111b44", padding: "20px", borderRadius: "8px", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                {quiz}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;