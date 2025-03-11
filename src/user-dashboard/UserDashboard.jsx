import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import {
  filterProblemsByDate,
  filterProblemsByCurrentWeek,
} from "../utils/dateUtils";
import { DIFFICULTIES, PATTERNS, SOLVED } from "../utils/consts";
import defaultAvatar from "../assets/default-avatar.jpg";
import "./UserDashboard.css";
import AuthContext from "../auth/AuthContext";

const UserDashboard = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { setToken, userData, setUserData } = useContext(AuthContext);
  const id = userData._id;

  const [formData, setFormData] = useState({
    name: "",
    difficulty: "",
    pattern: "",
    completed: "",
    question_link: "",
  });
  const [isOpen, setIsOpen] = useState(false);

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

  /* Update information */
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Convert image to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users/${id}/avatar`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ avatar: base64Image }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload avatar");
        }

        const data = await response.json();
        setUserData((prev) => ({
          ...prev,
          avatar: data.avatar,
        }));
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const problemToAdd = {
        ...formData,
        date_added: new Date().toISOString(),
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(problemToAdd),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add an problem");
      }
      console.log("Problem added successfully");
      setFormData({
        name: "",
        pattern: "",
        difficulty: "",
        completed: "",
        question_link: "",
      });
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
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}/problems/${problemId}`,
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

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      console.log("Successfully deleted account");
      cookies.remove("TOKEN", { path: "/" });
      setToken(null);
      setUserData(null);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /* Display Data */
  const displayProblems = (problems) => {
    if (!problems || problems.length === 0) {
      return (
        <tr>
          <td colSpan="6">No problems added yet.</td>
        </tr>
      );
    }

    return problems.map((problem) => (
      <tr key={problem._id}>
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
    ));
  };

  if (!userData) {
    return <p>Loading user data...</p>; // Show loading message while data is fetched
  }

  return (
    <div className="personal-dashboard-container">
      <div className="heading-container">
        <div className="user-name-avatar-container">
          <label htmlFor="avatar-upload" className="avatar-upload-label">
            <img
              src={userData?.avatar || defaultAvatar}
              alt={`${userData.firstname}'s avatar`}
              className="user-avatar"
            />
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden-file-input"
          />
          <h1 className="user-name-container">
            {userData.firstname} {userData.lastname}
          </h1>
        </div>
        <div className="user-info-container">
          <button className="delete-account" onClick={handleDeleteAccount}>
            Delete Account
          </button>
          <p className="user-problems-completed">
            Total Problems: {userData.problems.length}
          </p>
          <p className="user-joined">
            Joined: {new Date(userData.date_joined).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="problems-container">
        <div className="problems-header">
          <div className="problems-title">Your Problems:</div>
          <button className="open-popup-btn" onClick={togglePopup}>
            Add Problem
          </button>
        </div>

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
            {/* Section for Today's Problems */}
            <tr className="table-title">
              <td colSpan="6">
                <strong>Today's Problems</strong>
              </td>
            </tr>
            {displayProblems(
              filterProblemsByDate(userData.problems, new Date())
            )}
            {/* Section for This Week's Problems */}
            <tr className="table-title">
              <td colSpan="6">
                <strong>This Week's Problems</strong>
              </td>
            </tr>
            {displayProblems(filterProblemsByCurrentWeek(userData.problems))}

            {/* Section for All Problems */}
            <tr className="table-title">
              <td colSpan="6">
                <strong>All Problems</strong>
              </td>
            </tr>
            {displayProblems(userData.problems)}
          </tbody>
        </table>
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
                    type="url"
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

export default UserDashboard;
