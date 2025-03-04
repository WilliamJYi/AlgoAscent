import React from "react";
import { useNavigate } from "react-router-dom";
import {
  filterProblemsByDate,
  filterProblemsByCurrentWeek,
} from "../utils/dateUtils";
import "./User.css";

const User = ({ user, rank }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/view-user/${user._id}`);
  };

  // Calulate how many problems completed today
  const calculateProblemsToday = () => {
    const today = new Date();
    const dataToday = filterProblemsByDate(user.problems, today);
    return dataToday.length;
  };

  const calculateProblemsThisWeek = () => {
    const dataThisWeek = filterProblemsByCurrentWeek(user.problems);
    return dataThisWeek.length;
  };

  return (
    <div className="user-containter" onClick={handleView}>
      <p className="user-ranking">{rank}</p>
      <div className="user-details">
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className="user-avatar"
        />
        <div>
          <h1 className="user-name">
            {user.firstname} {user.lastname}
          </h1>
          <p className="user-joined">
            Joined: {new Date(user.date_joined).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card indigo">
          <div className="stat-header">
            <span className="icon indigo">🎯</span>
            <span>Today</span>
          </div>
          <p className="stat-value">{calculateProblemsToday()}</p>
        </div>

        <div className="stat-card purple">
          <div className="stat-header">
            <span className="icon purple">📈</span>
            <span>This Week</span>
          </div>
          <p className="stat-value">{calculateProblemsThisWeek()}</p>
        </div>

        <div className="stat-card green">
          <div className="stat-header">
            <span className="icon green">📋</span>
            <span>Total</span>
          </div>
          <p className="stat-value">{user.problems.length}</p>
        </div>
      </div>
    </div>
  );
};

export default User;
