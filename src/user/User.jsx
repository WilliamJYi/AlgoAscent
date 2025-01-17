import React from "react";
import { useNavigate } from "react-router-dom";
import "./User.css";

const User = ({ user }) => {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/update-user/${user._id}`);
  };

  const handleView = () => {
    navigate(`/view-user/${user._id}`);
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
          <h1 className="user-name">{user.name}</h1>
          <p className="user-joined">Joined: {user.date_joined}</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card indigo">
          <div className="stat-header">
            <span className="icon indigo">🎯</span>
            <span>Today's Apps</span>
          </div>
          <p className="stat-value">
            {user.apps_today} / {user.daily_goal}
          </p>
        </div>

        <div className="stat-card purple">
          <div className="stat-header">
            <span className="icon purple">📈</span>
            <span>Week's Apps</span>
          </div>
          <p className="stat-value">
            {user.apps_this_week} / {user.weekly_goal}
          </p>
        </div>

        <div className="stat-card green">
          <div className="stat-header">
            <span className="icon green">📋</span>
            <span>Total Apps</span>
          </div>
          <p className="stat-value">{user.total_apps}</p>
        </div>
      </div>

      <button className="update-button" onClick={handleUpdate}>
        Update Applications
      </button>
    </div>
  );
};

export default User;
