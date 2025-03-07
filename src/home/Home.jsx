import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import {
  filterProblemsByDate,
  filterProblemsByCurrentWeek,
} from "../utils/dateUtils";
import defaultAvatar from "../assets/default-avatar.jpg";
import "./Home.css";
import { RANKINGS } from "../utils/consts";

const Home = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  const navigate = useNavigate();

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
      setLoggedInUserId(data.user._id);
    } catch (error) {
      console.error("Error accessing page:", error);
      setLoggedInUserId(null);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      generateDailyData();
    }
  }, [users]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Clean up code here
  const generateDailyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      subDays(new Date(), i)
    ).reverse();

    const formattedDailyData = last7Days.map((date) => {
      const formattedDate = format(date, "MMM dd");
      const dailyProblems = { date: formattedDate };

      users.forEach((user) => {
        const count = user.problems.filter(
          (problem) =>
            new Date(problem.date_added).toLocaleDateString() ===
            date.toLocaleDateString()
        ).length;
        dailyProblems[user.firstname] = count;
      });

      return dailyProblems;
    });

    setDailyData(formattedDailyData);
  };

  // Calulate how many problems completed today
  const calculateProblemsToday = (user) => {
    const today = new Date();
    const dataToday = filterProblemsByDate(user.problems, today);
    return dataToday.length;
  };

  const calculateProblemsThisWeek = (user) => {
    const dataThisWeek = filterProblemsByCurrentWeek(user.problems);
    return dataThisWeek.length;
  };

  const handleView = (id) => {
    loggedInUserId === id ? navigate(`/auth`) : navigate(`/view-user/${id}`);
  };

  const displayUsers = () => {
    if (!users || users.length === 0) {
      return (
        <tr className="table-row">
          <td>No users</td>
        </tr>
      );
    }
    return users
      .sort((user_a, user_b) => user_b.problems.length - user_a.problems.length)
      .map((user, index) => {
        return (
          <tr
            className={index <= 2 ? RANKINGS[index] : "default"}
            key={index}
            onClick={() => handleView(user._id)}
          >
            <td>{index + 1}</td>
            <td>
              <div className="user-details">
                <img
                  src={user.avatar || defaultAvatar}
                  alt={`${user.name}'s avatar`}
                  className="user-avatar"
                />
                <div>
                  <h1 className="user-name">
                    {user.firstname} {user.lastname}
                  </h1>
                </div>
              </div>
            </td>
            <td>{calculateProblemsToday(user)}</td>
            <td>{calculateProblemsThisWeek(user)}</td>
            <td>{user.problems.length}</td>
          </tr>
        );
      });
  };

  if (users.length === 0) {
    return <p>Loading...</p>; // Show loading message while data is fetched
  }

  return (
    <div className="main-container">
      <div>Problem Trend</div>
      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer>
          <LineChart data={dailyData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {/* Create a Line for each user */}
            {users.map((user, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={user.firstname} // Matches user name in dailyData keys
                stroke={`hsl(${index * 60}, 70%, 50%)`} // Generate unique colors
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="users-container">
        <h1>Leaderboard</h1>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Today</th>
              <th>This Week</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>{displayUsers()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
