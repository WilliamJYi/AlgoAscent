import React from "react";
import { useNavigate } from "react-router-dom";
import {
  filterApplicationsByDate,
  filterApplicationsByCurrentWeek,
} from "../utils/dateUtils";
import "./User.css";

const User = ({ user }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/view-user/${user._id}`);
  };

  // Calulate how many applications applied to today
  const calculateApplicationsToday = () => {
    const today = new Date();
    const dataToday = filterApplicationsByDate(user.applications, today);
    return dataToday.length;
  };

  const calculateApplicationsThisWeek = () => {
    const dataThisWeek = filterApplicationsByCurrentWeek(user.applications);
    return dataThisWeek.length;
  };

  return (
    <div className="user-containter" onClick={handleView}>
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
            <span>Today's Apps</span>
          </div>
          <div>
            <p className="stat-value">
              Applications today: {calculateApplicationsToday()}
            </p>
            <p className="stat-value">Daily goal: {user.daily_goal}</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-header">
            <span className="icon purple">📈</span>
            <span>Week's Apps</span>
          </div>
          <p className="stat-value">
            Applications this week: {calculateApplicationsThisWeek()}
          </p>
          <p className="stat-value">Weekly goal: {user.weekly_goal}</p>
        </div>

        <div className="stat-card green">
          <div className="stat-header">
            <span className="icon green">📋</span>
            <span>Total Apps</span>
          </div>
          <p className="stat-value">{user.applications.length}</p>
        </div>
      </div>
    </div>
  );
};

export default User;
