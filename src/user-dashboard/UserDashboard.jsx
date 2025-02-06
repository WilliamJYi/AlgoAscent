import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import {
  filterApplicationsByDate,
  filterApplicationsByCurrentWeek,
} from "../utils/dateUtils";
import "./UserDashboard.css";

const AuthComponent = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");

  const [userData, setUserData] = useState();
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    link: "",
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", {
      ...formData,
      date_added: new Date().toISOString(),
    });
    // Reset form and close popup
    setFormData({ company: "", position: "", jobLink: "" });
    try {
      const response = await fetch(`/api/users/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          date_added: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add an application");
      }
      console.log("Application added successfully");
    } catch (error) {
      console.error("Error adding application:", error);
    }
    getAccess();
    togglePopup();
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      const response = await fetch(
        `/api/users/${userData._id}/applications/${applicationId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        getAccess();
        // Update the state after deletion
        const updatedUser = await response.json();
        setUserData((prev) => updatedUser);
      } else {
        console.error("Failed to delete application");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
              <th>Actions</th>
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
                <td>
                  <button
                    onClick={() => handleDeleteApplication(job._id)}
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
    const dataToday = filterApplicationsByDate(userData.applications, today);
    console.log(dataToday);
    return displayApplications(dataToday);
  };

  const displayThisWeek = () => {
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
      <h1>Welcome {userData.firstname}!</h1>
      <div>
        <h3>Today's applications:</h3>
        <div>{displayToday()}</div>
        <button className="open-popup-btn" onClick={togglePopup}>
          Add Application
        </button>
      </div>
      <div>
        <h3>This week's applications:</h3>
        <div>{displayThisWeek()}</div>
      </div>
      <h3>All applications:</h3>
      <div>{displayAll()}</div>
      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <button onClick={togglePopup} className="close-btn">
              &times;
            </button>
            <h2>Job Application</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="link">Job Posting Link</label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  value={formData.link || ""}
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
  );
};

export default AuthComponent;
