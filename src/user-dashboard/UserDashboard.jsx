import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import {
  filterProblemsByDate,
  filterProblemsByCurrentWeek,
} from "../utils/dateUtils";
import { DIFFICULTIES, PATTERNS, SOLVED } from "../utils/consts";
import "./UserDashboard.css";

const AuthComponent = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");

  const [userData, setUserData] = useState();
  const [formData, setFormData] = useState({
    name: "",
    difficulty: "",
    pattern: "",
    completed: "",
    question_link: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getAccess();
  }, []);

  const getAccess = async () => {
    try {
      const response = await fetch("/api/auth/auth-endpoint", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Cannot access page");
      }
      const data = await response.json();
      console.log(data);
      setUserData(data.user);
      setMessage(data.message);
    } catch (error) {
      console.error("Error accessing page:", error);
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset form and close popup
    setFormData({
      name: "",
      pattern: "",
      difficulty: "",
      completed: "",
      question_link: "",
    });

    const problemToAdd = {
      ...formData,
      date_added: new Date().toISOString(),
    };

    try {
      const response = await fetch(`/api/users/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(problemToAdd),
      });

      if (!response.ok) {
        throw new Error("Failed to add an problem");
      }
      console.log("Problem added successfully");
      setUserData((prev) => ({
        ...prev,
        problems: [...prev.problems, problemToAdd],
      }));
    } catch (error) {
      console.error("Error adding problem:", error);
    }
    togglePopup();
  };

  const handleDeleteProblem = async (problemId) => {
    try {
      const response = await fetch(
        `/api/users/${userData._id}/problems/${problemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Update the state after deletion
        const updatedUser = await response.json();
        setUserData((prev) => updatedUser);
      } else {
        console.error("Failed to delete problem");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const displayProblems = (problems) => {
    if (!problems || problems.length === 0) {
      return <p>No problems added yet.</p>;
    }

    return (
      <div className="problem-list">
        <table className="problem-table">
          <thead>
            <tr>
              <th>Problem</th>
              <th>Pattern</th>
              <th>Difficulty</th>
              <th>Solved</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={index}>
                <td>
                  {problem.name}{" "}
                  <a
                    href={problem.question_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🔗
                  </a>
                </td>
                <td>{problem.pattern}</td>
                <td>{problem.difficulty}</td>
                <td>{problem.completed}</td>
                <td>{new Date(problem.date_added).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDeleteProblem(problem._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const displayToday = () => {
    const today = new Date();
    const dataToday = filterProblemsByDate(userData.problems, today);
    console.log(dataToday);
    return displayProblems(dataToday);
  };

  const displayThisWeek = () => {
    const dataThisWeek = filterProblemsByCurrentWeek(userData.problems);

    return displayProblems(dataThisWeek);
  };

  const displayAll = () => {
    return !userData.problems ? (
      <p>No problems added yet.</p>
    ) : (
      displayProblems(userData.problems)
    );
  };

  if (!userData) {
    return <p>Loading user data...</p>; // Show loading message while data is fetched
  }

  return (
    <div className="dashboard-container">
      <div className="heading-container">
        <img
          src={userData.avatar}
          alt={`${userData.name}'s avatar`}
          className="user-avatar"
        />
        <h1>Welcome {userData.firstname}!</h1>
      </div>
      <div className="problems-container">
        <h1>Problems Completed</h1>
        <div>
          <h3>Today's problems:</h3>
          <div>{displayToday()}</div>
          <button className="open-popup-btn" onClick={togglePopup}>
            Add Problem
          </button>
        </div>
        <div>
          <h3>This week's problems:</h3>
          <div>{displayThisWeek()}</div>
        </div>
        <h3>All problems:</h3>
        <div>{displayAll()}</div>
        {isOpen && (
          <div className="popup-overlay">
            <div className="popup-form">
              <button onClick={togglePopup} className="close-btn">
                &times;
              </button>
              <h2>Job Problem</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Problem</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pattern">Pattern</label>
                  <select
                    id="pattern"
                    name="pattern"
                    value={formData.pattern || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      -- Select a pattern --
                    </option>
                    {PATTERNS.map((pattern) => (
                      <option value={pattern}>{pattern}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      -- Select Difficulty --
                    </option>
                    {DIFFICULTIES.map((difficulty) => (
                      <option value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Solved</label>
                  <div className="solved-container">
                    {SOLVED.map((status) => (
                      <label key={status} className="radio-label">
                        <input
                          type="radio"
                          name="completed"
                          value={status}
                          checked={formData.completed === status}
                          onChange={handleChange}
                          required
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="question_link">Question Link</label>
                  <input
                    type="url" /* Changed type to 'url' for validation */
                    id="question_link"
                    name="question_link"
                    value={formData.question_link || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthComponent;
