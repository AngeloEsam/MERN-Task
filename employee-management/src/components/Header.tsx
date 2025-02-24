import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/graphql";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ profilePicture?: string } | null>(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const handleTokenChange = useCallback(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  useEffect(() => {
    window.addEventListener("tokenUpdated", handleTokenChange);
    return () => window.removeEventListener("tokenUpdated", handleTokenChange);
  }, [handleTokenChange]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await axios.post(
          API_URL,
          {
            query: `
              query {
                getProfile {
                  email
                  profilePicture
                }
              }
            `,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data?.data?.getProfile) {
          setUser(response.data.data.getProfile);
        } else {
          console.error("❌ No user data found:", response.data);
          setUser(null);
        }
      } catch (error) {
        console.error("🔴 Error fetching profile:", error);
        setUser(null);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("tokenUpdated"));
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        alignItems: "center",
      }}
    >
      <div>
        <Link to="/">My App</Link>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <Link to="/dashboard">Dashboard</Link>
        )}
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={
              user.profilePicture
                ? `http://localhost:3000${user.profilePicture}`
                : "https://via.placeholder.com/40"
            }
            alt="Profile"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Header;
