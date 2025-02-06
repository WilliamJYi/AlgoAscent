import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  filterApplicationsByDate,
  filterApplicationsByCurrentWeek,
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

  const displayApplications = (applications) => {
    if (!applications || applications.length === 0) {
      return <p>No jobs added yet.</p>;
    }

    return (
      <div className="job-list">
        <table className="job-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Job Posting Link</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((job, index) => (
              <tr key={index}>
                <td>{job.company}</td>
                <td>{job.position}</td>
                <td>
                  <a
                    href={job.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Link
                  </a>
                </td>
                <td>{new Date(job.date_added).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const displayToday = () => {
    // if (!userData.applications) {
    //   return <p>No jobs added yet.</p>;
    // }
    const today = new Date();
    const dataToday = filterApplicationsByDate(userData.applications, today);
    console.log(dataToday);
    return displayApplications(dataToday);
  };

  const displayThisWeek = () => {
    // if (!userData.applications) {
    //   return <p>No jobs added yet.</p>;
    // }

    const dataThisWeek = filterApplicationsByCurrentWeek(userData.applications);

    return displayApplications(dataThisWeek);
  };

  const displayAll = () => {
    return !userData.applications ? (
      <p>No jobs added yet.</p>
    ) : (
      displayApplications(userData.applications)
    );
  };

  if (!userData) {
    return <p>Loading user data...</p>; // Show loading message while data is fetched
  }

  return (
    <div>
      <h1>{userData.firstname}'s Applications</h1>
      <div>
        <h3>Today's applications:</h3>
        <div>{displayToday()}</div>
      </div>
      <div>
        <h3>This week's applications:</h3>
        <div>{displayThisWeek()}</div>
      </div>
      <h3>All applications:</h3>
      <div>{displayAll()}</div>
    </div>
  );
};

export default ViewUser;
