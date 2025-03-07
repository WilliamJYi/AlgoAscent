import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  filterProblemsByDate,
  filterProblemsByCurrentWeek,
} from "../utils/dateUtils";
import defaultAvatar from "../assets/default-avatar.jpg";
import "./ViewUser.css";

const ViewUser = () => {
  const { id } = useParams(); // Get the user ID from the route
  const [userData, setUserData] = useState(null); // State to hold user data

  useEffect(() => {
    // Fetch user data by ID when component mounts
    fetchUser();
  }, [id]);

  const fetchUser = () => {
    fetch(`/api/users/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  const displayProblems = (problems) => {
    if (!problems || problems.length === 0) {
      return (
        <tr>
          <td colSpan="5">No problems added yet</td>
        </tr>
      );
    }

    return problems.map((problem, index) => (
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
      </tr>
    ));
  };

  if (!userData) {
    return <p>Loading user data...</p>; // Show loading message while data is fetched
  }

  return (
    <div className="public-dashboard-container">
      <div className="heading-container">
        <div className="user-name-avatar-container">
          <label htmlFor="avatar-upload" className="avatar-upload-label">
            <img
              src={userData.avatar || defaultAvatar}
              alt={`${userData.firstname}'s avatar`}
              className="user-avatar"
            />
          </label>
          <h1 className="user-name-container">
            {userData.firstname} {userData.lastname}
          </h1>
        </div>
        <div className="user-info-container">
          <p className="user-problems-completed">
            Problems: {userData.problems.length}
          </p>
          <p className="user-joined">
            Joined: {new Date(userData.date_joined).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="problems-container">
        <table className="problem-table">
          <thead>
            <tr>
              <th>Problem</th>
              <th>Pattern</th>
              <th>Difficulty</th>
              <th>Solved</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-title">
              <td colSpan="5">
                <strong>Today's Problems</strong>
              </td>
            </tr>
            {displayProblems(
              filterProblemsByDate(userData.problems, new Date())
            )}
            <tr className="table-title">
              <td colSpan="6">
                <strong>This Week's Problems</strong>
              </td>
            </tr>
            {displayProblems(filterProblemsByCurrentWeek(userData.problems))}
            <tr className="table-title">
              <td colSpan="6">
                <strong>All Problems</strong>
              </td>
            </tr>
            {displayProblems(userData.problems)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewUser;
