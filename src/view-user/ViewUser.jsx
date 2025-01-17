import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ViewUser.css";

const ViewUser = () => {
  const { id } = useParams(); // Get the user ID from the route
  const [userData, setUserData] = useState(null); // State to hold user data
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    link: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch user data by ID when component mounts
    fetchUser();
  }, [id]);

  const fetchUser = () => {
    fetch(`/users/${id}`)
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
      const response = await fetch(`/users/${id}`, {
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
    fetchUser();
    togglePopup();
  };

  const handleDelete = async (applicationId) => {
    try {
      const response = await fetch(
        `/users/${id}/applications/${applicationId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchUser();
        // Update the state after deletion
        const updatedUser = await response.json();
      } else {
        console.error("Failed to delete application");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!userData) {
    return <p>Loading user data...</p>; // Show loading message while data is fetched
  }

  return (
    <div>
      <h1>{userData.name}</h1>
      <h3>Today's applications:</h3>
      <div className="job-list">
        <h2>Job Applications</h2>
        {userData.applications.length === 0 ? (
          <p>No jobs added yet.</p>
        ) : (
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
              {userData.applications.map((job, index) => (
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
                      onClick={() => handleDelete(job._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button onClick={togglePopup} className="open-popup-btn">
        Add Application
      </button>

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

export default ViewUser;
