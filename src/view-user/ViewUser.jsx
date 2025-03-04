import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  filterProblemsByDate,
  filterProblemsByCurrentWeek,
} from "../utils/dateUtils";
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
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const displayToday = () => {
    // if (!userData.problems) {
    //   return <p>No problems added yet.</p>;
    // }
    const today = new Date();
    const dataToday = filterProblemsByDate(userData.problems, today);
    console.log(dataToday);
    return displayProblems(dataToday);
  };

  const displayThisWeek = () => {
    // if (!userData.problems) {
    //   return <p>No problems added yet.</p>;
    // }

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
    <div>
      <h1>{userData.firstname}'s Problems</h1>
      <div>
        <h3>Today's problems:</h3>
        <div>{displayToday()}</div>
      </div>
      <div>
        <h3>This week's problems:</h3>
        <div>{displayThisWeek()}</div>
      </div>
      <h3>All problems:</h3>
      <div>{displayAll()}</div>
    </div>
  );
};

export default ViewUser;
