import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email/${token}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Email verification failed.");
        }

        setMessage("Email successfully verified!");
      } catch (error) {
        response.status(400).json({ error: error.message });
        setMessage("Error verifying email. Please Try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      <p>{message}</p>
      <Link to="/login">Login here</Link>
    </div>
  );
};

export default VerifyEmail;
